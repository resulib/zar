<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Kredit paketləri. Framework-dən asılı deyil — ayrıca test edilə bilir.
 */
final class Packs
{
    /** @param array<string, array{id:string,credits:int,amount:float|int,label:string,note?:string,best?:bool}> $packs */
    public function __construct(private readonly array $packs)
    {
    }

    /** @return list<array<string, mixed>> */
    public function all(): array
    {
        return array_values($this->packs);
    }

    public function has(string $id): bool
    {
        return isset($this->packs[$id]);
    }

    /**
     * @return array{id:string,credits:int,amount:float,label:string,note:string,best:bool}
     * @throws \InvalidArgumentException naməlum paket üçün
     */
    public function get(string $id): array
    {
        if (! isset($this->packs[$id])) {
            throw new \InvalidArgumentException("Naməlum paket: {$id}");
        }

        $p = $this->packs[$id];

        return [
            'id'      => (string) $p['id'],
            'credits' => (int) $p['credits'],
            'amount'  => round((float) $p['amount'], 2),
            'label'   => (string) $p['label'],
            'note'    => (string) ($p['note'] ?? ''),
            'best'    => (bool) ($p['best'] ?? false),
        ];
    }
}
