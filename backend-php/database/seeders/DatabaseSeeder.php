<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $email    = (string) env('ADMIN_EMAIL', 'admin@zarafat.az');
        $password = (string) env('ADMIN_PASSWORD', 'admin12345');

        $admin = User::query()->firstOrNew(['email' => $email]);

        $admin->fill([
            'uuid'        => $admin->uuid ?? (string) Str::uuid(),
            'name'        => 'İdarəçi',
            'password'    => $password,
            'is_admin'    => true,
            'guest_token' => $admin->guest_token ?? bin2hex(random_bytes(24)),
        ])->save();

        $this->command?->info("Admin hazırdır: {$email}");
    }
}
