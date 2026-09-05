<?php

declare(strict_types=1);

namespace App\Support\Ai;

use RuntimeException;

/**
 * OpenAI Chat Completions üçün minimal klient.
 *
 * `EpointProvider` ilə eyni quruluş: HTTP çağırışı konstruktora ötürülən
 * callable ilə edilir, ona görə sinif framework-dən asılı deyil və
 * `tests/logic.php` onu saxta cavabla yoxlaya bilir.
 *
 * İki uyğunluq problemi qəsdən burada həll olunur, çağıran tərəfdə yox:
 *
 *  1. **Parametr adları model nəslinə görə dəyişir.** Köhnə modellər
 *     `max_tokens`, yeniləri `max_completion_tokens` gözləyir; bəziləri
 *     `temperature` qəbul etmir. OpenAI belə halda 400 ilə birlikdə
 *     `error.param` qaytarır — klient həmin parametri atıb bir daha cəhd edir.
 *     Beləliklə yeni model çıxanda kodu dəyişmək lazım gəlmir.
 *  2. **`response_format` sxemi.** Struktur cavab dəstəklənmirsə, sadə
 *     `json_object` rejiminə enir; sxem onsuz da prompta yazılır və serverdə
 *     `TemplateBrief::normalize()` hər halda təmizləyir.
 */
final class OpenAiClient
{
    /** Model rədd edərsə atıla bilən parametrlər — sıra ilə sınanır. */
    private const OPTIONAL = ['temperature', 'max_completion_tokens', 'max_tokens', 'response_format'];

    /** @var callable(string, array<string,mixed>, array<int,string>, int): array{status:int,body:string} */
    private $http;

    /**
     * @param callable(string, array<string,mixed>, array<int,string>, int): array{status:int,body:string}|null $http
     *        (endpoint, payload, headers, timeout) → HTTP statusu və xam gövdə
     */
    public function __construct(
        private readonly string $key,
        private readonly string $endpoint = 'https://api.openai.com/v1/chat/completions',
        private readonly int $timeout = 90,
        ?callable $http = null,
    ) {
        $this->http = $http ?? self::curlHttp(...);
    }

    /**
     * Bir çağırış — mətn cavabı və istifadə statistikası.
     *
     * @param  array<int,array{role:string,content:string}>  $messages
     * @param  array<string,mixed>  $options  model · max_completion_tokens · temperature · response_format
     * @return array{text:string,model:string,usage:array<string,mixed>,dropped:list<string>}
     */
    public function chat(array $messages, array $options): array
    {
        /* İCRA VAXTI UZADILIR.

           `max_execution_time` adətən 30 saniyədir; model isə uzun cavabı
           40-90 saniyəyə yazır. Hədd aşılanda PHP prosesi FATAL ERROR ilə
           dayanır və brauzer BOŞ CAVAB alır — nə xəta mesajı, nə log sətri,
           nə də səbəb. Ölçülüb: 8 vərəqlik skelet 45 saniyə çəkir.

           Hədd cURL timeout-u ilə uzlaşdırılır: sorğunu dayandıran o
           olmalıdır, PHP-nin sayğacı yox — o zaman xəta anlaşılan olur. */
        @set_time_limit($this->timeout + 30);

        $payload = array_merge(['messages' => $messages], array_filter(
            $options,
            static fn ($v): bool => $v !== null,
        ));

        $dropped = [];

        /* Ən çoxu OPTIONAL qədər cəhd: hər dəfə modelin adını çəkdiyi bir
           parametr atılır. Sonsuz döngə mümkün deyil — atılan parametr
           siyahıdan çıxarılır. */
        for ($attempt = 0; $attempt <= count(self::OPTIONAL); $attempt++) {
            $res = ($this->http)($this->endpoint, $payload, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->key,
            ], $this->timeout);

            $json = json_decode($res['body'], true);
            $json = is_array($json) ? $json : [];

            if ($res['status'] === 200) {
                return [
                    'text'    => (string) ($json['choices'][0]['message']['content'] ?? ''),
                    'model'   => (string) ($json['model'] ?? ($payload['model'] ?? '')),
                    'usage'   => is_array($json['usage'] ?? null) ? $json['usage'] : [],
                    'dropped' => $dropped,
                ];
            }

            $drop = $this->unsupportedParam($res['status'], $json, $payload);

            if ($drop === null) {
                throw new RuntimeException($this->message($res, $json));
            }

            unset($payload[$drop]);
            $dropped[] = $drop;

            /* `max_completion_tokens` rədd olunubsa, model köhnə nəsildəndir —
               eyni həddi köhnə adla bir dəfə sınayırıq. */
            if ($drop === 'max_completion_tokens' && ! isset($payload['max_tokens'])
                && isset($options['max_completion_tokens'])) {
                $payload['max_tokens'] = $options['max_completion_tokens'];
            }
        }

        throw new RuntimeException('OpenAI sorğusu qəbul edilmədi: model gözlənilən parametrləri tanımır.');
    }

    /**
     * 400 cavabında modelin adını çəkdiyi, bizim atmağa hazır olduğumuz parametr.
     *
     * @param  array<string,mixed>  $json
     * @param  array<string,mixed>  $payload
     */
    private function unsupportedParam(int $status, array $json, array $payload): ?string
    {
        if ($status !== 400) {
            return null;
        }

        $err   = is_array($json['error'] ?? null) ? $json['error'] : [];
        $param = is_string($err['param'] ?? null) ? $err['param'] : '';
        $msg   = is_string($err['message'] ?? null) ? $err['message'] : '';

        if ($param !== '' && in_array($param, self::OPTIONAL, true) && array_key_exists($param, $payload)) {
            return $param;
        }

        /* Bəzi cavablarda `param` boş gəlir, ad yalnız mətndədir. */
        foreach (self::OPTIONAL as $candidate) {
            if (array_key_exists($candidate, $payload) && str_contains($msg, $candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    /**
     * @param  array{status:int,body:string}  $res
     * @param  array<string,mixed>  $json
     */
    private function message(array $res, array $json): string
    {
        $err  = is_array($json['error'] ?? null) ? $json['error'] : [];
        $text = is_string($err['message'] ?? null) ? $err['message'] : '';

        if ($text === '') {
            $text = mb_substr(trim($res['body']), 0, 300);
        }

        return match (true) {
            $res['status'] === 401 => 'OpenAI açarı qəbul edilmədi (401). `.env` faylındakı OPENAI_API_KEY-i yoxlayın.',
            $res['status'] === 404 => 'Model tapılmadı (404): ' . $text,
            $res['status'] === 429 => 'OpenAI limiti doldu (429). Bir az sonra təkrar cəhd edin.',
            $res['status'] >= 500  => 'OpenAI tərəfində xəta (' . $res['status'] . '). Bir az sonra təkrar cəhd edin.',
            default                => 'OpenAI xətası (' . $res['status'] . '): ' . $text,
        };
    }

    /**
     * @param  array<string,mixed>  $payload
     * @param  array<int,string>  $headers
     * @return array{status:int,body:string}
     */
    private static function curlHttp(string $endpoint, array $payload, array $headers, int $timeout): array
    {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_HTTPHEADER     => $headers,
        ]);

        $body   = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $err    = curl_error($ch);
        /* `curl_close()` ÇAĞIRILMIR: PHP 8.0-dan bəri təsirsizdir və 8.5-də
           deprecated-dir — `PublicProvider` ilə eyni qayda. */

        if ($body === false) {
            throw new RuntimeException('OpenAI ilə əlaqə qurulmadı: ' . $err);
        }

        return ['status' => $status, 'body' => (string) $body];
    }
}
