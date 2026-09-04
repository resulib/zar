{{-- RÜTBƏ ƏMRİ.

     Quru rəsmi dildə yazılıb və blank estetikasını izləyir: bölmənin bütün
     dəyəri sənədin vizual dilini inandırıcı təqlid etməsindədir, ona görə
     yüksəliş də «təbrik» kimi yox, ƏMR kimi verilir. Bir dəfə göstərilir —
     `seen_at` bazadadır, cookie-də deyil.

     Nömrə sətrin öz `id`-sindən çıxarılır, `rand()`-dan yox: yenidən
     açılanda dəyişən nömrə sənədi saxta kimi göstərir (`Imza::yol()` qaydası). --}}
<div class="pr-emr">
  <div class="pr-emr-kagiz">
    <div class="pr-emr-ust">
      <x-gerb :ad="\App\Support\Dossier\Byuro::QISA" :olcu="42" />
      <div>
        <span class="pr-emr-org">{{ \App\Support\Dossier\Byuro::AD }}</span>
        <span class="pr-emr-bolme">{{ \App\Support\Dossier\Byuro::BOLME }}</span>
      </div>
    </div>

    <div class="pr-emr-xett"></div>

    <h2 class="pr-emr-bas">ƏMR № {{ $emr->emrNo() }}</h2>
    <p class="pr-emr-tarix">{{ $emr->awarded_at?->format('d.m.Y') }}</p>

    <p class="pr-emr-metn">
      @if($profile->departmentLabel() !== ''){{ $profile->departmentLabel() }} şöbəsinin əməkdaşı @endif<b>{{ $profile->adi() }}</b>
      @if($emr->oldRank) <b>{{ $emr->oldRank->title_az }}</b> vəzifəsindən @endif
      <b>{{ $emr->newRank->title_az }}</b> vəzifəsinə təyin edilsin.
    </p>

    <div class="pr-emr-alt">
      <span class="pr-emr-imza">{{ \App\Support\Dossier\Byuro::QISA }} rəhbərliyi</span>
      <form method="POST" action="{{ route('dossier.profil.emr', $emr->id) }}">
        @csrf
        <button type="submit" class="pr-btn pr-btn-kicik">Tanış oldum</button>
      </form>
    </div>

    <p class="pr-emr-fiktiv">{{ \App\Support\Dossier\Byuro::QEYD_QISA }}</p>
  </div>
</div>
