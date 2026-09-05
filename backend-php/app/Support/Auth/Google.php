<?php

declare(strict_types=1);

namespace App\Support\Auth;

/**
 * Google ilə giriş — OAuth 2.0 «authorization code» axını, PKCE (S256) ilə.
 *
 * KİTABXANA İŞLƏDİLMİR. Bu depoda QR kodu, PDF yazıcısı, Code-39 cədvəli,
 * WOFF2 cmap oxuyucusu və Epoint imzalanması da əl ilə yazılıb; Socialite
 * bir düymə üçün onlarla asılılıq gətirərdi. Sinif `App\Support` altındadır,
 * ona görə framework-siz qalmalıdır — HTTP çağırışı konstruktora ötürülən
 * `callable` ilə edilir, elə `EpointProvider` və `PublicProvider` kimi.
 *
 * PKCE MƏCBURİDİR, «məsləhət» deyil: `code` dəyəri brauzerin ünvan sətrindən
 * keçir və server jurnalına, «Referer» başlığına və ya paylaşılmış cihazın
 * tarixçəsinə düşə bilər. Doğrulayıcı yalnız sessiyada olduğu üçün oğurlanmış
 * kod tək başına heç nəyə yaramır.
 */
final class Google
{
    public const AUTH_URL  = 'https://accounts.google.com/o/oauth2/v2/auth';
    public const TOKEN_URL = 'https://oauth2.googleapis.com/token';

    /** `id_token`-in qəbul edilən yazıçıları — Google hər ikisini işlədir. */
    public const ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

    /** Yalnız kimlik: e-poçt və ad. Heç bir Google xidmətinə giriş istənmir. */
    public const SCOPE = 'openid email profile';

    /** Saatların fərqinə güzəşt (saniyə). */
    private const LUFT = 120;

    /** @var callable(string, array<string,string>): array{kod:int,govde:string} */
    private $http;

    /**
     * @param callable(string, array<string,string>): array{kod:int,govde:string}|null $http
     *        (endpoint, form) → HTTP statusu və gövdə
     */
    /**
     * @param  string  $tokenUrl  Yalnız TEST üçün dəyişdirilir (saxta Google —
     *        `OPENAI_ENDPOINT` ilə eyni naxış). Boş buraxılsa `TOKEN_URL`.
     */
    public function __construct(
        private readonly string $clientId,
        private readonly string $clientSecret,
        ?callable $http = null,
        private readonly string $tokenUrl = self::TOKEN_URL,
    ) {
        $this->http = $http ?? self::defaultHttp(...);
    }

    /** Açarlar yoxdursa düymə heç render olunmur — `AiService` naxışı. */
    public function hazir(): bool
    {
        return $this->clientId !== '' && $this->clientSecret !== '';
    }

    /* ------------------------------------------------------------------ */
    /*  PKCE                                                               */
    /* ------------------------------------------------------------------ */

    /** RFC 7636 doğrulayıcısı — 43-128 simvol, `[A-Za-z0-9-._~]`. */
    public static function dogrulayici(): string
    {
        return self::b64u(random_bytes(64));   // 86 simvol
    }

    /** Doğrulayıcının S256 barmaq izi. */
    public static function barmaqIzi(string $verifier): string
    {
        return self::b64u(hash('sha256', $verifier, true));
    }

    /** CSRF-ə qarşı birdəfəlik `state`. */
    public static function acar(): string
    {
        return bin2hex(random_bytes(16));
    }

    /* ------------------------------------------------------------------ */
    /*  Addım 1 — razılıq səhifəsinin ünvanı                               */
    /* ------------------------------------------------------------------ */

    public function unvan(string $redirect, string $state, string $verifier): string
    {
        return self::AUTH_URL . '?' . http_build_query([
            'client_id'             => $this->clientId,
            'redirect_uri'          => $redirect,
            'response_type'         => 'code',
            'scope'                 => self::SCOPE,
            'state'                 => $state,
            'code_challenge'        => self::barmaqIzi($verifier),
            'code_challenge_method' => 'S256',
            /* Hesab seçimi həmişə göstərilsin: bir brauzerdə bir neçə Google
               hesabı olan adam əks halda səssizcə yanlış hesabla girir. */
            'prompt'                => 'select_account',
        ], '', '&', PHP_QUERY_RFC3986);
    }

    /* ------------------------------------------------------------------ */
    /*  Addım 2 — kodu tokenə dəyişmək                                     */
    /* ------------------------------------------------------------------ */

