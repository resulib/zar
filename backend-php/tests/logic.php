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
require __DIR__ . '/../app/Support/ReplyKinds.php';
require __DIR__ . '/../app/Support/Moderation.php';
require __DIR__ . '/../app/Support/Sanitizer.php';
require __DIR__ . '/../app/Support/TemplateSchema.php';
require __DIR__ . '/../app/Support/Answers.php';
require __DIR__ . '/../app/Support/Devet.php';
require __DIR__ . '/../app/Support/Payments/PaymentProvider.php';
require __DIR__ . '/../app/Support/Payments/SimulationProvider.php';
require __DIR__ . '/../app/Support/Payments/EpointProvider.php';
require __DIR__ . '/../app/Support/Ai/OpenAiClient.php';
require __DIR__ . '/../app/Support/Ai/TemplateBrief.php';
require __DIR__ . '/../app/Support/Sosial/SosialProvider.php';
require __DIR__ . '/../app/Support/Sosial/ProfilUrl.php';
require __DIR__ . '/../app/Support/Sosial/PublicProvider.php';
require __DIR__ . '/../app/Support/Sosial/Sosial.php';
require __DIR__ . '/../app/Support/Dossier/Dossier.php';
require __DIR__ . '/../app/Support/Dossier/Byuro.php';
require __DIR__ . '/../app/Support/Dossier/Metn.php';
require __DIR__ . '/../app/Support/Dossier/Sxem.php';
require __DIR__ . '/../app/Support/Dossier/Rey.php';

use App\Support\Dossier\Byuro;
use App\Support\Dossier\Dossier as IsQovlugu;
use App\Support\Dossier\Metn;
use App\Support\Dossier\Rey;
use App\Support\Dossier\Sxem;
use App\Support\Moderation;
use App\Support\Packs;
use App\Support\Payments\EpointProvider;
use App\Support\Payments\SimulationProvider;
use App\Support\RegistryNumber;
use App\Support\RegistryPrefix;
use App\Support\ReplyKinds;
use App\Support\Sanitizer;
use App\Support\Answers;
use App\Support\Devet;
use App\Support\TemplateSchema;
use App\Support\Sosial\ProfilUrl;
use App\Support\Sosial\PublicProvider;
use App\Support\Sosial\Sosial;
use App\Support\Ai\OpenAiClient;
use App\Support\Ai\TemplateBrief;

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

echo "\nCavab niyyətləri\n";

check('6 niyyət var', count(ReplyKinds::KINDS) === 6, ReplyKinds::KINDS);
check('hər niyyətin etiketi var',
    array_keys(ReplyKinds::LABELS) === ReplyKinds::KINDS, array_keys(ReplyKinds::LABELS));
check('hər niyyətin prefiksi var',
    array_keys(ReplyKinds::PREFIX) === ReplyKinds::KINDS, array_keys(ReplyKinds::PREFIX));
check('hər niyyətin vəziyyət nişanı var',
    array_keys(ReplyKinds::VERDICT) === ReplyKinds::KINDS, array_keys(ReplyKinds::VERDICT));

/* Prefiks QR kodun URL-inə düşür: RegistryNumber::PATTERN [A-Z]{2,4}.
   «TƏK» yazılsaydı nömrə heç vaxt yoxlanmazdı. */
$badPfx = array_filter(ReplyKinds::PREFIX, static fn (string $p): bool => preg_match('/^[A-Z]{2,4}$/', $p) !== 1);
check('prefikslər yalnız ASCII böyük hərfdir', $badPfx === [], $badPfx);
check('prefikslər unikaldır', count(array_unique(ReplyKinds::PREFIX)) === count(ReplyKinds::PREFIX));

foreach (ReplyKinds::PREFIX as $kind => $pfx) {
    $no = RegistryNumber::format($pfx, 2026, 9482);
    if (! RegistryNumber::isValid($no)) {
        check("«{$kind}» prefiksi ilə nömrə etibarlıdır", false, $no);
        continue;
    }
}
check('hər niyyətin nömrəsi reyestr formatına uyğundur', true);

check('naməlum niyyət rədd edilir', ! ReplyKinds::isValid('silmek'));
check('boş niyyət rədd edilir', ! ReplyKinds::isValid(null));
check('massiv niyyət kimi qəbul edilmir', ! ReplyKinds::isValid(['redd']));
check('tanınan niyyət qəbul edilir', ReplyKinds::isValid('redd'));
check('etiket naməlum niyyətdə boşdur', ReplyKinds::label('yoxdur') === '');
check('prefiks naməlum niyyətdə ehtiyata düşür', ReplyKinds::prefix('yoxdur', 'ZRF') === 'ZRF');

