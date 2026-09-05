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
require __DIR__ . '/../app/Support/Dossier/BlokSxemi.php';
require __DIR__ . '/../app/Support/Dossier/Metn.php';
require __DIR__ . '/../app/Support/Dossier/Sxem.php';
require __DIR__ . '/../app/Support/Dossier/Rey.php';
require __DIR__ . '/../app/Support/Dossier/Isare.php';
require __DIR__ . '/../app/Support/Dossier/Sekil.php';
require __DIR__ . '/../app/Support/Dossier/QovluqYoxlayici.php';
require __DIR__ . '/../app/Support/Ai/QovluqBrief.php';
require __DIR__ . '/../app/Support/Dossier/Xp.php';
require __DIR__ . '/../app/Support/Dossier/VesiqeNo.php';
require __DIR__ . '/../app/Support/Dossier/Tarix.php';
require __DIR__ . '/../app/Support/Dossier/SekilYuvalari.php';
require __DIR__ . '/../app/Support/Auth/Google.php';
require __DIR__ . '/../app/Support/Bolmeler.php';

use App\Support\Dossier\BlokSxemi;
use App\Support\Dossier\Byuro;
use App\Support\Dossier\Dossier as IsQovlugu;
use App\Support\Dossier\Isare;
use App\Support\Ai\QovluqBrief;
use App\Support\Dossier\QovluqYoxlayici;
use App\Support\Dossier\Sekil as SekilKomek;
use App\Support\Dossier\Metn;
use App\Support\Dossier\Rey;
use App\Support\Dossier\Xp;
use App\Support\Dossier\VesiqeNo;
use App\Support\Dossier\Tarix;
use App\Support\Dossier\SekilYuvalari;
use App\Support\Dossier\Sxem;
use App\Support\Auth\Google;
use App\Support\Bolmeler;
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

/* Zədələnmiş və işarələnmiş mətn — oyun mexanikasıdır: mətnin hansı hissəsinin
   itdiyi MƏLUMATDA dəqiq göstərilir, render qatı onu tanımır. */
check('əl ilə əlavə açılır', Metn::inline('++söz++') === '<span class="elavesoz">söz</span>');
check('üstündən xətt açılır', Metn::inline('~~söz~~') === '<span class="ustxett">söz</span>');
check('oxunmaz hissə açılır', Metn::inline('((söz))') === '<span class="oxunmaz">söz</span>');
check('dairəyə alınmış söz açılır', Metn::inline('%%söz%%') === '<span class="dairesoz">söz</span>');
/* Tək mötərizə adi mətndir — «(on iki min)» kimi ifadələr pozulmamalıdır. */
check('tək mötərizə toxunulmur', Metn::inline('(on iki min)') === '(on iki min)');

echo "\nİş qovluğu — blok sxemi\n";

/* Sənəd hazır şablon deyil, blokların ardıcıllığıdır. Yoxlayıcı bazaya
   YÜKLƏNMƏZDƏN ƏVVƏL işləyir: səhv olanda render zamanı ağ ekran yox,
   aydın xəta görünməlidir. */
$duz = ['page' => '1', 'content' => ['bloklar' => [
    ['tip' => 'blank'],
    ['tip' => 'basliq', 'ad' => 'QƏRAR'],
    ['tip' => 'metn', 'abzaslar' => ['Bir abzas.']],
]]];
check('düzgün sənəd qəbul olunur', BlokSxemi::yoxla($duz)[0] === [], BlokSxemi::yoxla($duz)[0]);
check('boş blok siyahısı rədd olunur', BlokSxemi::yoxla(['page' => '1', 'content' => []])[0] !== []);

$xeta = static fn (array $bloklar): array => BlokSxemi::yoxla(['page' => '1', 'content' => ['bloklar' => $bloklar]])[0];

check('naməlum blok növü tutulur',
    (bool) preg_grep('/naməlum blok növü/u', $xeta([['tip' => 'cedvell']])));
/* Naməlum açar XƏTADIR: yazı səhvi səssizcə itməməlidir. */
check('naməlum açar tutulur',
    (bool) preg_grep('/naməlum açar/u', $xeta([['tip' => 'basliq', 'ad' => 'X', 'altt' => 'y']])));
check('çatışmayan məcburi açar tutulur',
    (bool) preg_grep('/«abzaslar» açarı yoxdur/u', $xeta([['tip' => 'metn']])));
check('cədvəl sətir uzunluğu tutulur',
    (bool) preg_grep('/xana var, başlıq/u',
        $xeta([['tip' => 'cedvel', 'basliqlar' => ['a', 'b', 'c'], 'setirler' => [['1', '2']]]])));
check('vurğu indeksi tutulur',
    (bool) preg_grep('/vurgu/u',
        $xeta([['tip' => 'cedvel', 'basliqlar' => ['a'], 'setirler' => [['1']], 'vurgu' => [9]]])));
/* Boş DƏYƏR icazəlidir — real blankda doldurulmamış sahə olur. */
check('boş sahə dəyəri icazəlidir',
    $xeta([['tip' => 'sahe', 'setirler' => [['Hava', '']]]]) === []);
check('sxem SVG olmayanı rədd edir',
    (bool) preg_grep('/«<svg»/u', $xeta([['tip' => 'sxem', 'svg' => 'salam']])));
check('nişan koordinatı rəqəm olmalıdır',
    (bool) preg_grep('/rəqəm olmalıdır/u',
        $xeta([['tip' => 'sxem', 'svg' => '<svg></svg>', 'nisanlar' => [['nov' => 'noqte', 'x' => 1]]]])));
check('naməlum əlyazma xarakteri tutulur',
    (bool) preg_grep('/xarakter/u', $xeta([['tip' => 'elyazma', 'metn' => 'x', 'xarakter' => 'qəribə']])));
check('naməlum kənar növü tutulur',
    (bool) preg_grep('/kənar növü/u',
        $xeta([['tip' => 'metn', 'abzaslar' => ['a'], 'kenar' => ['metn' => 'x', 'nov' => 'yoxdur']]])));
check('naməlum mesaj növü tutulur',
    (bool) preg_grep('/mesaj növü/u', $xeta([['tip' => 'yazisma', 'sohbet' => 'X',
        'gunler' => [['mesajlar' => [['nov' => 'video']]]]]])));
check('səsli mesajda müddət tələb olunur',
    (bool) preg_grep('/saniye/u', $xeta([['tip' => 'yazisma', 'sohbet' => 'X',
        'gunler' => [['mesajlar' => [['nov' => 'sesli', 'yon' => 'cixan']]]]]])));

/* Əlyazma bloku QISA mətn üçündür — bu XƏBƏRDARLIQDIR, xəta deyil. */
$uzun = BlokSxemi::yoxla(['page' => '1', 'content' => ['bloklar' => [
    ['tip' => 'elyazma', 'metn' => str_repeat('a', BlokSxemi::ELYAZMA_HEDD + 1)],
]]]);
check('uzun əlyazma xəta deyil, xəbərdarlıqdır',
    $uzun[0] === [] && (bool) preg_grep('/simvolu aşır/u', $uzun[1]));

echo "\nİş qovluğu — fiziki qat və kilid\n";

$kagiz = static fn (array $k): array => BlokSxemi::yoxla(['page' => '1',
    'content' => ['bloklar' => [['tip' => 'metn', 'abzaslar' => ['a']]], 'kagiz' => $k]])[0];

check('üç ağır effekt icazəlidir',
    $kagiz(['leke' => [['nov' => 'qehve']], 'cirilma' => 'sag', 'kseroks' => 2]) === []);
/* Hər vərəq ləkəli və qatlanmış olanda heç biri seçilmir — dizayn qaydası. */
check('dörd ağır effekt rədd olunur',
    (bool) preg_grep('/ağır fiziki effekt/u',
        $kagiz(['leke' => [['nov' => 'qehve']], 'cirilma' => 'sag', 'kseroks' => 2, 'kohnelme' => 3])));
check('köhnəlmə aralığı yoxlanılır', (bool) preg_grep('/0–3/u', $kagiz(['kohnelme' => 7])));
check('naməlum ləkə növü tutulur', (bool) preg_grep('/leke\.nov/u', $kagiz(['leke' => [['nov' => 'süd']]])));
check('naməlum kağız açarı tutulur', (bool) preg_grep('/naməlum açar/u', $kagiz(['kohnelmee' => 1])));

$kilid = static fn (array $k): array => BlokSxemi::yoxla(['page' => '1',
    'content' => ['bloklar' => [['tip' => 'metn', 'abzaslar' => ['a']]]], 'kilid' => $k])[0];

check('rəqəm kilidi dörd rəqəm istəyir',
    (bool) preg_grep('/dörd rəqəm/u', $kilid(['nov' => 'reqem', 'kod' => '12', 'ipucu' => 'uzun ipucu mətni'])));
