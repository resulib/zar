<?php

declare(strict_types=1);

namespace App\Support\Sosial;

/**
 * Açıq, açar tələb etməyən mənbələr.
 *
 * `OpenAiClient` / `EpointProvider` ilə eyni quruluş: HTTP çağırışı
 * konstruktora ötürülən callable ilə edilir, ona görə sinif framework-dən
 * asılı deyil və `tests/logic.php` onu saxta cavabla yoxlaya bilir.
 *
 * NƏ ALINIR (31.08.2026 tarixində birbaşa yoxlanılıb):
 *
 *   TikTok — `www.tiktok.com/oembed?url=<profil>` açarsız işləyir və
 *            `author_name` (görünən ad) verir. İZLƏYİCİ SAYI VƏ AVATAR
 *            YOXDUR: profil səhifəsinin özü WAF ilə bağlıdır (challenge
 *            səhifəsi qaytarır), `node/share/user` isə 403 verir.
 *
 *   Instagram — `i.instagram.com/api/v1/users/web_profile_info/` tam dəst
 *            verir: ad, bio, təsdiq nişanı, izləyici/izlənilən/paylaşım sayı
 *            və avatar linki. LAKİN bu QEYRİ-RƏSMİ endpointdir — hostinq
 *            IP-lərindən tez-tez bağlanır və istənilən gün formatını dəyişə
 *            bilər. Rəsmi Basic Display API 04.12.2024-də bağlanıb, şəxsi
 *            hesablar üçün rəsmi əvəzi yoxdur.
 *
 * Ona görə hər iki halda uğursuzluq NORMALDIR və boş massivlə qayıdır.
 */
final class PublicProvider implements SosialProvider
{
    /** @var callable(string, array<int,string>, int): array{status:int,body:string} */
    private $http;

    /**
     * @param  array{tiktok_oembed:string,instagram_web:string,instagram_app_id:string}  $endpoints
     * @param  callable(string, array<int,string>, int): array{status:int,body:string}|null  $http
     *         (url, headers, timeout) → HTTP statusu və xam gövdə
     */
    public function __construct(
        private readonly array $endpoints,
        private readonly int $timeout = 6,
        ?callable $http = null,
    ) {
        $this->http = $http ?? self::curlHttp(...);
    }

    public function name(): string
    {
        return 'public';
    }

    public function fetch(string $platform, string $username): array
    {
        if ($username === '') {
            return [];
        }

        try {
            return match ($platform) {
                'tiktok'    => $this->tiktok($username),
                'instagram' => $this->instagram($username),
                default     => [],
            };
        } catch (\Throwable) {
            /* Kənar mənbə bizim nəzarətimizdə deyil: hər cür nasazlıq
               «məlumat gəlmədi» deməkdir, xəta deyil. */
            return [];
        }
    }

    /** Yalnız görünən ad gəlir — oEmbed profil üçün başqa heç nə vermir. */
    private function tiktok(string $username): array
    {
        $url = $this->endpoints['tiktok_oembed']
            . '?url=' . rawurlencode(ProfilUrl::profileUrl('tiktok', $username));

        $j = $this->json($url, ['Accept: application/json']);
        if ($j === null) {
            return [];
        }

        $out = [];
        $name = self::str($j['author_name'] ?? null);
        if ($name !== '') {
            $out['name'] = $name;
        }

        return $out;
    }

    private function instagram(string $username): array
    {
        $url = $this->endpoints['instagram_web'] . '?username=' . rawurlencode($username);

        $j = $this->json($url, [
            'Accept: application/json',
            'x-ig-app-id: ' . (string) $this->endpoints['instagram_app_id'],
        ]);

        $u = $j['data']['user'] ?? null;
        if (!is_array($u)) {
            return [];
        }

        $out = [];
        foreach (['name' => 'full_name', 'bio' => 'biography', 'avatarUrl' => 'profile_pic_url_hd'] as $k => $src) {
            $v = self::str($u[$src] ?? null);
            if ($v !== '') {
                $out[$k] = $v;
            }
        }
        foreach (['followers' => 'edge_followed_by', 'following' => 'edge_follow', 'posts' => 'edge_owner_to_timeline_media'] as $k => $src) {
            $n = $u[$src]['count'] ?? null;
            if (is_int($n) || (is_string($n) && ctype_digit($n))) {
                $out[$k] = (int) $n;
            }
        }
        $out['verified'] = (bool) ($u['is_verified'] ?? false);
        $out['private']  = (bool) ($u['is_private'] ?? false);

        return $out;
    }

    /** @return array<string,mixed>|null */
    private function json(string $url, array $headers): ?array
    {
        $r = ($this->http)($url, $headers, $this->timeout);
        if ((int) ($r['status'] ?? 0) !== 200) {
            return null;
        }

        $j = json_decode((string) ($r['body'] ?? ''), true);

        return is_array($j) ? $j : null;
    }

    private static function str(mixed $v): string
    {
        return is_string($v) ? trim($v) : '';
    }

    /**
     * @param  array<int,string>  $headers
     * @return array{status:int,body:string}
     */
    private static function curlHttp(string $url, array $headers, int $timeout): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => $timeout,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_FOLLOWLOCATION => false,   // yönləndirmə izlənmir: SSRF səthini bağlayır
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; ZarafatBot/1.0)',
        ]);

        $body   = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        /* `curl_close()` PHP 8.0-dan bəri təsirsizdir, 8.5-də isə deprecation
           xəbərdarlığı verir — çağırılmır. */

        return ['status' => $status, 'body' => $body === false ? '' : (string) $body];
    }
}
