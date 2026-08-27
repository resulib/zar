<?php

use App\Http\Middleware\AdminOnly;
use App\Http\Middleware\IdentifyVisitor;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\ThrottleRequests;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Hər sorğuda ziyarətçini tanıyırıq: giriş etmiş istifadəçi və ya qonaq cookie-si.
        $middleware->web(append: [
            IdentifyVisitor::class,
        ]);

        // `throttle:*` limit-ləri ziyarətçinin id-si ilə açarlanır, ona görə
        // IdentifyVisitor mütləq ThrottleRequests-dən əvvəl işləməlidir.
        $middleware->prependToPriorityList(
            before: ThrottleRequests::class,
            prepend: IdentifyVisitor::class,
        );

        $middleware->alias([
            'admin' => AdminOnly::class,
        ]);

        // Ödəniş provayderinin webhook-u CSRF-dən azaddır (imza ilə qorunur).
        $middleware->validateCsrfTokens(except: [
            'api/payments/callback',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
