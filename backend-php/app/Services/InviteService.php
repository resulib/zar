<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Invite;
use App\Models\InviteGuest;
use App\Models\User;
use App\Support\Devet;
use App\Support\Sanitizer;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Dəvətnamənin bütün yazma yolu.
 *
 * DocumentService ilə eyni prinsip: müştəridən gələn sətir XAHİŞDİR, dəyər
 * deyil — dizayn, palitra və tədbir config/devet.php ağ siyahılarına
 * bağlanır, mətnlər limitə görə kəsilir, xəritə linki ağ siyahıdan keçir.
 */
class InviteService
{
    public function __construct(private readonly CreditService $credits)
    {
    }

    /** @throws \RuntimeException bad_design */
    public function create(User $user, array $input): Invite
    {
        return Invite::create($this->fields($input) + [
            'token'   => $this->newToken(),
            'user_id' => $user->id,
            'status'  => Invite::STATUS_DRAFT,
        ]);
    }

    /**
     * Dərc olunduqdan sonra da redaktə edilə bilər (məkan dəyişə bilər),
     * amma token və sahib dəyişmir — paylanmış linklər sınmamalıdır.
     *
     * @throws \RuntimeException forbidden|removed|bad_design
     */
    public function update(User $user, Invite $invite, array $input): Invite
    {
        $this->assertOwner($user, $invite);

        $data = $this->fields($input);

        /* Dizayn və ya məzmun dəyişibsə köhnə önizləmə şəkli yalan danışar —
           brauzer yenisini göndərənə qədər bayraq düşür. */
        $degisdi = false;
        foreach (['design', 'palette', 'host_names', 'title', 'event_at', 'event_time'] as $k) {
            if ((string) ($invite->{$k} instanceof Carbon ? $invite->{$k}->toDateString() : $invite->{$k})
                !== (string) ($data[$k] instanceof Carbon ? $data[$k]->toDateString() : $data[$k])) {
                $degisdi = true;
            }
        }
        if ($degisdi) {
            $data['og_ready'] = false;
        }

        $invite->fill($data)->save();

        return $invite->refresh();
    }

    /**
     * Dərc — tədbirə görə BİR DƏFƏ ödəniş. İdempotentdir: təkrar çağırış
     * ikinci krediti almır (DocumentService::publish ilə eyni qayda).
     *
     * @throws \RuntimeException forbidden|removed|no_credits
     */
    public function publish(User $user, Invite $invite): Invite
    {
        $this->assertOwner($user, $invite);

        if ($invite->isPublished()) {
            return $invite;
        }

        $this->credits->spend($user, (int) config('devet.price_credits'), null,
            'Dəvətnamə ' . $invite->token);

        $invite->forceFill([
            'status'       => Invite::STATUS_PUBLISHED,
            'published_at' => now(),
        ])->save();

        return $invite->refresh();
    }

    public function remove(Invite $invite): void
    {
        $invite->forceFill(['status' => Invite::STATUS_REMOVED])->save();
        $this->deleteOg($invite);
    }

    /* ------------------------------------------------------------------ */
    /*  Önizləmə şəkli                                                     */
    /* ------------------------------------------------------------------ */

