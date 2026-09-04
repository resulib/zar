<?php

declare(strict_types=1);

namespace App\Support\Sosial;

/**
 * Yapışdırılan profil linkindən platforma və istifadəçi adı çıxarır.
 *
 * `frontend/sosial.js` `SOSIAL_PARSE`-ın BİRE-BİR güzgüsüdür. İkisi bir simvol
 * fərqlənsə, brauzerin göstərdiyi ön baxışla serverin qurduğu sənəd fərqlənər —
 * `Answers::clean/fill` cütü üçün qoyulmuş eyni qayda.
 *
 * Host ağ siyahıdadır (`Devet::mapUrl()` məntiqi): naməlum host qəbul edilmir,
 * əks halda sahə istənilən linki daşıya bilərdi.
 *
 * Framework-siz — `tests/logic.php` bunu Laravel qaldırmadan `require` edir.
 */
final class ProfilUrl
{
    /** Profil seqmenti olmayan yollar — /p/…, /reel/… paylaşım linkləridir. */
    private const NOT_A_USER = ['p', 'reel', 'reels', 'explore'];

    private const MAX_USERNAME = 30;

    /**
     * @param  array<string,list<string>>  $hosts  platforma => hostlar (config('sosial.hosts'))
     * @return array{platform:string,username:string}|null
     */
    public static function parse(mixed $text, array $hosts, ?string $fallbackKind = null): ?array
    {
        $t = trim((string) (is_scalar($text) ? $text : ''));
        if ($t === '') {
            return null;
        }

        /* Sadəcə «@ad» yazılıbsa platforma seçimdən götürülür. Boşluqlu mətn
           istifadəçi adı deyil; nöqtəli mətn isə aşağıdakı budaqda host kimi
           yoxlanır. */
        if (!str_contains($t, '/') && !str_contains($t, '.')) {
            if (preg_match('/\s/u', $t) === 1) {
                return null;
            }
            $bare = self::cleanUsername($t);

            return ($bare !== '' && $fallbackKind !== null)
                ? ['platform' => $fallbackKind, 'username' => $bare]
                : null;
        }

        if (preg_match('#^(?:https?://)?([^/?\#\s]+)(?:/([^?\#\s]*))?#i', $t, $m) !== 1) {
            return null;
        }

        $host     = preg_replace('/:\d+$/', '', strtolower($m[1])) ?? '';
        $platform = self::platformOf($host, $hosts);
        if ($platform === null) {
            return null;
        }

        $seg   = array_values(array_filter(explode('/', (string) ($m[2] ?? '')), static fn ($x): bool => $x !== ''));
        $first = $seg[0] ?? '';
        if (in_array(strtolower($first), self::NOT_A_USER, true)) {
            $first = '';
        }

        $ad = self::cleanUsername($first);

        return $ad === '' ? null : ['platform' => $platform, 'username' => $ad];
    }

    /** @param array<string,list<string>> $hosts */
    private static function platformOf(string $host, array $hosts): ?string
    {
        foreach ($hosts as $platform => $list) {
            if (in_array($host, $list, true)) {
                return (string) $platform;
            }
        }

        return null;
    }

    /**
     * Platformaların özlərinin icazə verdiyi simvollar: hərf, rəqəm, alt xətt,
     * nöqtə. Nöqtə ilə başlaya və ya bitə bilməz.
     */
    public static function cleanUsername(mixed $value): string
    {
        $s = ltrim(trim((string) (is_scalar($value) ? $value : '')), '@');
        $s = preg_replace('/[^A-Za-z0-9._]/', '', $s) ?? '';
        $s = trim($s, '.');

        return substr($s, 0, self::MAX_USERNAME);
    }

    /** Profilin kanonik ünvanı — yalnız göstərmək üçün, sorğu üçün deyil. */
    public static function profileUrl(string $platform, string $username): string
    {
        return $platform === 'tiktok'
            ? 'https://www.tiktok.com/@' . $username
            : 'https://www.instagram.com/' . $username . '/';
    }
}
