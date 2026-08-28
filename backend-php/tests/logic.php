<?php

/**
 * Framework-siz məntiq testləri.
 *
 * Bu fayl Laravel olmadan işləyir — yalnız App\Support altındakı
 * saf siniflər yoxlanılır: paketlər, qeydiyyat nömrəsi, moderasiya,
 * mətn təmizləmə və Epoint imzalanması.
 *
 * İşlətmək:  php tests/logic.php
 */

declare(strict_types=1);

require __DIR__ . '/../app/Support/Packs.php';
require __DIR__ . '/../app/Support/RegistryNumber.php';
require __DIR__ . '/../app/Support/Moderation.php';
require __DIR__ . '/../app/Support/Sanitizer.php';
require __DIR__ . '/../app/Support/Payments/PaymentProvider.php';
require __DIR__ . '/../app/Support/Payments/SimulationProvider.php';
require __DIR__ . '/../app/Support/Payments/EpointProvider.php';

use App\Support\Moderation;
use App\Support\Packs;
use App\Support\Payments\EpointProvider;
use App\Support\Payments\SimulationProvider;
use App\Support\RegistryNumber;
use App\Support\Sanitizer;

$pass = 0;
$fail = 0;

function check(string $name, bool $ok, mixed $extra = null): void
{
    global $pass, $fail;

    if ($ok) {
        $pass++;
        echo "  ✓ {$name}\n";
    } else {
        $fail++;
        echo "  ✗ {$name}" . ($extra === null ? '' : ' → ' . json_encode($extra, JSON_UNESCAPED_UNICODE)) . "\n";
    }
}

echo "\nPaketlər\n";
$packs = new Packs([
    'p1' => ['id' => 'p1', 'credits' => 1, 'amount' => 1, 'label' => '1 sənəd'],
    'p3' => ['id' => 'p3', 'credits' => 3, 'amount' => 2, 'label' => '3 sənəd', 'best' => true],
]);
check('mövcud paket tapılır', $packs->has('p3'));
check('naməlum paket tapılmır', ! $packs->has('yoxdur'));
check('paket məlumatları normallaşdırılır', $packs->get('p3') === [
    'id' => 'p3', 'credits' => 3, 'amount' => 2.0, 'label' => '3 sənəd', 'note' => '', 'best' => true,
], $packs->get('p3'));
check('siyahı bütün paketləri qaytarır', count($packs->all()) === 2);

$threw = false;
try { $packs->get('yoxdur'); } catch (InvalidArgumentException) { $threw = true; }
check('naməlum paket istisna atır', $threw);

echo "\nQeydiyyat nömrəsi\n";
$regNo = RegistryNumber::generate('ZRF', 2026, static fn (string $c): bool => false);
check('düzgün formatda yaranır', RegistryNumber::isValid($regNo), $regNo);
check('prefiks və il yerindədir', str_starts_with($regNo, 'ZRF-2026-'), $regNo);

$taken = ['ZRF-2026-1111'];
$unique = RegistryNumber::generate('ZRF', 2026, static fn (string $c): bool => in_array($c, $taken, true));
check('tutulmuş nömrə təkrarlanmır', $unique !== 'ZRF-2026-1111');

$exhausted = false;
try {
    RegistryNumber::generate('ZRF', 2026, static fn (string $c): bool => true, 5);
} catch (RuntimeException) {
    $exhausted = true;
}
check('bütün nömrələr tutulubsa istisna atır', $exhausted);

// PHP rəqəm görünüşlü açarları int-ə çevirdiyi üçün cüt-cüt siyahı istifadə edirik
foreach ([
    [' #zrf 2026 9482 ', 'boşluqlu, # ilə'],
    ['zrf-2026-9482',    'kiçik hərflə'],
    ['ZRF20269482',      'ayırıcısız'],
    ['ZRF—2026—9482',    'uzun tire ilə'],
    ['2026-9482',        'prefiksiz'],
    ['9482',             'yalnız 4 rəqəm'],
] as [$input, $desc]) {
    $got = RegistryNumber::normalize($input, 'ZRF', 2026);
    check("normalizasiya ({$desc})", $got === 'ZRF-2026-9482', $got);
}
check('tanınmayan mətn olduğu kimi qalır', RegistryNumber::normalize('salam', 'ZRF', 2026) === 'SALAM');
check('yanlış format rədd edilir', ! RegistryNumber::isValid('SALAM'));
check('qısa nömrə rədd edilir', ! RegistryNumber::isValid('ZRF-2026-948'));