check('tarix kilidi format istəyir',
    (bool) preg_grep('/GG\.AA/u', $kilid(['nov' => 'tarix', 'kod' => '2011', 'ipucu' => 'uzun ipucu mətni'])));
check('söz kilidi qəbul olunur',
    $kilid(['nov' => 'soz', 'kod' => 'novxana', 'ipucu' => 'uzun ipucu mətni']) === []);
/* İpucusuz tapmaca həll edilə bilməz. */
check('ipucusuz kilid rədd olunur',
    (bool) preg_grep('/ipucu/u', $kilid(['nov' => 'reqem', 'kod' => '0417'])));

$mohur = static fn (array $m): array => BlokSxemi::yoxla(['page' => '1',
    'content' => ['bloklar' => [['tip' => 'metn', 'abzaslar' => ['a']]], 'mohurler' => [$m]]])[0];

check('möhür mətni tələb olunur', (bool) preg_grep('/«metn»/u', $mohur(['forma' => 'daire'])));
/* Möhür mətnin üstünə düşəndə mətn oxunaqlı qalmalıdır. */
check('tam qeyri-şəffaf möhür rədd olunur',
    (bool) preg_grep('/oxunaqlı/u', $mohur(['metn' => ['A'], 'seffaflik' => 0.98])));

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

echo "\nİş qovluğu — mətndaxili nişan\n";

/* Bölmə sırası saxlanılır və heç nə itmir. */
$parca = Isare::bol("Bir.\n{{ sekil:kamera-01 }}\nİki.\n{{ blok:zeng-1 }}\nÜç.");
check('nişanlar sıra ilə ayrılır',
    array_column($parca, 'nov') === ['metn', 'sekil', 'metn', 'blok', 'metn']);
check('şəkil açarı oxunur', $parca[1]['deyer'] === 'kamera-01');
check('blok açarı oxunur', $parca[3]['deyer'] === 'zeng-1');

/* DOLLAR TƏLƏSİ. Əvəzləmə `preg_replace` ilə sətir sağ tərəfi işlətsəydi,
   `$$`, `$&` və `$'` ardıcıllıqları xüsusi oxunar və mətndən itərdi. */
$dollar = Isare::bol('Qiymət 100$ və $& və $\' qalır.');
check('dollar işarələri toxunulmur', $dollar[0]['deyer'] === 'Qiymət 100$ və $& və $\' qalır.');

/* `Metn::fill()` boşluqsuz `{{açar}}` axtarır — iki sistem toqquşmur. */
$vals = Isare::bol('{{mustentiq}} qalır, {{ sekil:a-1 }} açılır.');
check('vals açarı nişan sayılmır', $vals[0]['deyer'] === '{{mustentiq}} qalır, ');
check('vals açarı Metn üçün qalır',
    strpos(Metn::inline('{{mustentiq}}', ['mustentiq' => 'N.Əliyeva']), 'N.Əliyeva') !== false);

/* Prefiksiz və naməlum prefiksli forma nişan DEYİL. */
check('prefiksiz forma nişan deyil', count(Isare::bol('{{ kamera-01 }}')) === 1);
check('naməlum prefiks nişan deyil', count(Isare::bol('{{ ses:kamera-01 }}')) === 1);
/* Böyük hərf əlifbada yoxdur: açar həmişə kiçikdir, «İ» tələsi buradan başlayır. */
check('böyük hərfli açar nişan deyil', count(Isare::bol('{{ sekil:Kamera-01 }}')) === 1);

check('nişanlar toplanır və təkrarlanmır',
    Isare::nisanlar('{{ sekil:a }} {{ sekil:a }} {{ blok:b }}')
    === ['sekil' => ['a'], 'blok' => ['b']]);
check('nişan yazılışı', Isare::yaz('sekil', 'plan-3') === '{{ sekil:plan-3 }}');

/* Slug SERVERDƏ qurulur: JS-də `'İ'.toLowerCase()` iki kod nöqtəsidir və
   brauzerdə qurulan açar serverdəkindən fərqlənərdi. */
check('slug fayl adından qurulur', Isare::slugla('Kamera 01.JPG') === 'kamera-01');
check('slug Azərbaycan hərflərini foldlayır', Isare::slugla('Şəkil İzahı.png') === 'sekil-izahi');
check('slug böyük İ ilə başlayan adı tutur', Isare::slugla('İlkin.jpeg') === 'ilkin');
check('boş ad üçün slug uydurulur', Isare::slugla('  ---  .webp') === 'sekil');
check('slug nişan əlifbasına uyğundur',
    preg_match('/^[a-z0-9][a-z0-9-]*$/', Isare::slugla('2-ci mərtəbə.png')) === 1);

/* Blokun adı da eyni əlifbadadır — nişan onu birbaşa daşıyır. */
check('blok açarı yoxlanılır', BlokSxemi::acarDuzgun('zeng-cedveli') === true);
check('böyük hərfli blok açarı rədd olunur', BlokSxemi::acarDuzgun('Zeng') === false);
check('boşluqlu blok açarı rədd olunur', BlokSxemi::acarDuzgun('zeng cedveli') === false);
/* Nişan açarı `acar` adlanır, `ad` yox: `ad` artıq `basliq` blokunun başlıq
   mətnidir. İki mənalı açar səssiz səhvdir — aşağıdakı iki yoxlama məhz
   ikisinin bir blokda YAN-YANA işlədiyini sübut edir. */
check('«acar» açarı bloklarda icazəlidir',
    BlokSxemi::yoxla(['page' => '1', 'content' => ['bloklar' => [
        ['tip' => 'basliq', 'ad' => 'İSTİNTAQ QRUPU', 'acar' => 'ilk-basliq'],
    ]]])[0] === []);
check('səhv «acar» dəyəri xətadır',
    count(BlokSxemi::yoxla(['page' => '1', 'content' => ['bloklar' => [
        ['tip' => 'basliq', 'ad' => 'BAŞLIQ', 'acar' => 'İLK'],
    ]]])[0]) === 1);

echo "\nİş qovluğu — dərc yoxlayıcısı\n";

/* Tam düzgün qovluq: iki vərəq, bir kod, iki şübhəli, iki sonluq, bir şəkil. */
$duzgunQovluq = [
    'senedler' => [
        ['id' => 1, 'page' => '1', 'name' => 'Protokol', 'body' => 'Sayğac 69 və 18 göstərir. {{ sekil:kadr }}', 'is_locked' => false],
        ['id' => 2, 'page' => '2', 'name' => 'Qutu', 'body' => 'Bağlıdır.', 'is_locked' => true, 'unlock_code_id' => 7],
    ],
    'kodlar'     => [['id' => 7, 'code' => '6918', 'label' => 'Birinci kod', 'source_document_ids' => [1]]],
    'subheliler' => [['id' => 11, 'name' => 'A', 'is_culprit' => true], ['id' => 12, 'name' => 'B', 'is_culprit' => false]],
    'sonluqlar'  => [
        ['suspect_id' => 11, 'is_true_ending' => true,  'verdict_text' => 'Doğru.'],
        ['suspect_id' => 12, 'is_true_ending' => false, 'verdict_text' => 'Yanlış.'],
    ],
    'sekiller' => [['slug' => 'kadr']],
];

$r = QovluqYoxlayici::yoxla($duzgunQovluq);
check('düzgün qovluqda xəta yoxdur', $r['xetalar'] === [], $r['xetalar']);
check('düzgün qovluqda qeyd də yoxdur', $r['qeydler'] === [], $r['qeydler']);
check('nəticə yalnız iki açar daşıyır', array_keys($r) === ['xetalar', 'qeydler']);

/* Xətalar YIĞILIR, atılmır: bir səhv qalanları gizlətməməlidir. */
$pis = QovluqYoxlayici::yoxla(['senedler' => [], 'subheliler' => []]);
check('boş qovluq bir neçə xəta verir', count($pis['xetalar']) >= 2, $pis['xetalar']);

$dey = static function (array $deyisiklik) use ($duzgunQovluq): array {
    return QovluqYoxlayici::yoxla(array_merge($duzgunQovluq, $deyisiklik))['xetalar'];
};

/* 1. Kodun rəqəmləri mənbə vərəqdə yoxdur. */
check('tapılmayan kod rəqəmi xətadır',
    count($dey(['kodlar' => [['id' => 7, 'code' => '5555', 'label' => 'K', 'source_document_ids' => [1]]]])) === 1);
/* Mənbə göstərilməməsi QEYD-dir, xəta yox: seed ilə gələn üç qovluqda bu
   məlumat yoxdur və onları dərc olunmaz etmək səhv olardı. Doldurulanda isə
   rəqəmlər həqiqətən orada axtarılır — yoxlama gücə minir. */