    /**
     * @return array<string,mixed> Google-un token cavabı
     *
     * @throws \RuntimeException
     */
    public function deyisdir(string $code, string $redirect, string $verifier): array
    {
        ['kod' => $kod, 'govde' => $govde] = ($this->http)($this->tokenUrl, [
            'client_id'     => $this->clientId,
            'client_secret' => $this->clientSecret,
            'code'          => $code,
            'code_verifier' => $verifier,
            'grant_type'    => 'authorization_code',
            'redirect_uri'  => $redirect,
        ]);

        $json = json_decode($govde, true);

        if (! is_array($json)) {
            throw new \RuntimeException('Google cavabı oxunmadı (HTTP ' . $kod . ')');
        }

        if ($kod !== 200 || ! isset($json['id_token'])) {
            /* Google xətanı `error_description`-da izah edir; onsuz «alınmadı»
               mesajı ilə problemi tapmaq mümkün deyil. */
            throw new \RuntimeException('Google tokeni vermədi: '
                . (string) ($json['error_description'] ?? $json['error'] ?? 'HTTP ' . $kod));
        }

        return $json;
    }

    /* ------------------------------------------------------------------ */
    /*  Addım 3 — `id_token`-dən kimlik                                    */
    /* ------------------------------------------------------------------ */

    /**
     * `id_token`-i açır və iddiaları yoxlayır.
     *
     * İMZA YOXLANILMIR VƏ BU DÜZGÜNDÜR — ancaq bir şərtlə: token
     * `deyisdir()` ilə, yəni birbaşa Google-un token uc nöqtəsinə TLS
     * üzərindən edilən server-server sorğusu ilə alınmalıdır. OpenID Connect
     * Core §3.1.3.7 məhz bu halda imza yoxlamasını tələb etmir, çünki
     * mənbənin həqiqiliyini nəqliyyat qatı təsdiqləyir. Bu metodu BRAUZERDƏN
     * və ya başqa yerdən gələn tokenlə çağırmaq olmaz — o zaman istənilən
     * adam özünə istənilən e-poçt yaza bilər.
     *
     * @param  array<string,mixed>  $token  `deyisdir()`-in qaytardığı massiv
     * @return array{sub:string,email:string,name:string}
     *
     * @throws \RuntimeException
     */
    public function kimlik(array $token): array
    {
        $iddia = self::iddialar((string) ($token['id_token'] ?? ''));

        if (! in_array((string) ($iddia['iss'] ?? ''), self::ISSUERS, true)) {
            throw new \RuntimeException('Google kimliyinin yazıçısı tanınmadı');
        }

        /* `aud` bizim client id-mizdir. Bu yoxlama olmasa BAŞQA saytın üçün
           verilmiş token burada da işləyərdi — «confused deputy». */
        if (! hash_equals($this->clientId, (string) ($iddia['aud'] ?? ''))) {
            throw new \RuntimeException('Google kimliyi başqa tətbiq üçün verilib');
        }

        if ((int) ($iddia['exp'] ?? 0) + self::LUFT < time()) {
            throw new \RuntimeException('Google kimliyinin vaxtı keçib');
        }

        $sub   = trim((string) ($iddia['sub'] ?? ''));
        $email = trim((string) ($iddia['email'] ?? ''));

        if ($sub === '' || $email === '') {
            throw new \RuntimeException('Google e-poçt qaytarmadı');
        }

        /* TƏSDİQLƏNMƏMİŞ E-POÇT QƏBUL EDİLMİR: `users.email` unikaldır və
           mövcud hesaba bağlanma məhz e-poçtla gedir, yəni təsdiqlənməmiş
           ünvan başqasının hesabını ələ keçirmək yolu olardı. */
        if (($iddia['email_verified'] ?? false) !== true && ($iddia['email_verified'] ?? '') !== 'true') {
            throw new \RuntimeException('Google hesabının e-poçtu təsdiqlənməyib');
        }

        return [
            'sub'   => $sub,
            'email' => mb_strtolower($email, 'UTF-8'),
            'name'  => trim((string) ($iddia['name'] ?? '')),
        ];
    }

    /**
     * JWT-nin orta hissəsini açır. İmza yoxlanılmır — `kimlik()`-in
     * izahına bax.
     *
     * @return array<string,mixed>
     */
    public static function iddialar(string $jwt): array
    {
        $hisse = explode('.', $jwt);

        if (count($hisse) !== 3) {
            throw new \RuntimeException('Google kimliyi JWT formatında deyil');
        }

        $govde = base64_decode(strtr($hisse[1], '-_', '+/') . str_repeat('=', (4 - strlen($hisse[1]) % 4) % 4), true);
        $json  = is_string($govde) ? json_decode($govde, true) : null;

        if (! is_array($json)) {
            throw new \RuntimeException('Google kimliyi oxunmadı');
        }

        return $json;
    }

    /* ------------------------------------------------------------------ */

    private static function b64u(string $raw): string
    {
        return rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    }

    /**
     * @param  array<string,string>  $form
     * @return array{kod:int,govde:string}
     */
    private static function defaultHttp(string $endpoint, array $form): array
    {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($form),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);

        $govde = curl_exec($ch);
        $kod   = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err   = curl_error($ch);
        curl_close($ch);

        if ($govde === false) {
            throw new \RuntimeException('Google ilə əlaqə qurulmadı: ' . $err);
        }

        return ['kod' => $kod, 'govde' => (string) $govde];
    }
}
