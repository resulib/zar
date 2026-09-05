<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'uuid', 'guest_token', 'name', 'email', 'password',
        'google_id', 'auth_provider', 'auto_name',
        'credits', 'is_admin', 'is_blocked', 'last_ip', 'last_seen_at',
    ];

    protected $hidden = ['password', 'remember_token', 'guest_token', 'google_id'];

    protected function casts(): array
    {
        return [
            'password'          => 'hashed',
            'is_admin'          => 'boolean',
            'auto_name'         => 'boolean',
            'is_blocked'        => 'boolean',
            'credits'           => 'integer',
            'email_verified_at' => 'datetime',
            'last_seen_at'      => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        // uuid həmişə dolu olsun — hansı yoldan yaradılmasından asılı olmayaraq
        static::creating(function (self $user): void {
            $user->uuid ??= (string) \Illuminate\Support\Str::uuid();
            $user->guest_token ??= bin2hex(random_bytes(24));
        });
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * İş qovluğu bölməsinin müstəntiq profili.
     *
     * TƏLƏBATA GÖRƏ yaranır (`ProfileService::ensure()`), ona görə burada
     * `null` ola bilər — qonaq da, hələ heç nə oynamamış hesab da profilsizdir.
     */
    public function investigatorProfile(): HasOne
    {
        return $this->hasOne(InvestigatorProfile::class);
    }

    /**
     * Qeydiyyatdan keçməmiş sessiya.
     *
     * ÖLÇÜ E-POÇTDUR, `name` DEYİL: avtomatik qonaq qeydiyyatı hər ziyarətçiyə
     * ad verir («Qonaq-4821»), ona görə adın dolu olması artıq hesab demək
     * deyil. Parol da ölçü ola bilməz — Google ilə açılmış hesabda parol yoxdur.
     */
    public function isGuest(): bool
    {
        return $this->email === null;
    }

    /** Google ilə açılmış və ya bağlanmış hesab. */
    public function hasGoogle(): bool
    {
        return $this->google_id !== null && $this->google_id !== '';
    }

    /** Parolu var? Yalnız Google ilə açılmış hesabda yoxdur. */
    public function hasPassword(): bool
    {
        return $this->password !== null && $this->password !== '';
    }

    public function displayName(): string
    {
        if ($this->name) {
            return $this->name;
        }

        return $this->email ?? ('Qonaq #' . substr((string) $this->uuid, 0, 8));
    }
}