$mensiz = QovluqYoxlayici::yoxla(array_merge($duzgunQovluq,
    ['kodlar' => [['id' => 7, 'code' => '6918', 'label' => 'K', 'source_document_ids' => []]]]));
check('mənbəsiz kod yalnız qeyddir', $mensiz['xetalar'] === [] && count($mensiz['qeydler']) === 1, $mensiz);
check('yad mənbə vərəqi xətadır',
    count($dey(['kodlar' => [['id' => 7, 'code' => '6918', 'label' => 'K', 'source_document_ids' => [99]]]])) === 1);

/* 2. Kilidli vərəqin kodu. */
check('kodsuz kilidli vərəq xətadır', count($dey(['senedler' => [
    ['id' => 1, 'page' => '1', 'name' => 'A', 'body' => '69 18', 'is_locked' => false],
    ['id' => 2, 'page' => '2', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => null],
]])) === 1);

/* 3. Qatil. */
check('qatilsiz iş xətadır', count($dey(['subheliler' => [
    ['id' => 11, 'name' => 'A', 'is_culprit' => false], ['id' => 12, 'name' => 'B', 'is_culprit' => false],
]])) >= 1);
check('iki qatil xətadır', count($dey(['subheliler' => [
    ['id' => 11, 'name' => 'A', 'is_culprit' => true], ['id' => 12, 'name' => 'B', 'is_culprit' => true],
]])) >= 1);

/* 4. Sonluqlar. Sonluq YOXDURSA — səhv deyil: iş köhnə rejimdədir. */
check('sonluqsuz iş xəta vermir', $dey(['sonluqlar' => []]) === []);
check('yarımçıq sonluq siyahısı xətadır',
    count($dey(['sonluqlar' => [['suspect_id' => 11, 'is_true_ending' => true, 'verdict_text' => 'X']]])) === 1);
check('doğru sonluq qatilə aid olmalıdır', count($dey(['sonluqlar' => [
    ['suspect_id' => 11, 'is_true_ending' => false, 'verdict_text' => 'X'],
    ['suspect_id' => 12, 'is_true_ending' => true,  'verdict_text' => 'Y'],
]])) === 1);
check('boş hökm mətni xətadır', count($dey(['sonluqlar' => [
    ['suspect_id' => 11, 'is_true_ending' => true, 'verdict_text' => ''],
    ['suspect_id' => 12, 'is_true_ending' => false, 'verdict_text' => 'Y'],
]])) === 1);

/* 5-6. Nişanlar. */
check('qarşılığı olmayan şəkil nişanı xətadır', count($dey(['sekiller' => []])) === 1);
check('qarşılığı olmayan blok nişanı xətadır', count($dey(['senedler' => [
    ['id' => 1, 'page' => '1', 'name' => 'A', 'body' => '69 18 {{ blok:yoxdur }}', 'is_locked' => false],
    ['id' => 2, 'page' => '2', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => 7],
]])) === 1);
check('açarlanmış blok nişanı qəbul olunur', $dey(['senedler' => [
    ['id' => 1, 'page' => '1', 'name' => 'A', 'body' => '69 18 {{ blok:cedvel }}', 'is_locked' => false,
     'bloklar' => [['tip' => 'cedvel', 'acar' => 'cedvel']]],
    ['id' => 2, 'page' => '2', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => 7],
], 'sekiller' => []]) === []);

/* 7-8. Vərəq nömrələri — HƏMİŞƏ SƏTİR. «14» rəqəm görünüşlüdür və assosiativ
   açar kimi işlədilsəydi 14 ilə eyni yerə düşərdi. */
check('təkrar vərəq nömrəsi xətadır', count($dey(['senedler' => [
    ['id' => 1, 'page' => '14', 'name' => 'A', 'body' => '69 18', 'is_locked' => false],
    ['id' => 2, 'page' => '14', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => 7],
], 'sekiller' => []])) === 1);

$q = QovluqYoxlayici::yoxla(array_merge($duzgunQovluq, ['senedler' => [
    ['id' => 1, 'page' => '', 'name' => 'A', 'body' => '69 18', 'is_locked' => false],
    ['id' => 2, 'page' => '2', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => 7],
], 'sekiller' => []]));
check('boş vərəq nömrəsi yalnız qeyddir', $q['xetalar'] === [] && count($q['qeydler']) === 1, $q);

/* 9-10. Qeydlər. */
$q2 = QovluqYoxlayici::yoxla(array_merge($duzgunQovluq, ['sekiller' => [['slug' => 'kadr'], ['slug' => 'artiq']]]));
check('istifadəsiz şəkil qeyddir', $q2['xetalar'] === [] && count($q2['qeydler']) === 1, $q2);

$q3 = QovluqYoxlayici::yoxla(array_merge($duzgunQovluq, ['senedler' => [
    ['id' => 1, 'page' => '1', 'name' => 'A', 'body' => '69 18', 'draft_body' => 'yeni mətn', 'is_locked' => false],
    ['id' => 2, 'page' => '2', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => 7],
], 'sekiller' => []]));
check('dərc olunmamış qaralama qeyddir', $q3['xetalar'] === [] && count($q3['qeydler']) === 1, $q3);
/* Yoxlayıcı QARALAMANI oxumur: nişan dərc olunmuş mətndə axtarılır. */
check('qaralamadakı nişan yoxlanmır', QovluqYoxlayici::yoxla(array_merge($duzgunQovluq, ['senedler' => [
    ['id' => 1, 'page' => '1', 'name' => 'A', 'body' => '69 18', 'draft_body' => '{{ sekil:yoxdur }}', 'is_locked' => false],
    ['id' => 2, 'page' => '2', 'name' => 'B', 'body' => '', 'is_locked' => true, 'unlock_code_id' => 7],
], 'sekiller' => []]))['xetalar'] === []);

echo "\nİş qovluğu — şəkil faylı\n";

check('fayl adı 32 onaltılıq simvoldur', preg_match('/^[a-f0-9]{32}\.jpg$/', SekilKomek::ad()) === 1);
check('fayl adı təkrarlanmır', SekilKomek::ad() !== SekilKomek::ad());
check('şəkil olmayan bayt rədd olunur', SekilKomek::olcu('salam, bu şəkil deyil') === null);

if (function_exists('imagecreatetruecolor')) {
    ob_start();
    imagepng(imagecreatetruecolor(40, 20));
    $png = (string) ob_get_clean();

    check('PNG tanınır', SekilKomek::olcu($png) === [40, 20]);
    $jpeg = SekilKomek::olcule($png, 10);
    check('ölçülmə JPEG qaytarır', $jpeg !== null && SekilKomek::olcu((string) $jpeg) !== null);
    /* Uzun tərəf hədddir; kiçik şəkil BÖYÜDÜLMÜR. */
    check('uzun tərəf hədddən keçmir', SekilKomek::olcu((string) $jpeg)[0] === 10);
    check('kiçik şəkil böyüdülmür', SekilKomek::olcu((string) SekilKomek::olcule($png, 900))[0] === 40);
}

/* ------------------------------------------------------------------ *
 | Müstəntiq profili — XP düsturu və vəsiqə nömrəsi
 * ------------------------------------------------------------------ */

echo "\nXP düsturu\n";

/* Baza dəyərləri: bonussuz, cəzasız, kodsuz oyun. */
check('baza asan',  Xp::hesabla('asan',  false, false, false, 0) === 20);
check('baza orta',  Xp::hesabla('orta',  false, false, false, 0) === 40);
check('baza cetin', Xp::hesabla('cetin', false, false, false, 0) === 70);
check('baza kabus', Xp::hesabla('kabus', false, false, false, 0) === 120);

/* Naməlum çətinlik `orta`-ya düşür — seed pozulsa da hesablama dayanmır. */
check('naməlum çətinlik ortaya düşür', Xp::hesabla('yoxdur', false, false, false, 0) === 40);

/* Bonuslar TOPLANIR, vurulmur: 1 + 0.5 + 0.3 = 1.8 */
check('doğru sonluq ×1.5', Xp::hesabla('orta', true,  false, false, 0) === 60);
check('ilk cəhd ×1.3',     Xp::hesabla('orta', false, true,  false, 0) === 52);
check('ikisi birlikdə ×1.8', Xp::hesabla('orta', true, true, false, 0) === 72);

/* Kod bonusu SABİTDİR və faizlərdən SONRA gəlir. */
check('kod bonusu +20', Xp::hesabla('orta', true, true, true, 0) === 92);
check('kod bonusu çətinlikdən asılı deyil',
    Xp::hesabla('asan', false, false, true, 0) - Xp::hesabla('asan', false, false, false, 0) === 20);

