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
require __DIR__ . '/../app/Support/RegistryPrefix.php';
require __DIR__ . '/../app/Support/Moderation.php';
require __DIR__ . '/../app/Support/Sanitizer.php';
require __DIR__ . '/../app/Support/TemplateSchema.php';
require __DIR__ . '/../app/Support/Answers.php';
require __DIR__ . '/../app/Support/Payments/PaymentProvider.php';
require __DIR__ . '/../app/Support/Payments/SimulationProvider.php';
require __DIR__ . '/../app/Support/Payments/EpointProvider.php';

use App\Support\Moderation;
use App\Support\Packs;
use App\Support\Payments\EpointProvider;
use App\Support\Payments\SimulationProvider;
use App\Support\RegistryNumber;
use App\Support\RegistryPrefix;
use App\Support\Sanitizer;
use App\Support\Answers;
use App\Support\TemplateSchema;

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

echo "\nŞablona görə prefiks\n";
check('viral şablon öz prefiksini alır',
    RegistryPrefix::for('cole-cixma-vizasi', 'ZRF') === 'CCV',
    RegistryPrefix::for('cole-cixma-vizasi', 'ZRF'));
check('xəritədə olmayan şablon qlobal prefiksdə qalır',
    RegistryPrefix::for('weekend-pass', 'ZRF') === 'ZRF');
check('boş şablon qlobal prefiksdə qalır', RegistryPrefix::for('', 'ZRF') === 'ZRF');
check('null şablon qlobal prefiksdə qalır', RegistryPrefix::for(null, 'ZRF') === 'ZRF');
check('bütün prefikslər yalnız ASCII böyük hərfdir',
    array_values(array_filter(RegistryPrefix::MAP,
        static fn (string $p): bool => preg_match('/^[A-Z]{2,4}$/', $p) !== 1)) === []);
foreach (RegistryPrefix::MAP as $tplId => $prefix) {
    $no = RegistryNumber::generate($prefix, 2026, static fn (string $c): bool => false);
    check("«{$tplId}» nömrəsi düzgün formatdadır", RegistryNumber::isValid($no), $no);
}

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

echo "\nAnket sahələri\n";
check('massiv text()-də hələ də boş qalır', Sanitizer::text(['a'], 10) === '');
check('ad sahəsi hərfləri saxlayır',
    Sanitizer::person('Günel Şəkərova-Əliyeva', 40) === 'Günel Şəkərova-Əliyeva',
    Sanitizer::person('Günel Şəkərova-Əliyeva', 40));
check('ad sahəsi rəqəm və işarələri atır', Sanitizer::person('<b>Elvin</b> 123', 40) === 'bElvinb',
    Sanitizer::person('<b>Elvin</b> 123', 40));
check('ad sahəsi apostrofu saxlayır', Sanitizer::person("Nə'mət", 40) === "Nə'mət");
check('saat düzgün formatda keçir', Sanitizer::clock('23:30') === '23:30');
check('yanlış saat rədd edilir', Sanitizer::clock('25:00') === '');
check('saat olmayan mətn rədd edilir', Sanitizer::clock('sabah') === '');
check('şkala mətn rəqəmi qəbul edir', Sanitizer::scale('7', 1, 10) === 7);
check('şkala aralıqdan kənarı rədd edir', Sanitizer::scale(11, 1, 10) === null);
check('şkala rəqəm olmayanı rədd edir', Sanitizer::scale('yeddi', 1, 10) === null);
check('siyahı adları təmizlənir',
    Sanitizer::list(['Rəşad Quliyev', '  ', 'Tural Əliyev'], 4, 40) === ['Rəşad Quliyev', 'Tural Əliyev'],
    Sanitizer::list(['Rəşad Quliyev', '  ', 'Tural Əliyev'], 4, 40));