    /**
     * WhatsApp önizləməsi. Serverdə şəkil emalı yoxdur, ona görə brauzer
     * hazır JPEG göndərir — nəticə istifadəçinin gördüyü ilə eynidir və
     * server render motoru saxlamağa ehtiyac qalmır.
     *
     * Fayl public kökdən KƏNARDA saxlanılır və kontroller sabit
     * `image/jpeg` başlığı ilə axıdır: yüklənən faylın özü heç vaxt
     * icra oluna bilməz.
     *
     * @throws \RuntimeException forbidden|bad_image
     */
    public function storeOg(User $user, Invite $invite, string $binary): Invite
    {
        $this->assertOwner($user, $invite);

        $cfg = (array) config('devet.og');

        if ($binary === '' || strlen($binary) > (int) $cfg['max_bytes']) {
            throw new \RuntimeException('bad_image');
        }

        $info = @getimagesizefromstring($binary);
        if ($info === false
            || ($info[2] ?? 0) !== IMAGETYPE_JPEG
            || (int) $info[0] !== (int) $cfg['width']
            || (int) $info[1] !== (int) $cfg['height']) {
            throw new \RuntimeException('bad_image');
        }

        /* GD varsa şəkil yenidən kodlaşdırılır: bu, JPEG-in içinə yerləşdirilmiş
           hər şeyi (metadata, artıq baytlar) atır. GD yoxdursa ölçü və növ
           yoxlaması ilə kifayətlənirik — fayl onsuz da sabit başlıqla verilir. */
        if (function_exists('imagecreatefromstring')) {
            $im = @imagecreatefromstring($binary);
            if ($im === false) {
                throw new \RuntimeException('bad_image');
            }
            ob_start();
            imagejpeg($im, null, 88);
            $binary = (string) ob_get_clean();
            imagedestroy($im);
        }

        $dir = (string) $cfg['path'];
        if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new \RuntimeException('bad_image');
        }

        file_put_contents($dir . '/' . Devet::ogFile((string) $invite->token), $binary);

        $invite->forceFill(['og_ready' => true])->save();