echo "\nModerasiya\n";
$mod = new Moderation('qadağan, ikinci söz');
check('böyük hərflə yazılmış söz tutulur', $mod->flagged('Burada QADAĞAN var'));
check('latın yazılışı tutulur (qadagan)', $mod->flagged('burada qadagan var'));
check('Azərbaycan hərfləri normallaşır', $mod->flagged('İKİNCİ SÖZ burada'));
check('təmiz mətn keçir', ! $mod->flagged('Həftəsonu çölə çıxma etibarnaməsi'));
check('boş siyahı heç nəyi tutmur', ! (new Moderation(''))->flagged('istənilən mətn'));
check('söz sayı düzgün hesablanır', count($mod->words()) === 2, $mod->words());
check('normalize() Azərbaycan hərflərini çevirir',
    Moderation::normalize('Şəkərova GÜNEL') === 'sekerova gunel',
    Moderation::normalize('Şəkərova GÜNEL'));

echo "\nMətn təmizləmə\n";
check('artıq boşluqlar yığılır', Sanitizer::text("  Günel   Şəkərova \n", 60) === 'Günel Şəkərova');
check('uzunluq kəsilir', mb_strlen(Sanitizer::text(str_repeat('a', 100), 10)) === 10);
check('rəqəm sətrə çevrilir', Sanitizer::text(42, 10) === '42');
check('massiv boş sətir verir', Sanitizer::text(['a'], 10) === '');

$multi = Sanitizer::multiline("Birinci\n\n  İkinci  \nÜçüncü\nDördüncü", 600, 3);
check('boş sətirlər atılır və say məhdudlaşır', $multi === "Birinci\nİkinci\nÜçüncü", $multi);
check('CRLF normallaşır', Sanitizer::multiline("Bir\r\nİki", 600, 8) === "Bir\nİki");

check('icazəli dəyər seçilir', Sanitizer::pick('blank', ['notarial', 'blank'], 'notarial') === 'blank');
check('icazəsiz dəyər fallback olur', Sanitizer::pick('hack', ['notarial', 'blank'], 'notarial') === 'notarial');

$tones = ['zarafat', 'xatire'];
check('ton seçilir', Sanitizer::pick('xatire', $tones, 'zarafat') === 'xatire');
check('naməlum ton zarafat olur', Sanitizer::pick('parodiya', $tones, 'zarafat') === 'zarafat');
check('boş ton zarafat olur', Sanitizer::pick(null, $tones, 'zarafat') === 'zarafat');
check('rose palitrası icazəlidir', Sanitizer::pick('rose', ['gold', 'steel', 'burgundy', 'forest', 'ink', 'rose'], 'gold') === 'rose');

echo "\nSimulyasiya provayderi\n";
$sim = new SimulationProvider();
$order = $sim->createOrder([
    'orderId' => 'ZRF123', 'amount' => 2.0, 'currency' => 'AZN', 'description' => 'test',
    'urls' => ['success' => 'https://x.az/?payment=success', 'error' => 'https://x.az/?payment=error', 'callback' => 'https://x.az/api/payments/callback'],
]);
check('sifariş dərhal ödənilmiş sayılır', $order['autoPaid'] === true);
check('yönləndirmə ünvanında sifariş var', str_contains($order['redirectUrl'], 'ZRF123'), $order['redirectUrl']);

$cb = $sim->parseCallback(['order_id' => 'ZRF123', 'status' => 'success']);
check('callback uğurlu statusu tanıyır', $cb['status'] === 'paid');
check('callback uğursuz statusu tanıyır', $sim->parseCallback(['order_id' => 'X', 'status' => 'failed'])['status'] === 'failed');

