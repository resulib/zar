<?php

declare(strict_types=1);

namespace App\Support\Sosial;

/**
 * Profil məlumatı mənbəyi.
 *
 * `PaymentProvider` ilə eyni məqsəd: sabah pullu bir scraper API alınsa,
 * yeni sinif yazılır və `SosialService` bir sətirdə ona keçir — çağıran
 * tərəf dəyişmir.
 *
 * QAYDA: `fetch()` HEÇ VAXT istisna atmır. Kənar platforma bloklaya,
 * ləngiyə və ya formatını dəyişə bilər; belə halda boş massiv qayıdır və
 * istifadəçi sahələri özü doldurur. Kartın yaradılması dayanmamalıdır.
 */
interface SosialProvider
{
    public function name(): string;

    /**
     * @return array{
     *     name?:string, bio?:string, verified?:bool, private?:bool,
     *     followers?:int, following?:int, posts?:int, avatarUrl?:string
     * }  tapılmayan açarlar SADƏCƏ OLMUR — boş sətirlə doldurulmur
     */
    public function fetch(string $platform, string $username): array;
}
