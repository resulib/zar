{{-- Əlavə bloku — ataçla bərkidilmiş kiçik sənəd: kassa çeki, aptek qəbzi,
     bilet, kiçik qeyd. Böyük sənədin üstündə, bir az əyri, ataç kölgəsi ilə. --}}
<div class="p-elave p-elave-{{ $b['yer'] ?? 'sag' }}" @if(isset($b['bucaq']))style="--bucaq:{{ (float) $b['bucaq'] }}deg"@endif>
  <span class="p-atac" aria-hidden="true"></span>
  <div class="p-elave-kagiz p-elave-{{ $b['nov'] ?? 'qeyd' }}">
    @foreach($b['setirler'] ?? [] as $s)<div>{{ $s }}</div>@endforeach
  </div>
</div>
@include('dossier.partials.kenar')
