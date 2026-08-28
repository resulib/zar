<?php

declare(strict_types=1);

namespace App\Support\Payments;

/**
 * Provayder-aqnostik ödəniş interfeysi.
 * Yeni provayder əlavə etmək = bu interfeysi tətbiq edən bir sinif yazmaq.
 */
interface PaymentProvider
{
    public function name(): string;

    /**
     * Sifariş yaradır və ödəniş səhifəsinin ünvanını qaytarır.
     *
     * @param array{orderId:string,amount:float,currency:string,description:string,urls:array{success:string,error:string,callback:string}} $order
     * @return array{redirectUrl:string,providerRef:?string,autoPaid:bool}
     */
    public function createOrder(array $order): array;

    /**
     * Provayderin callback-ini yoxlayır və normal formaya salır.
     *
     * `amount` verilirsə çağıran onu sifarişin məbləği ilə tutuşdurur.
     *
     * @param array<string, mixed> $payload
     * @return array{orderId:string,status:string,providerRef:?string,amount?:?float,currency?:?string,raw:array<string, mixed>}
     * @throws \RuntimeException imza yanlış olduqda
     */
    public function parseCallback(array $payload): array;
}