/* Zəncir dərinliyi: tavan aşılanda null qayıdır və çağıran onu 422-yə çevirir. */
check('birinci cavab 1-ci səviyyədir', ReplyKinds::nextDepth(0) === 1);
check('tavana qədər icazə verilir', ReplyKinds::nextDepth(ReplyKinds::MAX_DEPTH - 1) === ReplyKinds::MAX_DEPTH);
check('tavandan sonra null qayıdır', ReplyKinds::nextDepth(ReplyKinds::MAX_DEPTH) === null);
check('tavandan yuxarı da null qayıdır', ReplyKinds::nextDepth(ReplyKinds::MAX_DEPTH + 5) === null);

/* Vəziyyət nişanı yalnız göstəricidir — orijinalın sətri dəyişmir. */
check('rədd cavabı qırmızı nişan verir', ReplyKinds::verdict('redd')['dot'] === 'bad');
check('qəbul cavabı yaşıl nişan verir', ReplyKinds::verdict('qebul')['dot'] === 'ok');
check('etiraz gözləmə nişanı verir', ReplyKinds::verdict('etiraz')['dot'] === 'wait');
check('naməlum niyyətdə nişan yoxdur', ReplyKinds::verdict('yoxdur') === null);


echo "\nDəvətnamə — token, xəritə, qonaqlar\n";

/* Token dəvətnamənin YEGANƏ qorunmasıdır: ünvan, telefon və qonaq siyahısı
   onun arxasındadır. Uzunluq və əlifba marşrut məhdudiyyəti ilə üst-üstə
   düşməlidir, yoxsa yaradılan link 404 verər. */
$t = Devet::token();
check('token 22 simvoldur', strlen($t) === 22, $t);
check('token yalnız ASCII hərf-rəqəmdir', preg_match('/^[A-Za-z0-9]+$/', $t) === 1, $t);
check('token marşrut şablonuna uyğundur', Devet::isToken($t));
check('iki token eyni deyil', Devet::token() !== Devet::token());
check('qısa sətir token sayılmır', ! Devet::isToken('qisa'));
check('boşluqlu sətir token sayılmır', ! Devet::isToken(str_repeat('a', 21) . ' '));
check('massiv token sayılmır', ! Devet::isToken(['a']));

check('gelirem qəbul olunur', Devet::isRsvp('gelirem'));
check('uydurma cavab rədd olunur', ! Devet::isRsvp('gelecem'));
check('boş cavab rədd olunur', ! Devet::isRsvp(''));

/* Xəritə linki ağ siyahıdan keçir — əks halda dəvətnamə açıq yönləndirmə
   vasitəsi olardı: qonaq düyməyə basıb kənar sayta düşərdi. */
$hosts = ['google.com', 'www.google.com', 'maps.app.goo.gl'];
check('icazəli host saxlanılır',
    Devet::mapUrl('https://maps.app.goo.gl/abc', 'Bakı', $hosts) === 'https://maps.app.goo.gl/abc');
check('kənar host atılır və ünvandan link qurulur',
    str_starts_with(Devet::mapUrl('https://pis.example/x', 'Bakı', $hosts),
        'https://www.google.com/maps/search/'));
check('http link qəbul edilmir',
    str_starts_with(Devet::mapUrl('http://google.com/x', 'Bakı', $hosts),
        'https://www.google.com/maps/search/'));
check('oxşar ada malik host aldatmır',
    str_starts_with(Devet::mapUrl('https://google.com.pis.example/x', 'Bakı', $hosts),
        'https://www.google.com/maps/search/'));
check('portlu icazəli host saxlanılır',
    Devet::mapUrl('https://google.com:443/x', 'Bakı', $hosts) === 'https://google.com:443/x');
check('ünvan da yoxdursa link boş qalır', Devet::mapUrl('', '', $hosts) === '');
check('ünvan URL kodlaşdırılır',
    str_contains(Devet::mapUrl('', 'Bakı, Nizami küç. 12', $hosts), 'Bak%C4%B1'));

check('link qonaqsız qurulur',
    Devet::link('https://a.az/', 'T', null) === 'https://a.az/d/T');
check('adlı qonaq linki qurulur',
    Devet::link('https://a.az', 'T', 'Q') === 'https://a.az/d/T/q/Q');

/* Siyahı: boş sətirlər və təkrarlar atılır, sıra qorunur — istifadəçi
   öz siyahısını tanımalıdır. */
$adlar = Devet::guestNames("Rəşad\n\n Aygün \nRəşad\nNərmin", 10, 80);
check('boş sətirlər atılır', count($adlar) === 3, $adlar);
check('təkrar ad bir dəfə düşür', $adlar === ['Rəşad', 'Aygün', 'Nərmin'], $adlar);
check('siyahı həddi işləyir', count(Devet::guestNames("a\nb\nc\nd", 2, 80)) === 2);
check('uzun ad kəsilir', mb_strlen(Devet::guestNames(str_repeat('ə', 200), 10, 80)[0]) === 80);
check('massiv giriş də qəbul olunur', Devet::guestNames(['Ali', 'Vəli'], 10, 80) === ['Ali', 'Vəli']);

