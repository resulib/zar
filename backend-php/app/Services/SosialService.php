<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;
use App\Support\Moderation;
use App\Support\Sosial\ProfilUrl;
use App\Support\Sosial\PublicProvider;
use App\Support\Sosial\Sosial;
use App\Support\Sosial\SosialProvider;
use Illuminate\Support\Facades\Cache;

/**
 * Sosial profil məlumatının toplanması.
 *
 * `AiService` ilə eyni üç qatlı bölgü:
 *   App\Support\Sosial\ProfilUrl      — link parsinqi   (framework-siz, test edilir)
 *   App\Support\Sosial\PublicProvider — HTTP və format  (framework-siz, test edilir)
 *   bu sinif                          — konfiq, keş, moderasiya, avatar
 *
 * ƏSAS QAYDA: bu servis heç vaxt kartın yaradılmasını dayandırmır. Kənar
 * platforma bloklaya bilər (TikTok WAF-ı, Instagram-ın qeyri-rəsmi endpointi),
 * belə halda `ok: false` qayıdır və istifadəçi sahələri özü doldurur.
 */
class SosialService
{
    public function __construct(private readonly ?SosialProvider $provider = null) {}

    public function enabled(): bool
    {
        return (bool) config('sosial.enabled');
    }

    /**
     * Yapışdırılan mətndən profil bloku qurur.
     *
     * @return array{ok:bool, social:array<string,mixed>, avatar:?string, source:string, note:?string}
     */
    public function lookup(mixed $paste, ?string $fallbackKind = null): array
    {
        $hosts = (array) config('sosial.hosts');
        $found = ProfilUrl::parse($paste, $hosts, $fallbackKind);

        if ($found === null) {
            return $this->result(false, [], null, 'yox', 'Link tanınmadı. TikTok və ya Instagram profil linkini yapışdırın.');
        }

        $social = ['platform' => $found['platform'], 'username' => $found['username']];

        if (! $this->enabled()) {
            return $this->result(true, $social, null, 'əl', null);
        }

        $data = $this->cached($found['platform'], $found['username']);

        if ($data === []) {
            return $this->result(
                true,
                $social,
                null,
                'əl',
                'Profil məlumatı avtomatik gəlmədi — sahələri özünüz doldura bilərsiniz.',
            );
        }

        $avatar = null;
        if (isset($data['avatarUrl'])) {
            $avatar = $this->avatarDataUri((string) $data['avatarUrl']);
            unset($data['avatarUrl']);
        }

        /* Kənardan gələn ad da istifadəçi mətnidir və SVG-yə düşür: qadağan
           siyahısı ona da şamil edilir — AiService modelin çıxışını necə
           süzürsə, eyni məntiq. */
        $moderation = new Moderation(Setting::get('banned_words', (string) config('zarafat.banned_words')) ?? '');
        if ($moderation->flagged((string) ($data['name'] ?? ''), (string) ($data['bio'] ?? ''))) {
            $data = [];
        }

        $social = Sosial::clean(array_merge($social, $data), (array) config('sosial'));

        /* `bio` sənədə düşmür, yalnız formada göstərilir — `Sosial::clean()`
           onu qəsdən saxlamır, ona görə ayrıca əlavə edilir. */
        if (isset($data['bio'])) {
            $social['bio'] = mb_substr((string) $data['bio'], 0, (int) config('sosial.limits.bio', 160));
        }

        return $this->result(true, $social, $avatar, 'avtomatik', null);
    }

    /** @return array<string,mixed> */
    private function cached(string $platform, string $username): array
    {
        $key = 'sosial:' . $platform . ':' . strtolower($username);
        $ttl = now()->addMinutes((int) config('sosial.cache_minutes', 60));

        $hit = Cache::get($key);
        if (is_array($hit)) {
            return $hit;
        }

        $data = $this->provider()->fetch($platform, $username);

        /* Uğursuz cəhd də keşlənir (qısa müddətə): bloklanmış platformaya
           hər klikdə yenidən getmək həm ləng, həm də IP-ni tez yandırır. */
        Cache::put($key, $data, $data === [] ? now()->addMinutes(5) : $ttl);

        return $data;
    }

