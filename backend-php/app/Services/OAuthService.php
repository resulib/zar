<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Support\Auth\Google;
use Illuminate\Http\Request;

/**
 * Google girişinin Laravel tərəfi.
 *
 * `AiService` / `SosialService` ilə eyni bölgü: çətin hissə (PKCE, token
 * dəyişimi, iddia yoxlaması) `App\Support\Auth\Google`-dadır və framework
 * tanımır; burada yalnız konfiqurasiya, sessiya və istifadəçinin tapılması var.
 */
class OAuthService
{
    /** Sessiya açarları — biri belə qalsa təkrar istifadə mümkün olardı. */
    public const S_STATE    = 'oauth.google.state';
    public const S_VERIFIER = 'oauth.google.verifier';
    public const S_QAYIDIS  = 'oauth.google.qayidis';

    public function __construct(private readonly AccountService $accounts)
    {
    }

    public function google(): Google
    {
        return new Google(
            (string) config('oauth.google.client_id', ''),
            (string) config('oauth.google.client_secret', ''),
            null,
            (string) config('oauth.google.token_url') ?: Google::TOKEN_URL,
        );
    }

    /** Açar yoxdursa düymə render olunmur — `AiService::hazir()` naxışı. */
    public function hazir(): bool
    {
        return $this->google()->hazir();
    }

    /**
     * `redirect_uri`. Google onu HƏRFİ müqayisə edir, ona görə konfiqurasiya
     * varsa o götürülür; yoxdursa cari sorğunun host-undan qurulur.
     *
     * DİQQƏT: `url()` cari sorğunun host-unu işlədir, `APP_URL`-i yox. Bu,
     * burada DÜZGÜNDÜR — `localhost` ilə `127.0.0.1` arasında sürüşmə olsa
     * icazə səhifəsi ilə token dəyişimi fərqli host göndərər və Google
     * `redirect_uri_mismatch` qaytarardı. Hər ikisi Google konsolunda
     * qeydiyyatda olmalıdır.
     */
    public function qayidisUnvani(): string
    {
        $konfiq = trim((string) config('oauth.google.redirect', ''));

        return $konfiq !== '' ? $konfiq : url('/giris/google/cavab');
    }

    /**
     * Razılıq səhifəsinin ünvanını qurur və birdəfəlik dəyərləri sessiyaya yazır.
     */
    public function baslat(Request $request, string $davam): string
    {
        $state    = Google::acar();
        $verifier = Google::dogrulayici();

        $request->session()->put(self::S_STATE, $state);
        $request->session()->put(self::S_VERIFIER, $verifier);
        $request->session()->put(self::S_QAYIDIS, $this->hedef($davam));

        return $this->google()->unvan($this->qayidisUnvani(), $state, $verifier);
    }

    /**
     * Cavabı yoxlayır və istifadəçini qaytarır.
     *
     * @return array{user:User,yeni:bool,birlesdi:array{moved_documents:int,moved_credits:int}}
     *
     * @throws \RuntimeException
     */
    public function tamamla(Request $request, User $ziyaretci): array
    {
        $state    = (string) $request->session()->pull(self::S_STATE, '');
        $verifier = (string) $request->session()->pull(self::S_VERIFIER, '');

        /* BİRDƏFƏLİKDİR: `pull()` dəyəri oxuyub silir. Sessiyada qalsaydı
           eyni `code`-u ikinci dəfə göndərmək mümkün olardı. */
        if ($state === '' || $verifier === '') {
            throw new \RuntimeException('Giriş sessiyası tapılmadı — yenidən cəhd edin.');
        }

        if (! hash_equals($state, (string) $request->query('state', ''))) {
            throw new \RuntimeException('Giriş açarı uyğun gəlmədi.');
        }

        $code = trim((string) $request->query('code', ''));

        if ($code === '') {
            /* İstifadəçi «İmtina et» düyməsinə basıb — bu xəta deyil. */
            throw new \RuntimeException($request->query('error') === 'access_denied'
                ? 'Google girişi ləğv edildi.'
                : 'Google kodu qaytarmadı.');
        }

        $google = $this->google();
        $token  = $google->deyisdir($code, $this->qayidisUnvani(), $verifier);

        return $this->accounts->googleIle($ziyaretci, $google->kimlik($token));
    }

    /**
     * Girişdən sonra qayıdılacaq marşrutun ADI.
     *
     * AĞ SİYAHI: `?davam=` parametri marşrut adı deyil, `config('oauth.qayidis')`
     * açarıdır. Sərbəst ünvan qəbul etmək saytı açıq yönləndiriciyə çevirərdi.
     */
    public function hedef(?string $davam): string
    {
        $siyahi = (array) config('oauth.qayidis', []);
        $acar   = (string) ($davam ?? '');

        return isset($siyahi[$acar])
            ? $acar
            : (string) config('oauth.qayidis_default', 'kabinet');
    }

    /** Ağ siyahıdakı açarı marşrut adına çevirir. */
    public function marsrut(string $acar): string
    {
        $siyahi = (array) config('oauth.qayidis', []);

        return (string) ($siyahi[$acar] ?? $siyahi[(string) config('oauth.qayidis_default', 'kabinet')] ?? 'account.index');
    }
}