/* Yekun serverdə hesablanır ki, kabinetdəki rəqəm qonaq siyahısını
   müştəriyə vermədən də düzgün olsun. */
$q = [
    (object) ['rsvp' => 'gelirem',  'rsvp_count' => 3],
    (object) ['rsvp' => 'gelirem',  'rsvp_count' => null],
    (object) ['rsvp' => 'gelmirem', 'rsvp_count' => null],
    (object) ['rsvp' => null,       'rsvp_count' => null],
    (object) ['rsvp' => 'uydurma',  'rsvp_count' => 9],
];
$y = Devet::tally($q);
check('gələn sayı düzdür', $y['gelirem'] === 2, $y);
check('nəfər sayı boş dəyəri 1 sayır', $y['nefer'] === 4, $y);
check('cavabsızlar sayılır', $y['cavabsiz'] === 2, $y);
check('yekun ümumi say düzdür', $y['hamisi'] === 5, $y);

/* ==================== AI şablon köməkçisi ==================== */
echo "\nAI köməkçisi — OpenAiClient\n";

/* Saxta HTTP: hər çağırışı yazır və növbədəki cavabı qaytarır. */
$calls = [];
$replies = [];
$http = function (string $ep, array $payload, array $headers, int $t) use (&$calls, &$replies): array {
    $calls[] = $payload;

    return array_shift($replies) ?: ['status' => 200, 'body' => '{}'];
};

$replies = [['status' => 200, 'body' => json_encode([
    'model'   => 'gpt-5.4-mini',
    'choices' => [['message' => ['content' => '{"title":"Salam"}']]],
    'usage'   => ['prompt_tokens' => 10, 'completion_tokens' => 20],
])]];
$c = new OpenAiClient('sk-test', 'https://x/y', 10, $http);
$r = $c->chat([['role' => 'user', 'content' => 'a']], ['model' => 'm', 'temperature' => 0.7]);
check('uğurlu cavab oxunur', $r['text'] === '{"title":"Salam"}' && $r['usage']['completion_tokens'] === 20);
check('atılan parametr yoxdur', $r['dropped'] === []);

/* Model `temperature` tanımırsa parametr atılıb yenidən cəhd edilir —
   yeni model çıxanda kodu dəyişmək lazım gəlməsin deyə. */
$calls = [];
$replies = [
    ['status' => 400, 'body' => json_encode(['error' => ['param' => 'temperature', 'message' => 'Unsupported value']])],
    ['status' => 200, 'body' => json_encode(['choices' => [['message' => ['content' => '{}']]]])],
];
$r = (new OpenAiClient('sk-test', 'https://x/y', 10, $http))
    ->chat([['role' => 'user', 'content' => 'a']], ['model' => 'm', 'temperature' => 0.7]);
check('dəstəklənməyən parametr atılır', $r['dropped'] === ['temperature'], $r['dropped']);
check('ikinci cəhddə parametr göndərilmir', ! array_key_exists('temperature', $calls[1]), $calls[1]);

/* `max_completion_tokens` rədd olunanda köhnə ad sınanır. */
$calls = [];
$replies = [
    ['status' => 400, 'body' => json_encode(['error' => ['param' => 'max_completion_tokens', 'message' => 'not supported']])],
    ['status' => 200, 'body' => json_encode(['choices' => [['message' => ['content' => '{}']]]])],
];
(new OpenAiClient('sk-test', 'https://x/y', 10, $http))
    ->chat([['role' => 'user', 'content' => 'a']], ['model' => 'm', 'max_completion_tokens' => 100]);
check('köhnə nəsil üçün max_tokens sınanır', ($calls[1]['max_tokens'] ?? null) === 100, $calls[1]);

$err = null;
$replies = [['status' => 401, 'body' => json_encode(['error' => ['message' => 'bad key']])]];
try {
    (new OpenAiClient('sk-test', 'https://x/y', 10, $http))->chat([], ['model' => 'm']);
} catch (\RuntimeException $e) {
    $err = $e->getMessage();
}
check('401 aydın mesaj verir', $err !== null && str_contains($err, 'OPENAI_API_KEY'), $err);

echo "\nAI köməkçisi — TemplateBrief\n";

$ctx = [
    'tone' => 'zarafat', 'layout' => 'lisenziya', 'layoutName' => 'Lisenziya kartı',
    'typeWord' => 'LİSENZİYA', 'tails' => ['lisenziyası', 'icazəsi', 'vəsiqəsi'],
    'categoryName' => 'Ailə', 'limits' => ['title' => 110, 'preamble' => 700, 'penalty' => 300, 'power_lines' => 8],
];