    private function provider(): SosialProvider
    {
        return $this->provider ?? new PublicProvider(
            (array) config('sosial.endpoints'),
            (int) config('sosial.timeout', 6),
        );
    }

    /**
     * Avatar `data:` URI kimi qaytarılır — brauzer platformanın CDN-inə
     * birbaşa gedə bilmir (CORS), sənəd isə kənar şəkil saxlaya bilməz.
     * Host ağ siyahıdadır, əks halda bu endpoint açıq SSRF vasitəsi olardı.
     */
    private function avatarDataUri(string $url): ?string
    {
        $cfg = (array) config('sosial.avatar');

        if (! str_starts_with($url, 'https://')) {
            return null;
        }
        if (preg_match('#^https://([^/?\#]+)#i', $url, $m) !== 1) {
            return null;
        }
        $host = strtolower(preg_replace('/:\d+$/', '', $m[1]) ?? '');

        $allowed = false;
        foreach ((array) ($cfg['hosts'] ?? []) as $suffix) {
            if (str_ends_with($host, (string) $suffix)) {
                $allowed = true;
                break;
            }
        }
        if (! $allowed) {
            return null;
        }

        $bin = $this->fetchBinary($url, (int) ($cfg['fetch_max_bytes'] ?? 3145728));
        if ($bin === null) {
            return null;
        }

        $jpeg = $this->square($bin, (int) ($cfg['size'] ?? 256));

        return $jpeg === null ? null : 'data:image/jpeg;base64,' . base64_encode($jpeg);
    }

    private function fetchBinary(string $url, int $maxBytes): ?string
    {
        if (! function_exists('curl_init')) {
            return null;
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => (int) config('sosial.timeout', 6),
            CURLOPT_CONNECTTIMEOUT => (int) config('sosial.timeout', 6),
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; ZarafatBot/1.0)',
            CURLOPT_NOPROGRESS     => false,
            CURLOPT_PROGRESSFUNCTION => static fn ($r, $dlTotal, $dlNow) => $dlNow > $maxBytes ? 1 : 0,
        ]);

        $body   = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        /* `curl_close()` PHP 8.0-dan bəri təsirsizdir, 8.5-də isə deprecation
           xəbərdarlığı verir — çağırılmır. */

        if ($body === false || $status !== 200 || strlen((string) $body) > $maxBytes) {
            return null;
        }

        return (string) $body;
    }

    /**
     * Mərkəzdən kvadrat kəsib `size`×`size` JPEG qaytarır. GD yoxdursa null —
     * avatar sadəcə olmur, kart siluetlə çəkilir.
     */
    private function square(string $binary, int $size): ?string
    {
        $info = @getimagesizefromstring($binary);
        if ($info === false || ! in_array((int) ($info[2] ?? 0), [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
            return null;
        }
        if (! function_exists('imagecreatefromstring')) {
            return null;
        }

        $src = @imagecreatefromstring($binary);
        if ($src === false) {
            return null;
        }

        $w = imagesx($src);
        $h = imagesy($src);
        $s = min($w, $h);

        $dst = imagecreatetruecolor($size, $size);
        imagecopyresampled($dst, $src, 0, 0, (int) (($w - $s) / 2), (int) (($h - $s) / 2), $size, $size, $s, $s);

        ob_start();
        imagejpeg($dst, null, 86);
        $out = (string) ob_get_clean();

        imagedestroy($src);
        imagedestroy($dst);

        return $out;
    }

    /** @return array{ok:bool, social:array<string,mixed>, avatar:?string, source:string, note:?string} */
    private function result(bool $ok, array $social, ?string $avatar, string $source, ?string $note): array
    {
        return ['ok' => $ok, 'social' => $social, 'avatar' => $avatar, 'source' => $source, 'note' => $note];
    }
}