/* Səhv ittiham ilk-cəhd bonusunu da söndürür — ikisi bir göstəricidir. */
check('bir səhv: bonus sönür və 10 çıxılır', Xp::hesabla('orta', true, true, true, 1) === 70);
check('iki səhv 20 aparır',   Xp::hesabla('orta', true, true, true, 2) === 60);
check('cəza xəttidir', Xp::hesabla('kabus', true, false, false, 3) === 150);

/* SIFIR DÖŞƏMƏSİ — bir işdən qazanılan xal mənfi olmur. */
check('sıfır döşəməsi', Xp::hesabla('asan', false, false, false, 99) === 0);
check('döşəmə mənfi qaytarmır', Xp::hesabla('kabus', true, true, true, 1000) === 0);
check('mənfi səhv sayı cəza vermir', Xp::hesabla('orta', false, false, false, -5) === 40);

/* Tavanlar — rütbə eşikləri məhz bunların üzərində ölçülüb. */
check('tavan asan 56',  Xp::tavan('asan')  === 56);
check('tavan orta 92',  Xp::tavan('orta')  === 92);
check('tavan cetin 146', Xp::tavan('cetin') === 146);
check('tavan kabus 236', Xp::tavan('kabus') === 236);

/* İKİNCİ RÜTBƏ ZƏMANƏTLİDİR: pulsuz `orta` işin ƏN PİS nəticəsi — iki
   uğursuz cəhd, kod tapılmadan — dəqiq 40 xaldır, yəni ikinci pillənin
   həddi. Bu, «ilk addım asan olsun» tələbinin ədədi sübutudur. */
check('pulsuz işin ən pis halı ikinci rütbəyə çatdırır',
    Xp::hesabla('orta', true, false, false, 2) === 40);

/* Konfiqurasiya parametr kimi ötürülür — sinif çərçivəsizdir. */
$cfgXp = ['baza' => ['orta' => 100], 'dogru_sonluq' => 1.0, 'ilk_cehd' => 0.0,
          'kodlar' => 5, 'sehv_ceza' => 1];
check('parametrlər nəzərə alınır', Xp::hesabla('orta', true, true, true, 1, $cfgXp) === 204);

echo "\nVəsiqə nömrəsi\n";

check('format', VesiqeNo::format('CA', 26, 147) === 'CA-26-0147');
check('kod böyük hərfə çevrilir', VesiqeNo::format('ca', 26, 1) === 'CA-26-0001');
check('il iki rəqəmə qısalır', VesiqeNo::format('KR', 2026, 5) === 'KR-26-0005');
check('tavan aşılmır', VesiqeNo::format('XT', 26, 99999) === 'XT-26-9999');
check('sıfır birə yuvarlanır', VesiqeNo::format('TE', 26, 0) === 'TE-26-0001');

check('nizam düzgünü qəbul edir', VesiqeNo::keceli('KC-26-0147'));
check('kiçik hərf rədd olunur',   ! VesiqeNo::keceli('kc-26-0147'));
check('beş rəqəm rədd olunur',    ! VesiqeNo::keceli('KC-26-01470'));
check('üç hərf rədd olunur',      ! VesiqeNo::keceli('KCX-26-0147'));
check('ayırıcı məcburidir',       ! VesiqeNo::keceli('KC260147'));

$parse = VesiqeNo::parse('TE-26-0042');
check('təhlil geri qaytarır', $parse === ['kod' => 'TE', 'il' => 26, 'n' => 42], $parse);
check('pozuq nömrə null verir', VesiqeNo::parse('yoxdur') === null);
check('önək', VesiqeNo::onek('CA', 26) === 'CA-26-');
check('sıra çıxarılır', VesiqeNo::sira('CA-26-0147') === 147);
check('pozuq nömrədə sıra sıfırdır', VesiqeNo::sira('yanlis') === 0);
check('boş nömrədə sıra sıfırdır', VesiqeNo::sira(null) === 0);

/* LEKSİKOQRAFİK SIRA = ƏDƏDİ SIRA.
   `ProfileService::issueBadge()` növbəti nömrəni `ORDER BY badge_number DESC`
   ilə tapır — sıfırla doldurulma olmasaydı «CA-26-9» «CA-26-10»-dan böyük
   görünərdi və nömrələr təkrarlanardı. */
$nomreler = [];
for ($i = 1; $i <= 200; $i++) {
    $nomreler[] = VesiqeNo::format('CA', 26, $i * 7 % 9999 + 1);
}
$sirali = $nomreler;
sort($sirali, SORT_STRING);
$ededi = $nomreler;
usort($ededi, static fn ($a, $b) => VesiqeNo::sira($a) <=> VesiqeNo::sira($b));
check('leksikoqrafik sıra ədədi sıra ilə üst-üstə düşür', $sirali === $ededi);

echo "\nİş qovluğu — AI cavabına etibar edilmir\n";

$xamSkelet = [
    'title'  => 'Anbarda gecə növbəsi 😀',
    'place'  => 'Sumqayıt',
    'period' => 'sentyabr',
    'blurb'  => 'Qısa mətn',
    'intro'  => 'Giriş',
    'suspects' => array_map(static fn (int $i): array => [
        'init' => 'AB', 'name' => 'Şübhəli ' . $i, 'role' => 'rol', 'bio' => 'bio',
        'camera' => 'kamera', 'bars' => [[$i * 10, 200]],
    ], [1, 2, 3, 4]),
    'culprit'      => 'Şübhəli 2',
    'motive'       => 'Motiv',
    'motive_wrong' => ['A', 'B', 'C'],
    'proof'        => 'Sübut',
    'proof_wrong'  => ['D', 'E', 'F'],
    'chronology'   => [['23:40', 'Hadisə'], ['bir']],
    'axis'         => ['23:30', '01:30', '05:00', '09:00'],
    'solution'     => ['Bir', 'İki'],
    'documents'    => array_map(static fn (int $i): array => [
        'name' => 'Sənəd ' . $i, 'kind' => 'Protokol',
        'doc_type' => $i === 2 ? 'uydurma' : 'protocol',
        'blank_nov' => $i === 2 ? 'yalan' : 'protokol',
        'brief' => 'tapşırıq',
    ], [1, 2, 3]),
    'lock' => ['code' => '69-18', 'hint' => 'ipucu', 'doc' => 3, 'sources' => [1, 3, 99]],
];

['skelet' => $sk, 'problems' => $pr] = QovluqBrief::normalizeSkelet($xamSkelet, 3);

check('emoji silinir', $sk['title'] === 'Anbarda gecə növbəsi');
/* Qatil ADA görə tapılır — indeks deyil. Model `culprit: 3` yazıb motivdə
   başqa şəxsi adlandıra bilər; ad isə mətnlə birbaşa tutuşdurulur. */
check('qatil ada görə tapılır', $sk['culprit'] === 1);
/* Model bəzən «Hüseynli Kamran» yazır, siyahıda isə «Hüseynli Kamran Ənvər
   oğlu» durur — soyad üzrə də tapılmalıdır. Adlar burada ayrıca verilir,
   çünki yuxarıdakı sınaq şübhəliləri eyni sözlə başlayır. */
$adli = $xamSkelet;
$adli['suspects'] = array_map(static function (array $x, string $ad): array {
    $x['name'] = $ad;
    return $x;
}, $adli['suspects'], ['Əliyev Nurlan Rəşad oğlu', 'Hüseynli Kamran Ənvər oğlu',
                       'Qasımova Nərgiz Elman qızı', 'Səlimov Tural Vahid oğlu']);
$adli['culprit'] = 'Qasımova Nərgiz';
check('soyada görə də tapılır',
    QovluqBrief::normalizeSkelet($adli, 3)['skelet']['culprit'] === 2);
$tapilmayan = QovluqBrief::normalizeSkelet(array_merge($xamSkelet, ['culprit' => 'Yad Adam']), 3);
check('tapılmayan qatil bildirilir və birinciyə düşür',
    $tapilmayan['skelet']['culprit'] === 0
    && count(array_filter($tapilmayan['problems'], static fn (string $x): bool => str_contains($x, 'siyahısında yoxdur'))) === 1);
/* Motiv BAŞQA şübhəlidən danışırsa, qovluq öz-özü ilə ziddiyyətlidir:
   birinci sual bir adı, ikinci sual başqasını göstərir. */
$zidd = QovluqBrief::normalizeSkelet(
    array_merge($xamSkelet, ['culprit' => 'Şübhəli 1', 'motive' => 'Şübhəli 4 pulu götürüb.']), 3
);
check('qatil-motiv ziddiyyəti bildirilir',
    count(array_filter($zidd['problems'], static fn (string $x): bool => str_contains($x, 'Motiv mətni'))) === 1,
    $zidd['problems']);