$sys = TemplateBrief::system($ctx);
check('sistem promptu qadağaları daşıyır',
    str_contains($sys, 'Azərbaycan Respublikası') && str_contains($sys, 'EMOJI OLMAZ'));
check('xatirə tonu ayrıca qaydalar verir',
    str_contains(TemplateBrief::system(['tone' => 'xatire']), 'hədiyyədir'));

$usr = TemplateBrief::user('Xoruldama lisenziyası', $ctx, 'full');
check('istifadəçi promptu başlığın son sözünü tələb edir', str_contains($usr, 'lisenziyası · icazəsi'));

$sc = TemplateBrief::schema('full');
check('sxem strictdir və hər açar məcburidir',
    $sc['strict'] === true
    && $sc['schema']['required'] === array_keys($sc['schema']['properties'])
    && $sc['schema']['additionalProperties'] === false);
check('variant rejimi mətn sahələri istəmir',
    ! array_key_exists('title', TemplateBrief::schema('variant')['schema']['properties']));

/* Model qaydaları pozur: emoji, nömrələnmiş bənd, təkrar variant, real qurum,
   variant siyahısının səhv sırası. `normalize()` hamısını düzəltməlidir. */
$raw = [
    'title'     => 'Gecə Xoruldama Lisenziyası 😀',
    'tag'       => 'Ən çox seçilən',
    'preamble'  => '{from} tərəfindən {to} adlı şəxsə gecə saat 23:00-dan sonra xoruldamaq üçün icazə verilir.',
    'powers'    => ['1. Birinci bənd.', '2. İkinci bənd.', '- Üçüncü bənd.', 'Dördüncü bənd.', 'Dördüncü bənd.'],
    'penalty'   => 'Şərtlər pozulduqda lisenziya dayandırılır.',
    'signOrg'   => 'Səhiyyə Nazirliyi',
    'signTitle' => 'Baş İnspektor',
    'share'     => 'Rəsmiləşdirdim 🛂',
    'titleOptions'   => ['Tamam başqa başlıq', 'Gecə Xoruldama Lisenziyası 😀'],
    'powersOptions'  => ['Beşinci bənd.', 'Birinci bənd.'],
    'penaltyOptions' => ['Başqa cəza bəndi.'],
];
$nz = TemplateBrief::normalize($raw, $ctx, 'full');
$v  = $nz['values'];

check('emoji sənəd mətnindən silinir', ! str_contains($v['title'], '😀'), $v['title']);
check('paylaşım mətnində emoji qalır', str_contains($v['share'], '🛂'), $v['share']);
check('bəndlərdən nömrə atılır', explode("\n", $v['powers'])[0] === 'Birinci bənd.', $v['powers']);
check('təkrar bənd atılır', count(explode("\n", $v['powers'])) === 4, $v['powers']);
check('real qurum adı silinir', $v['sign_org'] === '', $v['sign_org']);
check('real qurum barədə xəbərdarlıq var',
    (bool) array_filter($nz['warnings'], fn ($w) => str_contains($w, 'real qurumu')), $nz['warnings']);

$tOpt = explode("\n", $v['title_options']);
check('titleOptions[0] şablonun öz başlığıdır', $tOpt[0] === $v['title'], $tOpt);
check('təkrarlanan variant atılır', count($tOpt) === count(array_unique($tOpt)), $tOpt);
$pOpt = explode("\n", $v['powers_options']);
check('ilk bənd variantları şablonun öz bəndləridir',
    array_slice($pOpt, 0, 4) === explode("\n", $v['powers']), $pOpt);
check('penaltyOptions[0] şablonun öz cəza bəndidir',
    explode("\n", $v['penalty_options'])[0] === $v['penalty']);
check('powersMax görünən bənd sayını aşmır', (int) $v['powers_max'] <= TemplateSchema::MAX_PICK);

/* Tək variantlı siyahı ziyarətçiyə seçim vermir — boş qaytarılır. */
$one = TemplateBrief::normalize(
    ['title' => str_repeat('a', 60), 'powers' => ['Bir.'], 'penalty' => 'İki.',
     'titleOptions' => [], 'powersOptions' => [], 'penaltyOptions' => []],
    $ctx, 'full',
);
check('boş variant siyahısı boş qalır', $one['values']['title_options'] === '');