check('siyahı say həddini gözləyir', count(Sanitizer::list(['A B', 'C D', 'E F', 'G H', 'I J'], 4, 40)) === 4);
check('siyahı massiv olmayanı rədd edir', Sanitizer::list('Rəşad', 4, 40) === []);
check('çoxseçim say həddini gözləyir', count(Sanitizer::checks(['a', 'b', 'c'], 2, 80)) === 2);
check('çoxseçim massiv olmayanı rədd edir', Sanitizer::checks(null, 5, 80) === []);
check('cədvəl sətirləri iki elementə salınır',
    Sanitizer::rows([['OYUN', 'FIFA'], ['', 'boş etiket'], ['ETİKET']], 5, 40, 80)
        === [['OYUN', 'FIFA'], ['ETİKET', '']],
    Sanitizer::rows([['OYUN', 'FIFA'], ['', 'boş etiket'], ['ETİKET']], 5, 40, 80));
check('cədvəl massiv olmayanı rədd edir', Sanitizer::rows('x', 5, 40, 80) === []);

echo "\nVariant siyahıları\n";
$opts = ['Birinci bənd.', 'İkinci bənd.', 'Üçüncü bənd.', 'Dördüncü bənd.'];

check('üzv variant qəbul olunur', Sanitizer::pickText('İkinci bənd.', $opts, 'Birinci bənd.', 90) === 'İkinci bənd.');
check('kənar dəyər fallback olur', Sanitizer::pickText('SAXTA MƏTN', $opts, 'Birinci bənd.', 90) === 'Birinci bənd.');
check('artıq boşluq normallaşır', Sanitizer::pickText('İkinci   bənd.', $opts, 'X', 90) === 'İkinci bənd.');
check('massiv fallback olur', Sanitizer::pickText(['a'], $opts, 'Birinci bənd.', 90) === 'Birinci bənd.');
check('boş dəyər fallback olur', Sanitizer::pickText(null, $opts, 'Birinci bənd.', 90) === 'Birinci bənd.');

check('çoxseçim yalnız üzvləri saxlayır',
    Sanitizer::pickList(['Üçüncü bənd.', 'SAXTA'], $opts, 1, 4, 90) === ['Üçüncü bənd.'],
    Sanitizer::pickList(['Üçüncü bənd.', 'SAXTA'], $opts, 1, 4, 90));
check('SIRA variant sırasıdır, klik sırası deyil',
    Sanitizer::pickList(['Dördüncü bənd.', 'Birinci bənd.'], $opts, 1, 4, 90) === ['Birinci bənd.', 'Dördüncü bənd.'],
    Sanitizer::pickList(['Dördüncü bənd.', 'Birinci bənd.'], $opts, 1, 4, 90));
check('təkrar atılır',
    Sanitizer::pickList(['Birinci bənd.', 'Birinci bənd.'], $opts, 1, 4, 90) === ['Birinci bənd.']);
check('say həddi gözlənilir',
    count(Sanitizer::pickList($opts, $opts, 1, 2, 90)) === 2);
check('min-dən az seçim boş massiv verir',
    Sanitizer::pickList(['Birinci bənd.'], $opts, 2, 4, 90) === []);
check('sətirli giriş qəbul olunur',
    Sanitizer::pickList("Birinci bənd.\nÜçüncü bənd.", $opts, 1, 4, 90) === ['Birinci bənd.', 'Üçüncü bənd.']);
check('massiv olmayan skalyar olmayan giriş boşdur', Sanitizer::pickList(null, $opts, 1, 4, 90) === []);

check('variantlar sətir-sətir oxunur',
    TemplateSchema::parseOptions("Bir\n\n  İki  \nBir\nÜç", 10, 90) === ['Bir', 'İki', 'Üç'],
    TemplateSchema::parseOptions("Bir\n\n  İki  \nBir\nÜç", 10, 90));
check('boş mətn boş siyahı verir', TemplateSchema::parseOptions('  ', 10, 90) === []);
check('say həddində kəsilir', count(TemplateSchema::parseOptions("a\nb\nc\nd", 2, 90)) === 2);

check('uzun sətir səhv verir',
    (bool) preg_grep('/simvolu aşır/u', TemplateSchema::optionErrors('Bənd variantları', str_repeat('a', 100), 10, 90)));
