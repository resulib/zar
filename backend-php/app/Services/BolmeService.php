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
    public const KES = 'bolmeler.v1';

    /** Parametr açarı: `settings` cədvəlində `bolme_is` və s. */
    public static function setrAcari(string $bolme): string
    {
        return 'bolme_' . $bolme;
    }

    /** @return array<string,bool> */
    public function hamisi(): array
    {
        /** @var array<string,bool> */
        return Cache::rememberForever(self::KES, function (): array {
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

    public function unut(): void
    {
        Cache::forget(self::KES);
    }
}