/* Uzun mətn SÖZ SƏRHƏDİNDƏ kəsilir — «…təsdiqedic» kimi qırıq söz qalmamalıdır. */
$long = TemplateBrief::normalize([
    'title'   => 'Bir İki Üç Dörd Beş Altı Yeddi Səkkiz Doqquz On Onbir Onikinci Söz Buradadır',
    'preamble' => '{to}',
    'powers'  => [str_repeat('sozcuk ', 30) . 'sonuncusozcuk.'],
    'penalty' => 'İki.',
], ['tone' => 'zarafat', 'limits' => ['title' => 40, 'preamble' => 700, 'penalty' => 300, 'power_lines' => 8]], 'metn');
check('başlıq söz ortasından kəsilmir',
    ! str_ends_with($long['values']['title'], 'Alt') && ! str_contains($long['values']['title'], 'Alt '),
    $long['values']['title']);
check('kəsilmiş başlıq boşluqla bitmir', rtrim($long['values']['title']) === $long['values']['title']);
check('kəsilmə barədə xəbərdarlıq verilir',
    (bool) array_filter($long['warnings'], fn ($w) => str_contains($w, 'qısaldıldı')), $long['warnings']);
check('uzun bənd hədd daxilində qalır',
    mb_strlen(explode("\n", $long['values']['powers'])[0]) <= TemplateBrief::POWER_LINE,
    mb_strlen(explode("\n", $long['values']['powers'])[0]));
check('kəsilmiş bənd tam sözlə bitir',
    str_ends_with(explode("\n", $long['values']['powers'])[0], 'sozcuk'),
    explode("\n", $long['values']['powers'])[0]);

/* Başlığın son sözü blanka uymursa xəbərdarlıq verilir. */
$bad = TemplateBrief::normalize(
    ['title' => 'Gecə Xoruldama Haqqında Rəsmi Qərar', 'preamble' => '{to} üçün.',
     'powers' => ['Bir.'], 'penalty' => 'İki.'],
    $ctx, 'metn',
);
check('yanlış növ sözü tutulur',
    (bool) array_filter($bad['warnings'], fn ($w) => str_contains($w, 'gözlənilən')), $bad['warnings']);
check('{to}/{from} yoxdursa xəbərdarlıq yoxdur (biri var)',
    ! array_filter($bad['warnings'], fn ($w) => str_contains($w, 'nə {to}')), $bad['warnings']);

/* Anket sxemi: «-1» və boş sətir «yoxdur» deməkdir. */
$an = TemplateBrief::normalize([
    'title' => 'A', 'preamble' => '{to}', 'powers' => ['Bir.'], 'penalty' => 'İki.',
    'notes' => ['Birinci qeyd', 'Birinci qeyd', ''],
    'fields' => [
        ['k' => 'Təyinat', 't' => 'select', 'label' => 'Təyinat yeri', 'row' => 'TƏYİNAT',
         'opts' => ['Çayxana', 'Mangal'], 'min' => -1, 'max' => -1, 'unit' => '', 'hint' => ''],
        ['k' => 'ohde', 't' => 'multi', 'label' => 'Öhdəliklər', 'row' => '',
         'opts' => ['Bir', 'İki', 'Üç'], 'min' => -1, 'max' => -1, 'unit' => '', 'hint' => ''],
        ['k' => 'ohde', 't' => 'text', 'label' => 'Təkrar', 'row' => '', 'opts' => [], 'min' => -1, 'max' => -1, 'unit' => '', 'hint' => ''],
        ['k' => 'x', 't' => 'yoxdur', 'label' => 'Naməlum', 'row' => '', 'opts' => [], 'min' => -1, 'max' => -1, 'unit' => '', 'hint' => ''],
    ],
], $ctx, 'anket');
$fields = json_decode($an['values']['fields'], true);
check('naməlum tip və təkrar açar atılır', count($fields) === 2, $fields);
check('açar kiçildilir və ASCII-yə salınır', $fields[0]['k'] === 'teyinat', $fields[0]['k']);
check('boş modifikator serializasiya olunmur', ! array_key_exists('unit', $fields[0]), $fields[0]);
check('multi üçün min/max qurulur',
    $fields[1]['min'] === 1 && $fields[1]['max'] === 3, $fields[1]);
check('anket rejimi variant siyahılarını boşaldır', $an['values']['title_options'] === '');
check('təkrar qeyd atılır', $an['values']['notes'] === 'Birinci qeyd', $an['values']['notes']);
check('sxem serverin öz yoxlamasından keçir',
    TemplateSchema::validate($fields, [], null, '{to}') === [],
    TemplateSchema::validate($fields, [], null, '{to}'));

/* ==================================================================
   Sosial kimlik kartı — link parsinqi, say formatı, kənar mənbə
   ================================================================== */
echo "\nSosial kimlik kartı\n";

$HOSTS = [
    'tiktok'    => ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'm.tiktok.com'],
    'instagram' => ['instagram.com', 'www.instagram.com', 'instagr.am'],
];
$NAMES = ['tiktok' => 'TikTok', 'instagram' => 'Instagram'];
$CFG   = ['platforms' => ['tiktok', 'instagram'], 'limits' => ['name' => 40, 'followers' => 999999999]];