check('təkrar sətir səhv verir',
    (bool) preg_grep('/təkrarlanır/u', TemplateSchema::optionErrors('Bənd variantları', "Bir\nBir", 10, 90)));
check('həddindən çox sətir səhv verir',
    (bool) preg_grep('/ən çoxu 2 sətir/u', TemplateSchema::optionErrors('Bənd variantları', "a\nb\nc", 2, 90)));
check('düzgün siyahı səhvsizdir', TemplateSchema::optionErrors('Bənd variantları', "Bir\nİki", 10, 90) === []);

check('aralıq normallaşır', TemplateSchema::pickRange(2, 3, 5) === [2, 3]);
check('aralıq MAX_PICK-də kəsilir', TemplateSchema::pickRange(1, 9, 8) === [1, 4]);
check('aralıq variant sayını aşmır', TemplateSchema::pickRange(1, 4, 2) === [1, 2]);
check('max < min düzəlir', TemplateSchema::pickRange(3, 1, 5) === [3, 3]);
check('variantsız aralıq [1,1]', TemplateSchema::pickRange(2, 3, 0) === [1, 1]);

echo "\nAnket cavabları (server tərəfi)\n";
$fields = [
    ['k' => 'teyinat', 't' => 'select', 'label' => 'Təyinat', 'opts' => ['Çayxana', 'Mangal']],
    ['k' => 'sərbəst', 't' => 'select', 'label' => 'S', 'free' => true, 'max' => 40, 'opts' => ['Bir']],
    ['k' => 'ad', 't' => 'text', 'label' => 'Ad', 'person' => true, 'max' => 40],
    ['k' => 'zeiflik', 't' => 'scale', 'label' => 'Z', 'min' => 1, 'max' => 10],
    ['k' => 'saat', 't' => 'time', 'label' => 'Saat'],
    ['k' => 'əlamət', 't' => 'multi', 'label' => 'Ə', 'min' => 1, 'max' => 2, 'opts' => ['Bir', 'İki', 'Üç']],
    ['k' => 'sabit', 't' => 'text', 'label' => 'X', 'auto' => 'Baş ekspert'],
];
/* `k` açarları ASCII olmalıdır — sxem yoxlaması bunu tələb edir; burada
   yalnız `clean()` məntiqi sınanır, ona görə sxem yoxlaması çağırılmır. */
$a = Answers::clean($fields, [
    'teyinat' => 'SAXTA', 'sərbəst' => 'Öz variantım', 'ad' => 'Elvin <b>123</b>',
    'zeiflik' => '99', 'saat' => '25:00', 'əlamət' => ['Üç', 'SAXTA', 'Bir'],
    'sabit' => 'dəyişdirmə cəhdi', 'naməlum' => 'oxunmamalıdır',
]);
check('select kənar dəyəri ilk variantla əvəzləyir', $a['teyinat'] === 'Çayxana', $a['teyinat']);
check('free select sərbəst mətn buraxır', $a['sərbəst'] === 'Öz variantım', $a['sərbəst']);
check('person sahəsi təmizlənir', $a['ad'] === 'Elvin bb', $a['ad']);
check('şkala aralığa salınır', $a['zeiflik'] === 1, $a['zeiflik']);
check('yanlış saat boşalır', $a['saat'] === '', $a['saat']);
check('çoxseçim variant sırasında qayıdır', $a['əlamət'] === ['Bir', 'Üç'], $a['əlamət']);
check('auto sahəsi dəyişdirilə bilmir', $a['sabit'] === 'Baş ekspert', $a['sabit']);
check('naməlum açar oxunmur', ! array_key_exists('naməlum', $a), array_keys($a));

check('yer tutucu əvəzlənir',
    Answers::fill('{{teyinat}} istiqamətində', $a) === 'Çayxana istiqamətində');
check('boş dəyər tire olur', Answers::fill('{{saat}}-da', $a) === '—-da');
check('massiv vergüllə birləşir', Answers::fill('{{əlamət}}', $a) === 'Bir, Üç');
check('naməlum yer tutucu tire olur', Answers::fill('{{yoxdur}}', $a) === '—');

