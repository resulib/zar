<?php

declare(strict_types=1);

namespace App\Support\Payments;

/**
 * Epoint.az inteqrasiyası.
 *
 * İmzalama sxemi:
 *   data      = base64(json_encode($payload))
 *   signature = base64(sha1_raw($privateKey . $data . $privateKey))
 *
 * QEYD: sahə adlarını öz Epoint müqavilənizin sənədi ilə tutuşdurun —
 * versiyalar arasında fərq ola bilər.
 *
 * HTTP çağırışı konstruktora ötürülən callable ilə edilir ki, sinif
 * framework-dən asılı olmasın və test edilə bilsin.
 */
final class EpointProvider implements PaymentProvider
{
    /** @var callable(string, array<string,string>): array<string, mixed> */
    private $http;

    /**
     * @param callable(string, array<string,string>): array<string, mixed>|null $http
     *        (endpoint, form) → dekod edilmiş JSON cavab
     */
    public function __construct(
        private readonly string $publicKey,
        private readonly string $privateKey,
        private readonly string $endpoint = 'https://epoint.az/api/1/request',
        ?callable $http = null,
    ) {
        $this->http = $http ?? self::defaultHttp(...);
    }

    public function name(): string
    {
        return 'epoint';
    }

    /** @return array{data:string,signature:string} */
    public function sign(array $payload): array
    {
        $data = base64_encode(json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));

        return [
            'data'      => $data,
            'signature' => $this->signature($data),
        ];
    }

    public function signature(string $data): string
    {
        return base64_encode(sha1($this->privateKey . $data . $this->privateKey, true));
    }

    public function verify(string $data, string $signature): bool
    {
        return hash_equals($this->signature($data), $signature);
    }

    public function createOrder(array $order): array
    {
        $signed = $this->sign([
            'public_key'           => $this->publicKey,
            'amount'               => number_format($order['amount'], 2, '.', ''),
            'currency'             => $order['currency'],
            'language'             => 'az',
            'order_id'             => $order['orderId'],
            'description'          => $order['description'],
            'success_redirect_url' => $order['urls']['success'],
            'error_redirect_url'   => $order['urls']['error'],
        ]);

        $response = ($this->http)($this->endpoint, $signed);

        if (($response['status'] ?? null) !== 'success' || empty($response['redirect_url'])) {
            throw new \RuntimeException('Epoint sifarişi yaradıla bilmədi: ' . json_encode($response, JSON_UNESCAPED_UNICODE));
        }

        return [
            'redirectUrl' => (string) $response['redirect_url'],
            'providerRef' => isset($response['transaction']) ? (string) $response['transaction'] : null,
            'autoPaid'    => false,
        ];
    }

    public function parseCallback(array $payload): array
    {
        $data      = (string) ($payload['data'] ?? '');
        $signature = (string) ($payload['signature'] ?? '');

        if ($data === '' || ! $this->verify($data, $signature)) {
            throw new \RuntimeException('Epoint imzası yanlışdır');
        }

        $decoded = json_decode(base64_decode($data, true) ?: '', true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($decoded)) {
            throw new \RuntimeException('Epoint callback məzmunu oxunmadı');
        }

        return [
            'orderId'     => (string) ($decoded['order_id'] ?? ''),
            'status'      => ($decoded['status'] ?? '') === 'success' ? 'paid' : 'failed',
            'providerRef' => isset($decoded['transaction']) ? (string) $decoded['transaction'] : null,
            'raw'         => $decoded,
        ];
    }

    /** @return array<string, mixed> */
    private static function defaultHttp(string $endpoint, array $form): array
    {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($form),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);

        $body = curl_exec($ch);
        $err  = curl_error($ch);
        curl_close($ch);

        if ($body === false) {
            throw new \RuntimeException('Epoint ilə əlaqə qurulmadı: ' . $err);
        }

        $json = json_decode((string) $body, true);

        return is_array($json) ? $json : ['status' => 'error', 'raw' => (string) $body];
    }
}