$p = static fn (mixed $t, ?string $fb = null): ?array => ProfilUrl::parse($t, $HOSTS, $fb);

check('tam TikTok linki', $p('https://www.tiktok.com/@aysel_92') === ['platform' => 'tiktok', 'username' => 'aysel_92']);
check('sxemsiz link və sorğu sətri',
    $p('tiktok.com/@aysel_92?is_from_webapp=1') === ['platform' => 'tiktok', 'username' => 'aysel_92']);
check('video linkindən istifadəçi adı',
    $p('https://www.tiktok.com/@scout2015/video/6718335390845095173')['username'] === 'scout2015');
check('Instagram linki və sondakı kəsik',
    $p('https://instagram.com/aysel.92/') === ['platform' => 'instagram', 'username' => 'aysel.92']);
check('paylaşım linki profil deyil', $p('https://www.instagram.com/p/CXY123/') === null);
check('naməlum host rədd edilir', $p('https://facebook.com/aysel') === null);
check('boşluqlu mətn ad sayılmır', $p('salam dunya', 'tiktok') === null);
check('«@ad» seçilmiş platforma ilə',
    $p('@aysel_92', 'tiktok') === ['platform' => 'tiktok', 'username' => 'aysel_92']);
check('platforma seçilməyibsə «@ad» rədd edilir', $p('@aysel_92') === null);
check('boş giriş', $p('') === null && $p(null) === null);
check('ad təmizlənir', ProfilUrl::cleanUsername('@.Ay sel_92!.') === 'Aysel_92');

/* `sosialSayi()` güzgüsü — frontend/doc.js. İki tərəf ayrılsa, endirilmiş PNG
   ilə reyestrdəki nüsxə fərqlənər. */
check('say: minlikdən aşağı olduğu kimi', Sosial::sayi(999) === '999');
check('say: minlik K ilə', Sosial::sayi(12437) === '12,4 K');
check('say: tam K sonda sıfır yazmır', Sosial::sayi(12000) === '12 K');
check('say: milyon M ilə', Sosial::sayi(686358095) === '686,4 M');
check('say: naməlum tire verir (null sıfır DEYİL)', Sosial::sayi(null) === '—');
check('say: mənfi və mətn tire verir', Sosial::sayi(-5) === '—' && Sosial::sayi('abc') === '—');

$vals = Sosial::vals(['platform' => 'tiktok', 'username' => 'aysel_92', 'followers' => 12437], $NAMES);
check('vals: istifadəçi adı @ ilə', $vals['username'] === '@aysel_92', $vals);
check('vals: platformanın görünən adı', $vals['platform'] === 'TikTok');
check('vals: olmayan sahə tire', $vals['posts'] === '—' && $vals['name'] === '—');

check('clean: platformasız blok atılır', Sosial::clean(['username' => 'a'], $CFG) === []);
check('clean: naməlum platforma atılır',
    Sosial::clean(['platform' => 'twitter', 'username' => 'a'], $CFG) === []);
$cl = Sosial::clean([
    'platform' => 'instagram', 'username' => '@Ay sel.92', 'name' => '  Aysel   M.  ',
    'followers' => '12437', 'posts' => -3, 'verified' => true, 'bio' => 'gizli',
], $CFG);
check('clean: ad təmizlənir', $cl['username'] === 'Aysel.92', $cl);
check('clean: boşluqlar yığılır', $cl['name'] === 'Aysel M.', $cl);
check('clean: rəqəm sətri ədədə çevrilir', $cl['followers'] === 12437, $cl);
check('clean: mənfi say qəbul edilmir', ! array_key_exists('posts', $cl), $cl);
check('clean: bio sənədə düşmür', ! array_key_exists('bio', $cl), $cl);
check('texts: moderasiyaya ad və istifadəçi adı gedir',
    Sosial::texts($cl) === ['Aysel.92', 'Aysel M.'], Sosial::texts($cl));

/* PublicProvider — saxta HTTP ilə (OpenAiClient testindəki eyni üsul) */
$EP = ['tiktok_oembed' => 'https://x/oembed', 'instagram_web' => 'https://x/ig', 'instagram_app_id' => '1'];
$calls = [];
$reply = ['status' => 200, 'body' => '{}'];
$http  = static function (string $url, array $h, int $t) use (&$calls, &$reply): array {
    $calls[] = ['url' => $url, 'headers' => $h];
    return $reply;
};

$prov  = new PublicProvider($EP, 5, $http);
$reply = ['status' => 200, 'body' => json_encode(['author_name' => 'Aysel M.'])];
check('tiktok: yalnız görünən ad qayıdır', $prov->fetch('tiktok', 'aysel_92') === ['name' => 'Aysel M.']);
check('tiktok: profil ünvanı kodlanaraq göndərilir',
    str_contains($calls[0]['url'], rawurlencode('https://www.tiktok.com/@aysel_92')), $calls[0]['url']);