echo "\nAnket sxeminin yoxlanışı\n";
$ok = [['k' => 'teyinat', 't' => 'select', 'label' => 'Təyinat', 'opts' => ['Bir', 'İki']]];
check('düzgün sxem qəbul olunur', TemplateSchema::validate($ok, [], null, '{to} üçün') === [],
    TemplateSchema::validate($ok, [], null, '{to} üçün'));
check('boş sxem qəbul olunur', TemplateSchema::validate(null, [], null, '{to} üçün') === []);
check('massiv olmayan sxem rədd edilir', TemplateSchema::validate(['k' => 'a'], [], null, '') !== []);
check('naməlum tip tutulur',
    (bool) preg_grep('/naməlum tip/u', TemplateSchema::validate([['k' => 'a', 't' => 'yoxdur', 'label' => 'X']], [], null, '')));
check('yanlış açar tutulur',
    (bool) preg_grep('/«k»/u', TemplateSchema::validate([['k' => 'BAD KEY', 't' => 'text', 'label' => 'X']], [], null, '')));
check('təkrar açar tutulur',
    (bool) preg_grep('/təkrarlan/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'text', 'label' => 'X'], ['k' => 'a', 't' => 'text', 'label' => 'Y'],
    ], [], null, '')));
check('etiketsiz sahə tutulur',
    (bool) preg_grep('/label/u', TemplateSchema::validate([['k' => 'a', 't' => 'text']], [], null, '')));
check('variantsız select tutulur',
    (bool) preg_grep('/opts/u', TemplateSchema::validate([['k' => 'a', 't' => 'select', 'label' => 'X']], [], null, '')));
check('multi min/max tutulur',
    (bool) preg_grep('/min/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'multi', 'label' => 'X', 'opts' => ['Bir', 'İki'], 'min' => 3, 'max' => 5],
    ], [], null, '')));
check('multi defolt variantda olmalıdır',
    (bool) preg_grep('/def/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'multi', 'label' => 'X', 'opts' => ['Bir', 'İki'], 'min' => 1, 'max' => 2, 'def' => ['Üç']],
    ], [], null, '')));
check('şkala aralığı tutulur',
    (bool) preg_grep('/şkala/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'scale', 'label' => 'X', 'min' => 5, 'max' => 3],
    ], [], null, '')));
check('iki expiry sahəsi tutulur',
    (bool) preg_grep('/expiry/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'time', 'label' => 'X', 'expiry' => true],
        ['k' => 'b', 't' => 'time', 'label' => 'Y', 'expiry' => true],
    ], [], null, '')));
check('expiry yalnız uyğun tipdə işləyir',
    (bool) preg_grep('/time/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'text', 'label' => 'X', 'expiry' => true],
    ], [], null, '')));
check('uyğunsuz yer tutucu tutulur',
    (bool) preg_grep('/uyğun gəlmir/u', TemplateSchema::validate($ok, [], null, '{{yoxdur}} mətni')));
check('uyğun yer tutucu keçir', TemplateSchema::validate($ok, ['{{teyinat}} qeydi'], '{{teyinat}}', '') === []);
check('anketsiz şablonda yer tutucu tutulur',
    (bool) preg_grep('/anket sahəsi yoxdur/u', TemplateSchema::validate(null, [], null, '{{teyinat}}')));
check('həddindən çox qeyd tutulur',
    (bool) preg_grep('/qeyd/u', TemplateSchema::validate($ok, array_fill(0, 9, 'x'), null, '')));
check('uzun paylaşım mətni tutulur',
    (bool) preg_grep('/Paylaşım/u', TemplateSchema::validate($ok, [], str_repeat('a', 200), '')));
check('naməlum «into» tutulur',
    (bool) preg_grep('/into/u', TemplateSchema::validate([
        ['k' => 'a', 't' => 'text', 'label' => 'X', 'into' => 'yoxdur'],
    ], [], null, '')));

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