check('naməlum sənəd növü ağ siyahıya düşür', $sk['documents'][1]['doc_type'] === 'other');
check('naməlum blank növü ağ siyahıya düşür', $sk['documents'][1]['blank_nov'] === 'resmi');
/* Vərəq nömrələri SIRADAN qurulur — model onları təkrarlaya bilər. */
check('vərəq nömrələri sıradan qurulur',
    array_column($sk['documents'], 'page') === ['1', '2', '3']);
check('artıq ox sətri kəsilir', count($sk['axis']) === 3);
check('natamam xronologiya sətri atılır', count($sk['chronology']) === 1);
check('alibi zolağı 0–100 aralığına sığır', $sk['suspects'][0]['bars'][0][1] <= 100);

/* Kod dörd rəqəmə endirilir, öz vərəqi mənbə sayılmır, yad nömrə atılır. */
check('kod yalnız rəqəmlərdən qurulur', $sk['lock']['code'] === '6918');
check('kodun öz vərəqi mənbə deyil', ! in_array(3, $sk['lock']['sources'], true));
check('mövcud olmayan mənbə atılır', $sk['lock']['sources'] === [1]);

/* Suallar MODELDƏN soruşulmur — qurulur. Birinci sualın variantları
   şübhəli adlarının EYNİ sırasıdır: idarə paneli qatili məhz bundan çıxarır. */
check('üç sual qurulur', count($sk['questions']) === 3);
check('birinci sualın variantları şübhəli adlarıdır',
    $sk['questions'][0]['options'] === array_column($sk['suspects'], 'name'));
check('birinci sualın cavabı qatildir', $sk['questions'][0]['correct'] === $sk['culprit']);
check('motiv sualının ilk variantı düzgündür', $sk['questions'][1]['options'][0] === 'Motiv');

/* Real qurum adı silinmir — XƏBƏRDARLIQ olur. Səssizcə silmək mətni
   pozardı; idarəçi onu görüb düzəltməlidir. */
$pis = QovluqBrief::normalizeSkelet(
    array_merge($xamSkelet, ['intro' => 'Daxili İşlər Nazirliyi məlumat verdi.']), 3
);
check('real qurum adı xəbərdarlıq verir',
    count(array_filter($pis['problems'], static fn (string $x): bool => str_contains($x, 'real qurum'))) === 1,
    $pis['problems']);

echo "\nİş qovluğu — AI vərəq mətni\n";

$govde = QovluqBrief::govde("## Başlıq\n- siyahı\nSaat **23:40** 🚔\n\n\n\n[[Qeyd]]");
check('markdown başlığı atılır', ! str_contains($govde, '#'));
check('siyahı nişanı atılır', ! str_contains($govde, '- siyahı'));
check('emoji atılır', ! str_contains($govde, '🚔'));
/* İşarələr QALIR: `Metn::inline()` onları oxuyur və vərəqin dili budur. */
check('qalın işarəsi qalır', str_contains($govde, '**23:40**'));
check('qırmızı qələm qalır', str_contains($govde, '[[Qeyd]]'));
check('artıq boş sətirlər yığılır', ! str_contains($govde, "\n\n\n"));

$partiya = QovluqBrief::normalizeSenedler(['documents' => [
    ['no' => 2, 'meta_line' => 'Protokol № 2', 'body' => 'Mətn'],
    ['no' => 0, 'meta_line' => 'yad', 'body' => 'atılmalıdır'],
]]);
check('vərəqlər nömrəyə görə açarlanır', array_keys($partiya) === [2]);

echo "\nİş qovluğu — AI blokları\n";

/* ƏSAS İDDİA: blokları MODEL YAZMIR, biz qururuq — ona görə nəticə həmişə
   `BlokSxemi`-dən keçir. Model blok JSON-u yazsaydı, on üç növün açar
   cədvəlini əzbərləməli olardı və naməlum açar XƏTA sayılır. */
$xamSened = [
    'meta_line' => 'Protokol № 2 · 14.09.2026',
    'body'      => "Birinci abzas **qalın** ilə.\n\nİkinci abzas.",
    'sahe'      => [['ad' => 'Kimdən', 'deyer' => 'A.Məmmədova'], ['ad' => '', 'deyer' => 'atılmalı']],
    /* Xana sayı QƏSDƏN əskikdir. */
    'cedvel'    => ['basliqlar' => ['Saat', 'Hadisə', 'Qeyd'],
                    'setirler'  => [['23:40', 'növbə'], ['00:15', 'işıq', 'kəsildi']]],
    'yazisma'   => ['sohbet' => 'Anbar', 'gorulme' => '00:52', 'mesajlar' => [
        ['saat' => '23:50', 'yon' => 'cixan', 'metn' => 'Buradasan?'],
        ['saat' => '23:52', 'yon' => 'uydurma', 'metn' => 'Çıxıram.'],
        ['saat' => '23:53', 'yon' => 'gelen', 'metn' => ''],
    ]],
    'zeng'      => [['saat' => '00:12', 'yon' => 'cixan', 'abunec' => '«Anbar»', 'muddet' => '40 san'],
                    ['saat' => '', 'yon' => 'gelen', 'abunec' => 'boş saat', 'muddet' => '']],
    'kart'      => [['ad' => 'Metal açar', 'metn' => 'Anbar açarı.'], ['ad' => '', 'metn' => 'adsız']],
    'foto'      => [['izah' => 'Giriş qapısı']],
    'imza'      => ['vezife' => 'AFİB müstəntiqi', 'ad' => 'E.Məmmədov'],
];

$c = QovluqBrief::bloklar($xamSened, 'Baxış protokolu', 'protokol', 2, '2026/0001');
$tipler = array_column($c['bloklar'], 'tip');

check('blank hər vərəqdə birincidir', $tipler[0] === 'blank');
check('blankın növü saxlanılır', $c['bloklar'][0]['nov'] === 'protokol');
check('başlıq ikincidir', $tipler[1] === 'basliq');
check('meta sətri başlığın altındadır', $c['bloklar'][1]['alt'] === 'Protokol № 2 · 14.09.2026');
check('bütün struktur blokları qurulur',
    array_intersect(['sahe', 'metn', 'cedvel', 'yazisma', 'zeng', 'kart', 'foto', 'imza'], $tipler)
    === array_values(array_intersect(['sahe', 'metn', 'cedvel', 'yazisma', 'zeng', 'kart', 'foto', 'imza'], $tipler)),
    $tipler);
check('imza sonuncudur', end($tipler) === 'imza');

$tap = static function (string $tip) use ($c): array {
    foreach ($c['bloklar'] as $b) {
        if ($b['tip'] === $tip) {
            return $b;
        }
    }
    return [];
};

/* Cədvəlin xana sayı başlıq sayına BƏRABƏRLƏŞDİRİLİR — `BlokSxemi` fərqi
   xəta sayır və model tez-tez bir xananı unudur. */
check('cədvəl xanaları bərabərləşdirilir',
    count($tap('cedvel')['setirler'][0]) === 3 && $tap('cedvel')['setirler'][0][2] === '—');
check('boş sahə sətri atılır', count($tap('sahe')['setirler']) === 1);
check('naməlum istiqamət «gelen»-ə düşür',
    $tap('yazisma')['gunler'][0]['mesajlar'][1]['yon'] === 'gelen');
check('boş mesaj atılır', count($tap('yazisma')['gunler'][0]['mesajlar']) === 2);
/* Saat YALNIZ «HH:MM»: model bura tez-tez tarix yazır və o, baloncuğun
   altında saat kimi görünərək ekran görüntüsünü yalan edir. */
check('saat formatı süzülür', $tap('yazisma')['gunler'][0]['mesajlar'][0]['saat'] === '23:50');
$tarixli = QovluqBrief::bloklar(['yazisma' => ['sohbet' => 'A', 'gorulme' => '', 'mesajlar' => [
    ['saat' => '14 noyabr', 'yon' => 'gelen', 'metn' => 'salam'],
]]], 'A', 'resmi', 1, '2026/0001');
check('tarix saat kimi qəbul edilmir',
    $tarixli['bloklar'][2]['gunler'][0]['mesajlar'][0]['saat'] === '');
check('saatsız zəng atılır', count($tap('zeng')['zengler']) === 1);
check('adsız sübut atılır', count($tap('kart')['kartlar']) === 1);
check('sübut bloku açarlanır', $tap('kart')['acar'] === 'subutlar');
check('abzaslar bölünür', count($tap('metn')['abzaslar']) === 2);