$reply = ['status' => 200, 'body' => json_encode(['data' => ['user' => [
    'full_name' => 'Aysel', 'biography' => 'salam', 'is_verified' => true, 'is_private' => false,
    'profile_pic_url_hd' => 'https://cdn/x.jpg',
    'edge_followed_by' => ['count' => 12437], 'edge_owner_to_timeline_media' => ['count' => 284],
]]])];
$ig = $prov->fetch('instagram', 'aysel');
check('instagram: tam dəst açılır',
    $ig['name'] === 'Aysel' && $ig['followers'] === 12437 && $ig['posts'] === 284
    && $ig['verified'] === true && $ig['avatarUrl'] === 'https://cdn/x.jpg', $ig);
check('instagram: app-id başlığı göndərilir',
    in_array('x-ig-app-id: 1', end($calls)['headers'], true), end($calls)['headers']);

/* Uğursuzluq XƏTA DEYİL — kartın yaradılması dayanmamalıdır. */
$reply = ['status' => 403, 'body' => 'Forbidden'];
check('403 boş massiv verir, istisna atmır', $prov->fetch('tiktok', 'aysel_92') === []);
$reply = ['status' => 200, 'body' => 'not json'];
check('pozuq JSON boş massiv verir', $prov->fetch('instagram', 'aysel') === []);
$boom = new PublicProvider($EP, 5, static function (): array { throw new RuntimeException('şəbəkə'); });
check('HTTP istisnası udulur', $boom->fetch('instagram', 'aysel') === []);
check('naməlum platforma sorğu etmir', $prov->fetch('twitter', 'aysel') === []);

echo "\nİş qovluğu\n";

check('slug formatı tanınır', IsQovlugu::isSlug('2026-0847'));
check('səhv slug rədd olunur', ! IsQovlugu::isSlug('2026/0847') && ! IsQovlugu::isSlug('abc-1234'));
check('slug nömrəyə çevrilir', IsQovlugu::nomre('2026-0847') === '2026/0847');
check('nömrə sluga çevrilir', IsQovlugu::slug('2026/0847') === '2026-0847');
check('token 22 simvoldur', strlen(IsQovlugu::token()) === 22 && IsQovlugu::isToken(IsQovlugu::token()));
check('səhv token rədd olunur', ! IsQovlugu::isToken('qisa') && ! IsQovlugu::isToken(str_repeat('a', 30)));
check('tokenlər təkrarlanmır', IsQovlugu::token() !== IsQovlugu::token());

/* «0 dəqiqəyə həll etdi» sertifikatda saxta görünür — ən azı 1 dəqiqə. */
check('dəqiqə yuxarı yuvarlaqlaşır', IsQovlugu::deqiqe(61) === 2, IsQovlugu::deqiqe(61));
check('sıfır saniyə 1 dəqiqədir', IsQovlugu::deqiqe(0) === 1 && IsQovlugu::deqiqe(null) === 1);
check('sertifikat linki qurulur',
    IsQovlugu::certLink('https://x.az/', '2026-0847', str_repeat('a', 22))
    === 'https://x.az/is/2026-0847/hesabat/' . str_repeat('a', 22));

echo "\nİş qovluğu — fiktiv qurum\n";

/* Mətn hüquqi tələbdir, ona görə hərfi yoxlanılır. Sinif sabitidir və
   config deyil: config `.env`-dən oxuna və idarə panelindən boşaldıla bilər. */
check('məcburi qeydin mətni dəqiqdir',
    Byuro::QEYD === 'FİKTİV OYUN SƏNƏDİ — yalnız əyləncə məqsədi ilə hazırlanmışdır. '
        . 'Real hüquqi və ya rəsmi sənəd deyil.', Byuro::QEYD);
check('qısa forma da fiktivliyi deyir',
    str_contains(Byuro::QEYD_QISA, 'FİKTİV') && str_contains(Byuro::QEYD_QISA, 'DEYİL'));
check('büro adı uydurma olduğunu özü deyir', str_contains(Byuro::AD, 'FİKTİV'));
check('büro kodu AFİB-dir', Byuro::QISA === 'AFİB');
check('möhürdə «FİKTİV» var', in_array('FİKTİV', Byuro::MOHUR, true), Byuro::MOHUR);

check('qurum sətirləri üç dənədir', count(Byuro::qurumSetirleri()) === 3);
check('birinci sətir büronun tam adıdır', Byuro::qurumSetirleri()[0] === Byuro::AD);