        return $invite->refresh();
    }

    public function ogPath(Invite $invite): ?string
    {
        $p = rtrim((string) config('devet.og.path'), '/') . '/' . Devet::ogFile((string) $invite->token);

        return is_file($p) ? $p : null;
    }

    protected function deleteOg(Invite $invite): void
    {
        $p = $this->ogPath($invite);
        if ($p !== null) {
            @unlink($p);
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Qonaqlar                                                           */
    /* ------------------------------------------------------------------ */

    /**
     * Toplu qonaq siyahısı. Mövcud adlar SAXLANILIR — siyahını yeniləmək
     * artıq cavab vermiş qonağın cavabını silməməlidir.
     *
     * @throws \RuntimeException forbidden|removed
     * @return InviteGuest[]
     */
    public function syncGuests(User $user, Invite $invite, mixed $raw): array
    {
        $this->assertOwner($user, $invite);

        $limits = (array) config('devet.limits');
        $names = Devet::guestNames($raw, (int) $limits['guests'], (int) $limits['guest']);

        return DB::transaction(function () use ($invite, $names): array {
            $mevcud = $invite->guests()->whereNotNull('token')->get()->keyBy('name');
            $qalan = [];

            foreach ($names as $i => $name) {
                $g = $mevcud->get($name);

                if ($g === null) {
                    $g = InviteGuest::create([
                        'invite_id' => $invite->id,
                        'token'     => $this->newGuestToken(),
                        'name'      => $name,
                        'sort'      => $i,
                    ]);
                } elseif ((int) $g->sort !== $i) {
                    $g->forceFill(['sort' => $i])->save();
                }

                $qalan[] = $g->id;
            }

            /* Siyahıdan çıxarılan qonaq silinir — amma yalnız tokenli sətirlər,
               yəni ümumi linkdən özü cavab verən adam toxunulmaz qalır. */
            $invite->guests()->whereNotNull('token')->whereNotIn('id', $qalan ?: [0])->delete();

            return $invite->guests()->whereNotNull('token')->get()->all();
        });
    }

    /**
     * Qonağın cavabı. Açıqdır — linki bilən hər kəs cavab verə bilər,
     * ona görə burada YALNIZ öz sətrini dəyişə bilir və başqa heç nə.
     *
     * @throws \RuntimeException not_published|rsvp_off|bad_rsvp
     */
    public function rsvp(Invite $invite, ?InviteGuest $guest, array $input): InviteGuest
    {
        if (!$invite->isPublished()) {
            throw new \RuntimeException('not_published');
        }

        if (!$invite->rsvp_enabled) {
            throw new \RuntimeException('rsvp_off');
        }

        $cavab = $input['rsvp'] ?? '';
        if (!Devet::isRsvp($cavab)) {
            throw new \RuntimeException('bad_rsvp');
        }

        $limits = (array) config('devet.limits');
        $say = (int) ($input['count'] ?? 1);
        $say = max(1, min((int) $limits['party'], $say));

        $data = [
            'rsvp'         => $cavab,
            'rsvp_count'   => $cavab === 'gelirem' ? $say : null,
            'rsvp_note'    => Sanitizer::text($input['note'] ?? '', 200),
            'responded_at' => now(),
        ];

        if ($guest !== null) {
            $guest->forceFill($data)->save();

            return $guest->refresh();
        }

        /* Ümumi linkdən gələn qonaq: adını özü yazır, token verilmir. */
        $ad = Sanitizer::person($input['name'] ?? '', (int) $limits['guest']);
        if ($ad === '') {
            throw new \RuntimeException('bad_rsvp');
        }

        return InviteGuest::create($data + [
            'invite_id' => $invite->id,
            'token'     => null,
            'name'      => $ad,
            'sort'      => 9000,
        ]);
    }

    public function markOpened(InviteGuest $guest): void
    {
        if ($guest->opened_at === null) {
            $guest->forceFill(['opened_at' => now()])->saveQuietly();
        }
    }

    /* ------------------------------------------------------------------ */
    /*  Daxili                                                             */
    /* ------------------------------------------------------------------ */

    /** @throws \RuntimeException forbidden|removed */
    protected function assertOwner(User $user, Invite $invite): void
    {
        if ((int) $invite->user_id !== (int) $user->id) {
            throw new \RuntimeException('forbidden');
        }

        if ($invite->status === Invite::STATUS_REMOVED) {
            throw new \RuntimeException('removed');
        }
    }

    /** @throws \RuntimeException bad_design */
    protected function fields(array $input): array
    {
        $limits = (array) config('devet.limits');

        $design = Sanitizer::pick($input['design'] ?? '', (array) config('devet.designs'), '');
        if ($design === '') {
            throw new \RuntimeException('bad_design');
        }

        $address = Sanitizer::text($input['address'] ?? '', (int) $limits['address']);

        return [
            'event'   => Sanitizer::pick($input['event'] ?? '', (array) config('devet.events'), 'toy'),
            'design'  => $design,
            'palette' => Sanitizer::pick($input['palette'] ?? '', (array) config('devet.palettes'), 'qizil'),

            'host_names'    => Sanitizer::text($input['hosts'] ?? '', (int) $limits['hosts']),
            'title'         => Sanitizer::text($input['title'] ?? '', (int) $limits['title']),
            'event_at'      => $this->dateFrom($input['date'] ?? null),
            'event_time'    => Sanitizer::clock($input['time'] ?? ''),
            'venue_name'    => Sanitizer::text($input['venue'] ?? '', (int) $limits['venue']),
            'venue_address' => $address,
            'map_url'       => Devet::mapUrl($input['mapUrl'] ?? '', $address, (array) config('devet.map_hosts')),
            'phone'         => Sanitizer::text($input['phone'] ?? '', (int) $limits['phone']),
            'note'          => Sanitizer::text($input['note'] ?? '', (int) $limits['note']),
            'rsvp_enabled'  => (bool) ($input['rsvp'] ?? true),
        ];
    }

    /** Yalnız YYYY-MM-DD. Keçmiş tarixə icazə var: xatirə dəvətnaməsi də olur. */
    protected function dateFrom(mixed $value): ?Carbon
    {
        if (!is_string($value) || preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) !== 1) {
            return null;
        }

        try {
            return Carbon::createFromFormat('Y-m-d', $value)->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }

    protected function newToken(): string
    {
        do {
            $t = Devet::token();
        } while (Invite::where('token', $t)->exists());

        return $t;
    }

    protected function newGuestToken(): string
    {
        do {
            $t = Devet::token();
        } while (InviteGuest::where('token', $t)->exists());

        return $t;
    }
}
