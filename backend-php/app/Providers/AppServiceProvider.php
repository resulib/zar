<?php

declare(strict_types=1);

namespace App\Providers;

use App\Http\Middleware\IdentifyVisitor;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        /* Sayt https-dədirsə sessiya cookie-si də yalnız https ilə getsin.
           `APP_URL`-dan törədilir: layihənin config/session.php faylı yoxdur,
           həm də açıq şəkildə true yazmaq http-də işləyən quraşdırmanı sındırardı.
           Eyni məntiq qonaq cookie-sində də var (IdentifyVisitor). */
        if (str_starts_with((string) config('zarafat.public_url'), 'https')) {
            config([
                'session.secure'    => true,
                'session.http_only' => true,
                'session.same_site' => 'lax',
            ]);
        }

        /* $request->visitor() — cari qonaq və ya giriş etmiş istifadəçi.
           Qonaq sətri MƏHZ BURADA, ilk çağırışda yaradılır. IdentifyVisitor
           yalnız tanıyır: belədə cookie qəbul etməyən skript sadəcə GET
           göndərməklə users cədvəlini doldura bilmir. */
        Request::macro('visitor', function (): User {
            /** @var Request $this */
            $visitor = $this->attributes->get('visitor');

            if ($visitor instanceof User) {
                return $visitor;
            }

            /** @var AccountService $accounts */
            $accounts = app(AccountService::class);
            $visitor  = $accounts->newGuest($this->ip());

            IdentifyVisitor::issueCookie((string) $visitor->guest_token);
            $this->attributes->set('visitor', $visitor);

            return $visitor;
        });

        // Limit açarı: ziyarətçi tanınıbsa onun id-si, yoxdursa IP.
        // (Middleware sırası pozulsa belə limit 500 vermir.)
        $key = function (Request $r): string {
            $visitor = $r->attributes->get('visitor');

            return $visitor instanceof User ? 'u:' . $visitor->id : 'ip:' . $r->ip();
        };

        RateLimiter::for('documents', fn (Request $r) => Limit::perMinute(20)->by($key($r)));
        RateLimiter::for('payments',  fn (Request $r) => Limit::perMinute(12)->by($key($r)));
        RateLimiter::for('reports',   fn (Request $r) => Limit::perMinute(10)->by($key($r)));

        // AI köməkçisi: hər çağırış OpenAI-yə pul xərcləyir. Yalnız admin panelə
        // açıqdır, amma oğurlanmış sessiya ilə hesabı boşaltmaq mümkün olmasın.
        RateLimiter::for('ai', fn (Request $r) => Limit::perMinute(8)->by($key($r)));

        // Sosial profil axtarışı: hər çağırış kənar platformaya gedir və onların
        // IP limitindən yeyir. Bloklanmamaq üçün `ai` ilə eyni səviyyədə saxlanılır.
        RateLimiter::for('sosial', fn (Request $r) => Limit::perMinute(10)->by($key($r)));

        // Ölçmə hadisələri: sənəd yaratmaqdan ucuzdur, amma limitsiz qalsa
        // document_events cədvəli sadə döngə ilə doldurula bilər.
        RateLimiter::for('events',    fn (Request $r) => Limit::perMinute(30)->by($key($r)));

        // Dəvətnamə yazma yolları: sahib öz tədbirini redaktə edir.
        RateLimiter::for('devet', fn (Request $r) => Limit::perMinute(30)->by($key($r)));

        // Açıq oxuma: qonaq linki açır, şəkil və məzmun sorğusu gedir.
        // Token 22 simvoldur, yəni sadalamaq mümkün deyil — limit yalnız
        // sui-istifadəyə qarşıdır, ona görə səxavətlidir.
        RateLimiter::for('devet-read', fn (Request $r) => [
            Limit::perMinute(90)->by($key($r)),
            Limit::perMinute(180)->by('ip:' . $r->ip()),
        ]);

        /* İş qovluğu bölməsi.
           `dossier-kilid` bilərəkdən ən sərt limitdir: kod dörd rəqəmdir və
           on min variant limitsiz halda dəqiqələr içində sınanardı — kilidin
           əsl qorunması uzunluqda deyil, buradadır.
           `dossier-rey` isə üç cəhd qaydasının şəbəkə tərəfdəki tamamlayıcısıdır. */
        RateLimiter::for('dossier', fn (Request $r) => Limit::perMinute(30)->by($key($r)));

        RateLimiter::for('dossier-read', fn (Request $r) => [
            Limit::perMinute(90)->by($key($r)),
            Limit::perMinute(180)->by('ip:' . $r->ip()),
        ]);

        RateLimiter::for('dossier-kilid', fn (Request $r) => [
            Limit::perMinute(10)->by($key($r)),
            Limit::perMinute(30)->by('ip:' . $r->ip()),
        ]);

        RateLimiter::for('dossier-rey', fn (Request $r) => [
            Limit::perMinute(6)->by($key($r)),
            Limit::perMinute(20)->by('ip:' . $r->ip()),
        ]);

        // Qonaq cavabı HƏR KƏSƏ açıqdır — ən sərt limit buradadır, yoxsa
        // linki bilən bir nəfər qonaq siyahısını uydurma adlarla doldura bilər.
        RateLimiter::for('rsvp', fn (Request $r) => [
            Limit::perMinute(8)->by($key($r)),
            Limit::perMinute(20)->by('ip:' . $r->ip()),
        ]);

        // Reyestr açıqdır və qeydiyyat nömrəsi cəmi 4 rəqəmdir — limitsiz qalsa
        // bütün reyestri sadalamaq və baxış sayğacını şişirtmək olar.
        RateLimiter::for('registry', fn (Request $r) => [
            Limit::perMinute(30)->by($key($r)),
            Limit::perMinute(60)->by('ip:' . $r->ip()),
        ]);

        // Parol sınağı: e-poçt+IP cütü üzrə sərt, IP üzrə isə ümumi limit.
        // İkisi birlikdə həm bir hesaba, həm də siyahı üzrə hücumu dayandırır.
        RateLimiter::for('login', fn (Request $r) => [
            Limit::perMinute(5)->by(mb_strtolower((string) $r->input('email')) . '|' . $r->ip()),
            Limit::perMinute(20)->by('ip:' . $r->ip()),
            Limit::perDay(200)->by('ip:' . $r->ip()),
        ]);

        // Qeydiyyat: bir IP-dən kütləvi hesab açılmasının qarşısını alır.
        RateLimiter::for('register', fn (Request $r) => [
            Limit::perMinute(3)->by('ip:' . $r->ip()),
            Limit::perDay(20)->by('ip:' . $r->ip()),
        ]);
    }
}