$bas = Byuro::verqBasligi('AFİB-2026/0847');
check('vərəq başlığı büro kodu daşıyır', str_contains($bas[0], 'AFİB'), $bas[0]);
check('vərəq başlığı iş nömrəsini daşıyır', str_contains($bas[1], 'AFİB-2026/0847'), $bas[1]);

check('iş nömrəsi büro kodu ilə qurulur',
    Byuro::isNomresi('2026-0847') === 'AFİB-2026/0847', Byuro::isNomresi('2026-0847'));
check('səhv slug boş nömrə verir', Byuro::isNomresi('pis-slug') === '');

echo "\nİş qovluğu — sənəd mətni\n";

check('teqlər escape olunur',
    Metn::inline('<b>pis</b>') === '&lt;b&gt;pis&lt;/b&gt;', Metn::inline('<b>pis</b>'));
check('qalın işarəsi açılır', Metn::inline('bir **iki** üç') === 'bir <b>iki</b> üç');
check('qırmızı qeyd açılır',
    Metn::inline('[[Qeyd:]] mətn') === '<span class="redpen">Qeyd:</span> mətn');
check('sətir sonu <br> olur', Metn::inline("bir\niki") === 'bir<br>iki');
check('əvəzləmə işləyir', Metn::inline('{{mustentiq}} gəldi', ['mustentiq' => 'Elçin']) === 'Elçin gəldi');
/* Əvəzləmə ƏN AXIRDA gedir: dəyərin içindəki işarə markup kimi oxunmamalıdır. */
check('əvəzlənən dəyər escape olunur',
    Metn::inline('{{ad}}', ['ad' => '<i>x</i>']) === '&lt;i&gt;x&lt;/i&gt;');
check('dəyərin içindəki qalın işarəsi açılmır',
    Metn::inline('{{ad}}', ['ad' => '**x**']) === '**x**');
check('qalın içindəki əvəzləmə işləyir',
    Metn::inline('**{{ad}}**', ['ad' => 'Elçin']) === '<b>Elçin</b>');
check('massiv boş sətir verir', Metn::inline([]) === '');

echo "\nİş qovluğu — sxem süzgəci\n";

check('adi SVG keçir', Sxem::temizle('<svg><rect x="1"/></svg>') === '<svg><rect x="1"/></svg>');
check('SVG olmayan rədd olunur', Sxem::temizle('<div>x</div>') === '' && Sxem::temizle('salam') === '');
check('script atılır',
    strpos(Sxem::temizle('<svg><script>alert(1)</script><rect/></svg>'), 'script') === false);
check('hadisə atributu atılır',
    strpos(Sxem::temizle('<svg><rect onclick="x()"/></svg>'), 'onclick') === false);
check('kənar href atılır',
    strpos(Sxem::temizle('<svg><a href="https://pis.example">x</a></svg>'), 'pis.example') === false);
check('daxili istinad qalır',
    strpos(Sxem::temizle('<svg><use href="#a"/></svg>'), '#a') !== false ||
    Sxem::temizle('<svg><rect fill="url(#a)"/></svg>') === '<svg><rect fill="url(#a)"/></svg>');
check('foreignObject atılır',
    strpos(Sxem::temizle('<svg><foreignObject><b>x</b></foreignObject></svg>'), 'foreignObject') === false);
check('kənar şəkil atılır',
    strpos(Sxem::temizle('<svg><image href="https://pis.example/a.png"/></svg>'), 'image') === false);

echo "\nİş qovluğu — yekun rəy\n";

$duz = [0, 1, 1];
check('düzgün cavab tanınır', Rey::yoxla([0, 1, 1], $duz) === ['ok' => true, 'tam' => true]);
check('səhv cavab rədd olunur', Rey::yoxla([1, 1, 1], $duz) === ['ok' => false, 'tam' => true]);
/* Natamam cavab cəhd sayılmır — yoxsa səhvən göndərilən forma cəhd yeyərdi. */
check('natamam cavab tam deyil', Rey::yoxla([0, 1], $duz) === ['ok' => false, 'tam' => false]);
check('boş cavab tam deyil', Rey::yoxla([], $duz) === ['ok' => false, 'tam' => false]);
check('mətn cavab tam deyil', Rey::yoxla(['a', 'b', 'c'], $duz)['tam'] === false);
check('artıq cavablar kəsilir', Rey::yoxla([0, 1, 1, 9, 9], $duz)['ok'] === true);
check('normalizasiya sual sayına uyğundur', Rey::normalize([2], 3) === [2, null, null]);
/* Nəticə HANSI bəndin səhv olduğunu heç vaxt açmır. */
check('nəticədə səhv bəndin indeksi yoxdur',
    array_keys(Rey::yoxla([1, 0, 0], $duz)) === ['ok', 'tam']);

echo "\n{$pass} keçdi, {$fail} uğursuz\n";
exit($fail > 0 ? 1 : 0);