/* Fiziki qat — bunlarsız hər vərəq eyni təmiz blank kimi görünür. */
check('möhür qatı qurulur', count($c['mohurler']) === 1);
check('möhür fiktivlik daşıyır', in_array('FİKTİV', $c['mohurler'][0]['metn'], true));
check('kağız qatı qurulur', isset($c['kagiz']['kohnelme']));
/* Holoqram YALNIZ təsdiqedici sənədlərdə: hər yerdə olan qoruma qoruma deyil. */
check('protokolda holoqram yoxdur', $c['holoqram'] === false);
check('qərarda holoqram var',
    QovluqBrief::bloklar($xamSened, 'Qərar', 'qerar', 1, '2026/0001')['holoqram'] === true);

/* Möhürün yeri NÖMRƏDƏN törəyir: `rand()` işlədilsəydi, vərəq ikinci dəfə
   açılanda möhür yerini dəyişər və sənəd özünü saxta elan edərdi. */
check('möhürün yeri təkrarlanandır',
    QovluqBrief::bloklar($xamSened, 'A', 'resmi', 5, '2026/0001')['mohurler'][0]['x']
    === QovluqBrief::bloklar($xamSened, 'A', 'resmi', 5, '2026/0001')['mohurler'][0]['x']);
check('möhürün yeri vərəqdən-vərəqə dəyişir',
    QovluqBrief::bloklar($xamSened, 'A', 'resmi', 5, '2026/0001')['mohurler'][0]['x']
    !== QovluqBrief::bloklar($xamSened, 'A', 'resmi', 6, '2026/0001')['mohurler'][0]['x']);

/* YEKUN: qurulan bloklar seed validatorundan keçməlidir. */
[$xeta, $xeb] = BlokSxemi::yoxla(['page' => '2', 'content' => $c]);
check('qurulan bloklar BlokSxemi-dən keçir', $xeta === [], $xeta);

/* Boş məlumat da keçərli vərəq verməlidir — model hər şeyi `null` qaytara bilər. */
$bos = QovluqBrief::bloklar(['meta_line' => '', 'body' => ''], 'Adsız', 'resmi', 1, '2026/0001');
[$xeta2] = BlokSxemi::yoxla(['page' => '1', 'content' => $bos]);
check('boş cavab da keçərli vərəq verir', $xeta2 === [], $xeta2);
check('boş vərəqdə də blank və başlıq var',
    array_column($bos['bloklar'], 'tip') === ['blank', 'basliq']);

echo "\nİş qovluğu — məhkəmə blankı\n";

/* Məhkəmə blankı ayrıdır və ayrı olmalıdır: `qerar` grifində «AFİB bölmə
   rəisi» yazır, yəni sənədi İSTİNTAQ təsdiq edir. Hökmü isə istintaq çıxara
   bilməz — ittihamı o irəli sürür, cəzanı məhkəmə verir. */
check('məhkəmə növü ağ siyahıdadır', in_array('mehkeme', BlokSxemi::BLANK_NOV, true));
check('AI ağ siyahısı ilə üst-üstə düşür',
    QovluqBrief::BLANK === BlokSxemi::BLANK_NOV, [QovluqBrief::BLANK, BlokSxemi::BLANK_NOV]);
check('məhkəmə qurumu fiktivdir', str_contains(Byuro::MEHKEME, 'FİKTİV'));
/* «Azərbaycan Respublikası» `org_ban` siyahısındadır — hökm blankı onu
   daşıya bilməz. */
check('məhkəmə adında respublika yoxdur',
    ! str_contains(mb_strtolower(Byuro::MEHKEME, 'UTF-8'), 'respublikas'));

$hokm = QovluqBrief::bloklar([
    'meta_line' => 'Qərar № 1',
    'body'      => "Təqsirli bilinir.\n\n11 (on bir) il azadlıqdan məhrumetmə.",
    'imza'      => ['vezife' => 'AFİB fiktiv məhkəmə sədri', 'ad' => 'R.Əliyev'],
], 'Məhkəmə qərarı', 'mehkeme', 30, '2026/0847');

check('məhkəmə blankı saxlanılır', $hokm['bloklar'][0]['nov'] === 'mehkeme');
[$xetaH] = BlokSxemi::yoxla(['page' => '30', 'content' => $hokm]);
check('hökm vərəqi BlokSxemi-dən keçir', $xetaH === [], $xetaH);
/* Holoqram yalnız təsdiqedici blanklarda — hökm onlardan biri deyil,
   çünki foil istintaq sənədinin nişanıdır. */
check('hökmdə holoqram yoxdur', $hokm['holoqram'] === false);

/* ==================================================================
   Google ilə giriş — PKCE və `id_token` iddiaları
   ================================================================== */
echo "\nGoogle girişi\n";

$GID = '123.apps.googleusercontent.com';

/* Saxta Google: token uc nöqtəsinin cavabını qaytarır. `Google` sinfi
   framework tanımır, ona görə HTTP çağırışı konstruktorla dəyişdirilir —
   `EpointProvider` və `PublicProvider` ilə eyni naxış. */
$jwt = static function (array $iddia): string {
    $b64 = static fn (array $a): string => rtrim(strtr(base64_encode(
        json_encode($a, JSON_UNESCAPED_UNICODE)), '+/', '-_'), '=');

    return $b64(['alg' => 'RS256']) . '.' . $b64($iddia) . '.imza-yoxlanilmir';
};

$saxta = static function (array $iddia, int $kod = 200) use ($jwt): callable {
    return static fn (string $u, array $form): array => [
        'kod'   => $kod,
        'govde' => json_encode(['id_token' => $jwt($iddia), 'gonderilen' => $form]),
    ];
};

$duzgun = [
    'iss' => 'https://accounts.google.com', 'aud' => $GID, 'exp' => time() + 3600,
    'sub' => '11223344', 'email' => 'Adam@Example.COM', 'email_verified' => true,
    'name' => 'Rəşad Əliyev',
];

/* --- PKCE --- */
$dog = Google::dogrulayici();
check('doğrulayıcı uzunluğu 43-128 arasındadır',
    strlen($dog) >= 43 && strlen($dog) <= 128, strlen($dog));
check('doğrulayıcıda yalnız icazəli simvollar var',
    preg_match('#^[A-Za-z0-9\-._~]+$#', $dog) === 1, $dog);
check('doğrulayıcı təkrarlanmır', Google::dogrulayici() !== Google::dogrulayici());
check('barmaq izi S256-dır',
    Google::barmaqIzi('abc') === rtrim(strtr(base64_encode(hash('sha256', 'abc', true)), '+/', '-_'), '='));

/* --- Razılıq ünvanı --- */
$g   = new Google($GID, 'sirr', $saxta($duzgun));
$url = $g->unvan('https://x.az/giris/google/cavab', 'ACAR', $dog);
foreach (['code_challenge_method=S256', 'response_type=code', 'prompt=select_account',
          'state=ACAR', 'client_id=123'] as $par) {
    check('ünvanda «' . $par . '» var', str_contains($url, $par), $url);
}
/* DOĞRULAYICININ ÖZÜ HEÇ VAXT ÜNVANDA OLMUR — yalnız barmaq izi gedir.
   Əks halda PKCE mənasız olardı: kodu oğurlayan doğrulayıcını da görərdi. */
check('doğrulayıcı ünvanda yoxdur', ! str_contains($url, $dog));
check('barmaq izi ünvandadır', str_contains($url, rawurlencode(Google::barmaqIzi($dog))));

/* --- Token dəyişimi --- */
$token = $g->deyisdir('KOD', 'https://x.az/giris/google/cavab', $dog);
$gond  = json_decode((string) json_encode($token['gonderilen'] ?? []), true);
check('doğrulayıcı token sorğusunda göndərilir', ($gond['code_verifier'] ?? '') === $dog);
check('grant_type düzgündür', ($gond['grant_type'] ?? '') === 'authorization_code');

$kimlik = $g->kimlik($token);
check('sub oxunur', $kimlik['sub'] === '11223344');
/* E-poçt həmişə kiçik hərflə saxlanılır: hesabın tapılması e-poçt
   müqayisəsi ilə gedir və «Adam@» ilə «adam@» eyni hesabdır. */
check('e-poçt kiçik hərfə salınır', $kimlik['email'] === 'adam@example.com');
check('ad oxunur', $kimlik['name'] === 'Rəşad Əliyev');

/* --- Rədd edilməli hallar --- */
$redd = static function (string $ad, array $deyis) use ($GID, $saxta, $duzgun): void {
    $g = new Google($GID, 'sirr', $saxta(array_merge($duzgun, $deyis)));
    try {
        $g->kimlik($g->deyisdir('K', 'https://x.az/c', 'v'));
        check($ad, false, 'qəbul edildi');
    } catch (\RuntimeException $e) {
        check($ad, true);
    }
};

