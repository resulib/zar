<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Dəvətnamə bölməsinin çərçivəsiz köməkçiləri.
 *
 * App\Support qəsdən Laravel-siz qalır (facade yox, helper yox) — belədə
 * tests/logic.php bu faylı sadəcə `require` edib yoxlaya bilir.
 */
final class Devet
{
    /** Qonaq cavabı — başqa dəyər qəbul edilmir. */
    public const RSVP = ['gelirem', 'gelmirem', 'bilmirem'];

    /** Token yalnız ASCII hərf-rəqəmdir: URL-də, fayl adında və marşrut
     *  məhdudiyyətində eyni cür işləməlidir. */
    public const TOKEN_LEN = 22;
    public const TOKEN_PATTERN = '/^[A-Za-z0-9]{22}$/';

    private const ABC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    /**
     * Təxmin edilə bilməyən token. Dəvətnamənin YEGANƏ qorunması budur:
     * ünvan, telefon və qonaq siyahısı bu sətrin arxasındadır, ona görə
     * random_int (CSPRNG) işlədilir, mt_rand yox.
     */
    public static function token(int $len = self::TOKEN_LEN): string
    {
        $out = '';
        $max = strlen(self::ABC) - 1;

        for ($i = 0; $i < $len; $i++) {
            $out .= self::ABC[random_int(0, $max)];
        }

        return $out;
    }

    public static function isToken(mixed $value): bool
    {
        return is_string($value) && preg_match(self::TOKEN_PATTERN, $value) === 1;
    }

    public static function isRsvp(mixed $value): bool
    {
        return is_string($value) && in_array($value, self::RSVP, true);
    }

    /** OG şəklinin fayl adı. Token onsuz da təhlükəsiz simvollardan ibarətdir. */
    public static function ogFile(string $token): string
    {
        return $token . '.jpg';
    }

    /**
     * Xəritə linki.
     *
     * İstifadəçinin yapışdırdığı link YALNIZ ağ siyahıdakı hosta gedə bilər —
     * əks halda dəvətnamə açıq yönləndirmə vasitəsinə çevrilər: qonaq
     * «Xəritədə göstər» düyməsinə basıb kənar sayta düşərdi.
     * Uyğun gəlməyən hər şey ünvandan qurulan axtarış linki ilə əvəz olunur.
     *
     * @param string[] $allowed
     */
    public static function mapUrl(mixed $paste, string $address, array $allowed): string
    {
        $paste = is_string($paste) ? trim($paste) : '';

        if ($paste !== '' && preg_match('#^https://([^/?\#]+)#i', $paste, $m) === 1) {
            $host = strtolower($m[1]);
            $host = str_contains($host, ':') ? strstr($host, ':', true) : $host;

            if (in_array($host, $allowed, true)) {
                return $paste;
            }
        }

        $address = trim($address);

        return $address === ''
            ? ''
            : 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($address);
    }

    /**
     * Dərc olunmuş dəvətnamənin ünvanı. Baza `config('devet.public_url')`-dandır,
     * yəni ayrı domenə keçid bir .env sətridir.
     */
    public static function link(string $base, string $token, ?string $guest = null): string
    {
        $url = rtrim($base, '/') . '/d/' . $token;

        return $guest !== null && $guest !== '' ? $url . '/q/' . $guest : $url;
    }

    /**
     * Qonaq siyahısı mətnindən adlar. Hər sətirdə bir ad; boş sətirlər və
     * təkrarlar atılır, sıra qorunur (istifadəçi öz siyahısını tanımalıdır).
     *
     * @return string[]
     */
    public static function guestNames(mixed $raw, int $max, int $len): array
    {
        $lines = is_array($raw) ? $raw : preg_split('/\R/', (string) $raw);
        $out = [];

        foreach ($lines as $line) {
            $name = trim(preg_replace('/\s+/u', ' ', (string) $line) ?? '');
            if ($name === '') {
                continue;
            }

            $name = mb_substr($name, 0, $len);
            if (!in_array($name, $out, true)) {
                $out[] = $name;
            }

            if (count($out) >= $max) {
                break;
            }
        }

        return $out;
    }

    /**
     * Cavabların yekunu. Sayğac serverdə hesablanır — qonaq siyahısını
     * müştəriyə vermədən də kabinetdə düzgün rəqəm görünsün.
     *
     * @param iterable<object> $guests
     * @return array{gelirem:int, gelmirem:int, bilmirem:int, cavabsiz:int, nefer:int, hamisi:int}
     */
    public static function tally(iterable $guests): array
    {
        $t = ['gelirem' => 0, 'gelmirem' => 0, 'bilmirem' => 0, 'cavabsiz' => 0, 'nefer' => 0, 'hamisi' => 0];

        foreach ($guests as $g) {
            $t['hamisi']++;
            $rsvp = is_string($g->rsvp ?? null) ? $g->rsvp : '';

            if (!self::isRsvp($rsvp)) {
                $t['cavabsiz']++;
                continue;
            }

            $t[$rsvp]++;

            if ($rsvp === 'gelirem') {
                $t['nefer'] += max(1, (int) ($g->rsvp_count ?? 1));
            }
        }

        return $t;
    }
}
