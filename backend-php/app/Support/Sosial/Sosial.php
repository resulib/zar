<?php

declare(strict_types=1);

namespace App\Support\Sosial;

use App\Support\Sanitizer;

/**
 * Sosial kartın məlumat bloku: təmizləmə, say formatı və `{{açar}}` dəyərləri.
 *
 * `sayi()` və `vals()` `frontend/doc.js sosialSayi()` və
 * `frontend/sosial.js SOSIAL_VALS` funksiyalarının BİRE-BİR güzgüsüdür.
 * Bir simvol fərqlənsə, istifadəçinin endirdiyi PNG ilə reyestrdəki nüsxə
 * fərqlənər — `Answers::clean/fill` cütü üçün qoyulmuş eyni qayda.
 *
 * Framework-siz: `tests/logic.php` bunu Laravel qaldırmadan yoxlayır.
 */
final class Sosial
{
    /** 12400 → «12,4 K». Onluq ayırıcı vergüldür (Azərbaycan yazılışı). */
    public static function sayi(mixed $n): string
    {
        if (!is_int($n) && !(is_string($n) && ctype_digit($n)) && !is_float($n)) {
            return '—';
        }
        $n = (int) $n;
        if ($n < 0) {
            return '—';
        }
        if ($n < 1000) {
            return (string) $n;
        }

        $mil = $n >= 1000000;
        $v   = $mil ? round($n / 100000) / 10 : round($n / 100) / 10;

        /* JS `String(12.0)` «12» verir — PHP-nin sonundakı sıfırı da atırıq ki,
           iki tərəf eyni sətri qursun. */
        $s = rtrim(rtrim(number_format($v, 1, '.', ''), '0'), '.');

        return str_replace('.', ',', $s) . ($mil ? ' M' : ' K');
    }

    /**
     * `{{username}}` · `{{platform}}` · `{{name}}` · `{{followers}}` ·
     * `{{following}}` · `{{posts}}` üçün dəyərlər.
     *
     * @param  array<string,mixed>  $s
     * @param  array<string,string>  $names  platforma => görünən ad (config('sosial.names'))
     * @return array<string,string>
     */
    public static function vals(array $s, array $names): array
    {
        $u = (string) ($s['username'] ?? '');

        return [
            'username'  => $u !== '' ? '@' . $u : '—',
            'platform'  => $names[(string) ($s['platform'] ?? '')] ?? '—',
            'name'      => (string) ($s['name'] ?? '') !== '' ? (string) $s['name'] : '—',
            'followers' => self::sayi($s['followers'] ?? null),
            'following' => self::sayi($s['following'] ?? null),
            'posts'     => self::sayi($s['posts'] ?? null),
        ];
    }

    /**
     * Müştəridən gələn bloku təmizləyir. Boş sahələr SADƏCƏ OLMUR — belədə
     * `doc.js socialRows()` onları «—» kimi çəkir və uydurma dəyər yaranmır.
     *
     * @param  array<string,mixed>  $cfg  config('sosial') — platforms · limits
     * @return array<string,mixed>
     */
    public static function clean(mixed $input, array $cfg): array
    {
        if (!is_array($input)) {
            return [];
        }

        $lim      = (array) ($cfg['limits'] ?? []);
        $platform = Sanitizer::pick($input['platform'] ?? null, (array) ($cfg['platforms'] ?? []), '');
        $username = ProfilUrl::cleanUsername($input['username'] ?? null);

        if ($platform === '' || $username === '') {
            return [];
        }

        $out = ['platform' => $platform, 'username' => $username];

        $name = Sanitizer::text($input['name'] ?? null, (int) ($lim['name'] ?? 40));
        if ($name !== '') {
            $out['name'] = $name;
        }

        /* Mənfi say cəfəngiyatdır və NAMƏLUM sayılır — sıfıra yuvarlaqlaşdırsaq
           kartda «0 paylaşım» yazılardı, halbuki dəyər sadəcə yoxdur. */
        $max = (int) ($lim['followers'] ?? 999999999);
        foreach (['followers', 'following', 'posts'] as $k) {
            $v = $input[$k] ?? null;
            if (is_int($v) || (is_string($v) && ctype_digit($v))) {
                $v = (int) $v;
                if ($v >= 0) {
                    $out[$k] = min($max, $v);
                }
            }
        }

        if (!empty($input['verified'])) {
            $out['verified'] = true;
        }

        return $out;
    }

    /**
     * Moderasiyaya göndəriləcək mətnlər. Ad və istifadəçi adı SVG-yə düşür,
     * ona görə qadağan siyahısı onlara da şamil edilir — `DocumentController`
     * bu siyahını `Moderation::flagged()`-ə açır.
     *
     * @param  array<string,mixed>  $s
     * @return list<string>
     */
    public static function texts(array $s): array
    {
        return [(string) ($s['username'] ?? ''), (string) ($s['name'] ?? '')];
    }
}