echo "\nEpoint provayderi\n";
$epoint = new EpointProvider('PUB', 'PRIVKEY', 'https://epoint.az/api/1/request');

$payload = ['public_key' => 'PUB', 'order_id' => 'ZRF999', 'amount' => '2.00'];
$signed  = $epoint->sign($payload);

check('data base64-dür və geri açılır',
    json_decode(base64_decode($signed['data'], true), true) === $payload);

$expected = base64_encode(sha1('PRIVKEY' . $signed['data'] . 'PRIVKEY', true));
check('imza sxemi sənədə uyğundur', $signed['signature'] === $expected, $signed['signature']);
check('öz imzasını təsdiqləyir', $epoint->verify($signed['data'], $signed['signature']));
check('yanlış imzanı rədd edir', ! $epoint->verify($signed['data'], base64_encode('yalan')));

/* Callback: imza yoxlanılır */
$cbPayload = ['order_id' => 'ZRF999', 'status' => 'success', 'transaction' => 'TX-1'];
$cbData    = base64_encode(json_encode($cbPayload, JSON_UNESCAPED_UNICODE));
$parsed    = $epoint->parseCallback(['data' => $cbData, 'signature' => $epoint->signature($cbData)]);
check('düzgün callback oxunur', $parsed['orderId'] === 'ZRF999' && $parsed['status'] === 'paid', $parsed);
check('provayder referansı alınır', $parsed['providerRef'] === 'TX-1');

$rejected = false;
try {
    $epoint->parseCallback(['data' => $cbData, 'signature' => 'saxta']);
} catch (RuntimeException) {
    $rejected = true;
}
check('saxta imzalı callback rədd edilir', $rejected);

/* createOrder — HTTP çağırışı əvəz edilir */
$captured = null;
$fake = new EpointProvider('PUB', 'PRIVKEY', 'https://epoint.az/api/1/request',
    function (string $endpoint, array $form) use (&$captured): array {
        $captured = ['endpoint' => $endpoint, 'form' => $form];

        return ['status' => 'success', 'redirect_url' => 'https://epoint.az/pay/abc', 'transaction' => 'TX-9'];
    });

$created = $fake->createOrder([
    'orderId' => 'ZRF777', 'amount' => 5.0, 'currency' => 'AZN', 'description' => 'Zarafat.az — 10 sənəd',
    'urls' => ['success' => 'https://x.az/?payment=success', 'error' => 'https://x.az/?payment=error', 'callback' => 'https://x.az/api/payments/callback'],
]);

check('ödəniş səhifəsi qaytarılır', $created['redirectUrl'] === 'https://epoint.az/pay/abc');
check('avtomatik ödənilmiş sayılmır', $created['autoPaid'] === false);
check('sorğuda data və signature var', isset($captured['form']['data'], $captured['form']['signature']));

$sentPayload = json_decode(base64_decode($captured['form']['data'], true), true);
check('məbləğ iki onluqla göndərilir', $sentPayload['amount'] === '5.00', $sentPayload['amount'] ?? null);
check('sifariş nömrəsi ötürülür', $sentPayload['order_id'] === 'ZRF777');
check('uğur/xəta ünvanları ötürülür',
    $sentPayload['success_redirect_url'] === 'https://x.az/?payment=success'
    && $sentPayload['error_redirect_url'] === 'https://x.az/?payment=error');

$failed = false;
try {
    (new EpointProvider('PUB', 'PRIV', 'https://x', fn () => ['status' => 'error']))
        ->createOrder(['orderId' => 'A', 'amount' => 1.0, 'currency' => 'AZN', 'description' => '',
                       'urls' => ['success' => '', 'error' => '', 'callback' => '']]);
} catch (RuntimeException) {
    $failed = true;
}
check('provayder xətası istisna atır', $failed);

echo "\n{$pass} keçdi, {$fail} uğursuz\n";
exit($fail > 0 ? 1 : 0);