$redd('yad yazıçı rədd edilir', ['iss' => 'https://evil.example']);
/* «Confused deputy»: başqa sayt üçün verilmiş token burada işləməməlidir. */
$redd('başqa tətbiqin tokeni rədd edilir', ['aud' => '999.apps.googleusercontent.com']);
$redd('vaxtı keçmiş token rədd edilir', ['exp' => time() - 3600]);
/* Təsdiqlənməmiş e-poçt qəbul edilsəydi, istənilən adam başqasının
   ünvanını yazıb hesabını ələ keçirə bilərdi. */
$redd('təsdiqlənməmiş e-poçt rədd edilir', ['email_verified' => false]);
$redd('e-poçtsuz token rədd edilir', ['email' => '']);
$redd('sub-suz token rədd edilir', ['sub' => '']);

$gx = new Google($GID, 'sirr', static fn (string $u, array $f): array => [
    'kod' => 400, 'govde' => json_encode(['error_description' => 'invalid_grant']),
]);
try {
    $gx->deyisdir('K', 'https://x.az/c', 'v');
    check('400 cavabı xəta verir', false);
} catch (\RuntimeException $e) {
    /* Səbəb mətnə düşməlidir: «alınmadı» mesajı ilə problemi tapmaq mümkün deyil. */
    check('400 cavabı xəta verir', str_contains($e->getMessage(), 'invalid_grant'), $e->getMessage());
}

check('açarsız provayder hazır deyil', (new Google('', ''))->hazir() === false);
check('açarlı provayder hazırdır', (new Google('a', 'b'))->hazir() === true);

/* ==================================================================
   Bölmələr — hansı məhsul canlıdır
   ================================================================== */
echo "\nBölmələr\n";

check('üç bölmə var', Bolmeler::ACARLAR === ['is', 'zarafat', 'devet'], Bolmeler::ACARLAR);
check('tanınan açar qəbul edilir', Bolmeler::var('is') && Bolmeler::var('devet'));
check('naməlum açar rədd edilir', ! Bolmeler::var('admin') && ! Bolmeler::var(''));

/* Təmizləmə: naməlum açar ATILIR, çatışmayan açar ilkin dəyəri alır. */
$t = Bolmeler::temizle(['is' => '1', 'devet' => '0', 'yad' => '1']);
check('naməlum açar süzülür', ! array_key_exists('yad', $t), array_keys($t));
check('bütün açarlar doldurulur', count($t) === 3, $t);
check('«1» açıq deməkdir', $t['is'] === true);
check('«0» bağlı deməkdir', $t['devet'] === false);
check('verilməyən açar ilkin dəyəri alır', $t['zarafat'] === true);
check('ilkin dəyər ötürülə bilir',
    Bolmeler::temizle([], ['zarafat' => false])['zarafat'] === false);

/* Sətir formaları — parametr bazadan STRİNQ kimi gəlir. */
foreach (['1' => true, '0' => false, 'true' => true, 'false' => false] as $xam => $gozlenen) {
    check('«' . $xam . '» → ' . ($gozlenen ? 'açıq' : 'bağlı'),
        Bolmeler::temizle(['is' => $xam])['is'] === $gozlenen);
}

/* ANA SƏHİFƏ. Seçilmiş bölmə bağlıdırsa açıq olana keçilir — əks halda
   bir parametri səhv qoymaq saytın kökünü 404 edərdi. */
$hamsi = ['is' => true, 'zarafat' => true, 'devet' => true];
check('açıq seçim saxlanılır', Bolmeler::anaSehife($hamsi, 'zarafat') === 'zarafat');
check('bağlı seçim açıq olana keçir',
    Bolmeler::anaSehife(['is' => true, 'zarafat' => false, 'devet' => false], 'zarafat') === 'is');
/* Ehtiyat sırası `ACARLAR` sırasıdır: iş qovluğu birincidir. */
check('ehtiyat sırası ACARLAR sırasıdır',
    Bolmeler::anaSehife(['is' => true, 'zarafat' => false, 'devet' => true], 'zarafat') === 'is');
check('naməlum seçim də açıq olana keçir',
    Bolmeler::anaSehife($hamsi, 'yad') === 'is');
/* Heç nə açıq deyilsə `null` — çağıran «texniki fasilə» göstərir (503),
   404 yox: ünvan var, məzmun müvəqqəti yoxdur. */
check('hamısı bağlıdırsa null',
    Bolmeler::anaSehife(['is' => false, 'zarafat' => false, 'devet' => false], 'is') === null);

/* ==================================================================
   Sənəd tarixi — blank şablonundakı boş sətrin əvəzi
   ================================================================== */
echo "\nSənəd tarixi\n";

/* Cümlə SƏRBƏSTDİR: üz qabığının mətni dəyişəndə oxuma sınmamalıdır. */
check('tarix sərbəst cümlədən oxunur',
    Tarix::oxu('Başlanıb: 16.08.2026, saat 08:05') === [16, 8, 2026]);
check('tarixsiz mətn null verir', Tarix::oxu('Başlanıb: bilinmir') === null);
check('boş dəyər null verir', Tarix::oxu(null) === null);
/* 31 fevral təqvimdə yoxdur — `checkdate` onu rədd edir. */
check('mövcud olmayan gün rədd edilir', Tarix::oxu('31.02.2026') === null);

/* Ay və il keçidi `mktime` ilə: əl ilə yazılsaydı unudulardı. */
check('ay keçidi düzgündür', Tarix::artir([30, 8, 2026], 5) === [4, 9, 2026]);
check('il keçidi düzgündür', Tarix::artir([28, 12, 2026], 7) === [4, 1, 2027]);
check('uzun ay keçidi', Tarix::artir([16, 8, 2026], 45) === [30, 9, 2026]);

/* Vərəq tarixi: gündə dörd sənəd. Birinci vərəq işin açıldığı gündür —
   qərar sənədi işi DOĞURUR, ona görə ondan əvvəl tarixlənə bilməz. */
$bas = [16, 8, 2026];
check('birinci vərəq işin başlandığı gündür', Tarix::vereq($bas, 0) === [16, 8, 2026]);
check('dördüncü vərəq hələ eyni gündür', Tarix::vereq($bas, 3) === [16, 8, 2026]);
check('beşinci vərəq növbəti gündür', Tarix::vereq($bas, 4) === [17, 8, 2026]);
check('sıra artdıqca tarix də artır', Tarix::vereq($bas, 43) === [26, 8, 2026]);
/* Mənfi sıra qəza deyil, sadəcə sıfır kimi oxunur. */
check('mənfi sıra başlanğıca düşür', Tarix::vereq($bas, -5) === [16, 8, 2026]);

/* SONLUQ VƏRƏQLƏRİ ƏSAS MATERİALIN SONUNDAN SAYILIR. Başlanğıcdan
   sayılsaydı, dindirilmə protokolu son ekspertiza rəyindən ƏVVƏL
   tarixlənərdi — qovluq özü ilə ziddiyyətə düşərdi. */
$sonEsas = Tarix::vereq($bas, 43);                 // 26.08.2026
$dindirme = Tarix::sonluq($bas, 43, 0);
$mehkeme  = Tarix::sonluq($bas, 43, 1);

/* Massivləri BİRBAŞA müqayisə etmək olmaz: PHP onları element-element
   tutuşdurur, yəni [26,8,2026] > [2,9,2026] «doğru» çıxır. Sıralana bilən
   dəyərə çevrilir. */
$sira = static fn (array $t): string => sprintf('%04d%02d%02d', $t[2], $t[1], $t[0]);
check('dindirilmə əsas materialdan sonradır', $sira($dindirme) > $sira($sonEsas), [$sonEsas, $dindirme]);
check('məhkəmə dindirilmədən sonradır', $sira($mehkeme) > $sira($dindirme), [$dindirme, $mehkeme]);
check('dindirilmə 7 gün sonradır', $dindirme === Tarix::artir($sonEsas, 7), $dindirme);
check('məhkəmə 45 gün sonradır', $mehkeme === Tarix::artir($sonEsas, 45), $mehkeme);

/* Format: blank şablonunun öz forması. */
check('tarix blank formatında yazılır',
    Tarix::yaz([5, 9, 2026]) === '«05» sentyabr 2026-cı il', Tarix::yaz([5, 9, 2026]));
check('iki rəqəmli gün sıfırsızdır',
    Tarix::yaz([16, 8, 2026]) === '«16» avqust 2026-cı il', Tarix::yaz([16, 8, 2026]));
/* Tarix bilinmirsə UYDURULMUR: doldurulmamış sətir yalan tarixdən dürüstdür. */
check('tarixsiz halda boş forma qalır',
    Tarix::yaz(null) === '«____» ____________ 2026-cı il', Tarix::yaz(null));
