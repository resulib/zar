<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;
use App\Support\Bolmeler;
use Illuminate\Support\Facades\Cache;

/**
 * Bölmə açarlarının oxunması və yazılması.
 *
 * KEŞ MƏCBURİDİR: `bolme:` ara qatı HƏR sorğuda işləyir, keşsiz isə hər
 * səhifə açılışına üç əlavə `settings` sorğusu düşərdi. Yazan tərəf keşi
 * özü unutdurur — `CatalogService::forget()` ilə eyni intizam.
 */
class BolmeService
{
    /**
     * Keş açarı MÜHİTİ DƏ DAŞIYIR.
     *
     * İlkin dəyər `APP_ENV`-dən asılıdır (istehsalatda yalnız iş qovluğu),
     * keş isə `rememberForever`-dir. Eyni baza ilə iki mühit işlədiləndə —
     * məsələn `APP_ENV=production php artisan …` yerli maşında — biri
     * digərinin cavabını oxuyardı. Bu, yazarkən elə həmin dəqiqə baş verdi.
     */
    public static function kes(): string
    {
        return 'bolmeler.v1.' . (string) config('app.env', 'production');
    }

    /** Parametr açarı: `settings` cədvəlində `bolme_is` və s. */
    public static function setrAcari(string $bolme): string
    {
        return 'bolme_' . $bolme;
    }

    /** @return array<string,bool> */
    public function hamisi(): array
    {
        /** @var array<string,bool> */
        return Cache::rememberForever(self::kes(), function (): array {
            $ilkin = Bolmeler::temizle((array) config('bolmeler.ilkin', []));
            $xam   = [];

            foreach (Bolmeler::ACARLAR as $a) {
                $v = Setting::get(self::setrAcari($a));

                if ($v !== null) {
                    $xam[$a] = $v;
                }
            }

            return Bolmeler::temizle($xam, $ilkin);
        });
    }

    public function aciq(string $bolme): bool
    {
        return (bool) ($this->hamisi()[$bolme] ?? false);
    }

    /** Ana səhifənin bölməsi — bağlı seçim avtomatik açıq olana keçir. */
    public function anaSehife(): ?string
    {
        $secim = (string) (Setting::get('bolme_ana') ?? config('bolmeler.ana', 'zarafat'));

        return Bolmeler::anaSehife($this->hamisi(), $secim);
    }

    /** İdarə panelinin yazdığı seçim — açıq olub-olmamasından asılı olmayaraq. */
    public function anaSecim(): string
    {
        $secim = (string) (Setting::get('bolme_ana') ?? config('bolmeler.ana', 'zarafat'));

        return Bolmeler::var($secim) ? $secim : 'zarafat';
    }

    /**
     * @param  array<string,mixed>  $aciq
     */
    public function yaz(array $aciq, string $ana): void
    {
        foreach (Bolmeler::temizle($aciq) as $a => $v) {
            Setting::put(self::setrAcari($a), $v ? '1' : '0');
        }

        Setting::put('bolme_ana', Bolmeler::var($ana) ? $ana : 'zarafat');

        $this->unut();
    }

    /**
     * Parametr İDARƏ PANELİNDƏN yazılıbmı, yoxsa mühitin ilkin dəyəri işləyir?
     *
     * Paneldə görünür, çünki əks halda admin baxıb «bunu kim seçib» sualına
     * cavab tapa bilmir: eyni vəziyyət həm saxlanmış seçim, həm də
     * `APP_ENV`-dən gələn ilkin dəyər ola bilər.
     */
    public function yazilib(): bool
    {
        foreach (Bolmeler::ACARLAR as $a) {
            if (Setting::get(self::setrAcari($a)) !== null) {
                return true;
            }
        }

        return false;
    }

    /**
     * Saxlanmış seçimi SİLİR — vəziyyət yenidən mühitin ilkin dəyərindən gəlir.
     *
     * Lazımdır, çünki «saxlanmamış ilkin dəyər» ilə «eyni dəyəri saxlamaq»
     * FƏRQLİ vəziyyətlərdir: birincisi `APP_ENV` dəyişəndə özü ilə dəyişir,
     * ikincisi isə dondurulub. Yerli maşında sınaqdan sonra sətir qalsa,
     * həmin baza istehsalata köçürüləndə bölmələr açıq qalxardı.
     */
    public function sifirla(): void
    {
        $acarlar = array_map(
            static fn (string $a): string => self::setrAcari($a),
            Bolmeler::ACARLAR
        );
        $acarlar[] = 'bolme_ana';

        Setting::query()->whereIn('key', $acarlar)->delete();

        $this->unut();
    }

    public function unut(): void
    {
        Cache::forget(self::kes());
    }
}
