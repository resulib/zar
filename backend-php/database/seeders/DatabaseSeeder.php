<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /** Nümunə `.env`-dəki dəyər — istehsalatda buraxılmamalıdır. */
    private const WEAK_PASSWORD = 'admin12345';

    public function run(): void
    {
        $this->call(CatalogSeeder::class);
        $this->call(DossierSeeder::class);

        $email    = trim((string) env('ADMIN_EMAIL', 'admin@zarafat.az'));
        $password = (string) env('ADMIN_PASSWORD', '');

        $admin  = User::query()->firstOrNew(['email' => $email]);
        $exists = $admin->exists;

        /* Parol yalnız hesab ilk dəfə yaradılanda təyin olunur.
           Əks halda təkrar `db:seed` mövcud admin parolunu sıfırlayardı. */
        if (! $exists) {
            if ($password === '') {
                $password = Str::password(20);
                $this->command?->warn("ADMIN_PASSWORD boşdur — təsadüfi parol yaradıldı:\n    {$password}\nİndi qeyd edin, bir daha göstərilməyəcək.");
            }

            if (app()->environment('production') && $password === self::WEAK_PASSWORD) {
                $this->command?->error('İstehsalatda nümunə parolu (admin12345) işlədilə bilməz — .env-də ADMIN_PASSWORD təyin edin.');

                return;
            }

            if (mb_strlen($password) < 12) {
                $this->command?->warn('ADMIN_PASSWORD 12 simvoldan qısadır — istehsalata çıxmazdan əvvəl dəyişin.');
            }

            $admin->password = $password;       // model `hashed` cast ilə özü hash-layır
        }

        $admin->fill([
            'uuid'        => $admin->uuid ?? (string) Str::uuid(),
            'name'        => $admin->name ?? 'İdarəçi',
            'is_admin'    => true,
            'guest_token' => $admin->guest_token ?? bin2hex(random_bytes(24)),
        ])->save();

        $this->command?->info(
            $exists
                ? "Admin artıq mövcuddur, parol toxunulmadı: {$email}"
                : "Admin yaradıldı: {$email}"
        );
    }
}