check('qısa forma sıfırla doldurulur', Tarix::qisa([5, 9, 2026]) === '05.09.2026');
check('on iki ay adı var', count(Tarix::AYLAR) === 12);

/* ==================================================================
   Şəkil yuvaları — sənədlərin istədiyi şəkillər
   ================================================================== */
echo "\nŞəkil yuvaları\n";

$sn = [
    'id' => 7, 'page' => '6–7', 'name' => 'Fotocədvəl',
    'body' => "Birinci abzas.\n\n{{ sekil:kamera-01 }}\n\nİkinci.",
    'content' => ['bloklar' => [
        ['tip' => 'basliq', 'ad' => 'BAŞLIQ'],
        ['tip' => 'foto', 'izah' => 'Mətbəx dəhlizi', 'sekil' => 'dehliz'],
        ['tip' => 'foto', 'izah' => 'Generator otağı'],            // BOŞ çərçivə
        ['tip' => 'kart', 'kartlar' => [
            ['ad' => 'Mərmər lövhə', 'sekil' => 'lovhe'],
            ['ad' => 'Metal qutu'],                                 // BOŞ kart
        ]],
    ]],
];

$y = SekilYuvalari::senedde($sn);
$acarlar = array_column($y, 'acar');

/* ÜÇ MƏNBƏ DƏ TARANIR — biri unudulsa, o yuva siyahıda görünməzdi. */
check('mətndəki nişan tapılır', in_array('kamera-01', $acarlar, true), $acarlar);
check('foto blokunun açarı tapılır', in_array('dehliz', $acarlar, true), $acarlar);
check('maddi sübutun açarı tapılır', in_array('lovhe', $acarlar, true), $acarlar);

/* BOŞ ÇƏRÇİVƏ DƏ YUVADIR: məhz o, şəkil gözləyir. */
$bos = array_values(array_filter($y, static fn (array $x): bool => $x['acar'] === ''));
check('boş çərçivələr də sayılır', count($bos) === 2, count($bos));
check('boş çərçivəyə açar TƏKLİF olunur',
    $bos[0]['teklif'] !== '' && $bos[1]['teklif'] !== '', array_column($bos, 'teklif'));
/* Təklif əşyanın adından doğur — «sekil-2» heç nə demir. */
check('təklif adı əşyadan götürür',
    str_contains($bos[1]['teklif'], 'metal'), $bos[1]['teklif']);

/* Yuvanın YERİ də lazımdır: yükləmə açarı məhz həmin blokun içinə yazır. */
check('boş foto blokunun indeksi verilir', $bos[0]['blok'] === 2, $bos[0]['blok']);
check('boş foto kart deyil', $bos[0]['kart'] === null);
check('boş kartın indeksləri verilir',
    $bos[1]['blok'] === 3 && $bos[1]['kart'] === 1, [$bos[1]['blok'], $bos[1]['kart']]);

/* `yazisma` blokunun `sekil` NÖVLÜ mesajı yuva DEYİL — onun açarı yoxdur. */
$yz = SekilYuvalari::senedde(['content' => ['bloklar' => [
    ['tip' => 'yazisma', 'sohbet' => [['nov' => 'sekil', 'metn' => 'foto']], 'gunler' => []],
]]]);
check('yazışmadakı şəkil mesajı yuva deyil', $yz === [], $yz);

/* QOVLUQ SƏVİYYƏSİ: eyni açar iki vərəqdə işlənə bilər — şəkil bir dəfə
   yüklənir, hər yerdə görünür, ona görə sətirlər birləşir. */
$q = SekilYuvalari::qovluqda([
    ['id' => 1, 'page' => '1', 'name' => 'Bir', 'body' => '{{ sekil:ortaq }}', 'content' => []],
    ['id' => 2, 'page' => '2', 'name' => 'İki', 'body' => '{{ sekil:ortaq }}', 'content' => []],
]);
check('eyni açar bir sətirdə birləşir', count($q) === 1, count($q));
check('hər iki vərəq sətirdə görünür', count($q[0]['yerler']) === 2, $q[0]['yerler']);

/* Boş çərçivələr BİRLƏŞMİR: iki fərqli vərəqin portret yeri iki fərqli
   şəkil istəyir. */
$q2 = SekilYuvalari::qovluqda([
    ['id' => 1, 'page' => '1', 'name' => 'Bir', 'content' => ['bloklar' => [['tip' => 'foto', 'izah' => 'Portret']]]],
    ['id' => 2, 'page' => '2', 'name' => 'İki', 'content' => ['bloklar' => [['tip' => 'foto', 'izah' => 'Portret']]]],
]);
check('boş çərçivələr birləşmir', count($q2) === 2, count($q2));
/* Eyni ad iki dəfə təklif olunsaydı, ikinci şəkil birincinin üstünə yazardı. */
check('təkrarlanan təklif nömrələnir',
    $q2[0]['teklif'] !== $q2[1]['teklif'], [$q2[0]['teklif'], $q2[1]['teklif']]);

/* BOŞLAR ƏVVƏLDƏ: onlar iş tələb edir, dolular yalnız məlumatdır. */
$q3 = SekilYuvalari::qovluqda([
    ['id' => 1, 'page' => '1', 'name' => 'Bir', 'body' => '{{ sekil:var }}',
     'content' => ['bloklar' => [['tip' => 'foto', 'izah' => 'Boş']]]],
]);
check('boş yuva siyahının əvvəlindədir', $q3[0]['acar'] === '', array_column($q3, 'acar'));

/* --- Seed şəkil bağlamalarını silməməlidir ------------------------------ */

/* ŞƏKİLLƏR YALNIZ İDARƏ PANELİNDƏN YÜKLƏNİR, yəni `sekil` açarı seed
   faylında HEÇ VAXT olmur — o, bazada yaranır. Məzmun olduğu kimi
   yazılsaydı, hər `db:seed` bütün bağlamaları silərdi: şəkillər
   kitabxanada qalar, vərəqlərdə isə çərçivələr boşalardı. */
$seed = ['bloklar' => [
    ['tip' => 'basliq', 'ad' => 'A'],
    ['tip' => 'foto', 'izah' => 'Portret'],
    ['tip' => 'kart', 'kartlar' => [['ad' => 'Lövhə'], ['ad' => 'Qutu']]],
]];
$baza = ['bloklar' => [
    ['tip' => 'basliq', 'ad' => 'A'],
    ['tip' => 'foto', 'izah' => 'Portret', 'sekil' => 'portret-1'],
    ['tip' => 'kart', 'kartlar' => [['ad' => 'Lövhə', 'sekil' => 'lovhe'], ['ad' => 'Qutu']]],
]];

$b = SekilYuvalari::sekilleriSaxla($seed, $baza);
check('foto bağlaması saxlanılır', ($b['bloklar'][1]['sekil'] ?? '') === 'portret-1', $b['bloklar'][1]);
check('kart bağlaması saxlanılır',
    ($b['bloklar'][2]['kartlar'][0]['sekil'] ?? '') === 'lovhe', $b['bloklar'][2]['kartlar'][0]);
check('bağlanmamış kart boş qalır', ! isset($b['bloklar'][2]['kartlar'][1]['sekil']));
check('digər açarlar seed-dən gəlir', ($b['bloklar'][0]['ad'] ?? '') === 'A');

/* Seed faylı AÇARIN SAHİBİDİRSƏ, o üstündür — məzmun müəllifi şəkli
   qəsdən dəyişə bilər. */
$seed2 = ['bloklar' => [['tip' => 'foto', 'izah' => 'P', 'sekil' => 'yeni']]];
$b2 = SekilYuvalari::sekilleriSaxla($seed2, ['bloklar' => [['tip' => 'foto', 'sekil' => 'kohne']]]);
check('seed-dəki açar üstündür', $b2['bloklar'][0]['sekil'] === 'yeni', $b2['bloklar'][0]);

/* BLOK NÖVÜ DƏYİŞİBSƏ bağlama ATILIR: yanlış yerə yapışdırmaqdansa boş
   çərçivə dürüstdür. */
$b3 = SekilYuvalari::sekilleriSaxla(
    ['bloklar' => [['tip' => 'cedvel', 'basliqlar' => ['A'], 'setirler' => [['1']]]]],
    ['bloklar' => [['tip' => 'foto', 'sekil' => 'kohne']]]
);
check('növ dəyişəndə bağlama atılır', ! isset($b3['bloklar'][0]['sekil']), $b3['bloklar'][0]);

/* Bazada məzmun yoxdursa (yeni sənəd) seed olduğu kimi qalır. */
check('boş bazada seed dəyişmir', SekilYuvalari::sekilleriSaxla($seed, []) === $seed);

echo "\n{$pass} keçdi, {$fail} uğursuz\n";
exit($fail > 0 ? 1 : 0);
