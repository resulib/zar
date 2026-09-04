@extends('layouts.panel')
@section('title', 'İş qovluqları')
@section('bar', 'İdarə paneli')
@section('side-title', 'İdarəetmə')
@section('side') @include('partials.admin-nav') @endsection
@section('nav')<a href="{{ route('admin.dashboard') }}">İdarə paneli</a><a href="{{ url('/') }}">Sayt</a>@endsection
@section('tools')<form method="POST" action="{{ route('admin.logout') }}">@csrf<button class="chip" type="submit">Çıxış</button></form>@endsection

@section('content')
<div class="page-head">
  <div>
    <h1>İş qovluqları</h1>
    <div class="sub">{{ $list->count() }} iş · detektiv qovluqlar burada yaradılır və dərc olunur</div>
  </div>
  <div class="acts"><a class="btn btn-sm" href="{{ route('admin.dossier.new') }}">Yeni iş</a></div>
</div>

@include('partials.flash')

@if($ai)
  {{-- AI ilə iş qurma.

       Nəticə QARALAMADIR: oyunçuya görünmür və dərc etmək üçün
       `QovluqYoxlayici`-dən keçməlidir. Yəni AI kataloqa deyil, redaktora
       yazır — baxış «yadda saxla» anından «dərc et» anına sürüşür.

       Qurma İKİ MƏRHƏLƏDƏDİR və gedişi burada görünür: 30 vərəqi bir OpenAI
       cavabına sığdırmaq mümkün deyil. --}}
  <details class="qv-ai" id="qvAi" data-url="{{ route('admin.dossier.ai') }}">
    <summary>AI ilə yeni iş qur</summary>

    <p class="qv-izah">Bir-iki cümlə ilə nə istədiyinizi yazın — hadisə, yer, ton.
      AI hekayəni, dörd şübhəlini, xronologiyanı, sualları və verdiyiniz sayda
      vərəqi qurur. Nəticə <b>qaralama</b> olur; oxuyub düzəldirsiniz, sonra dərc edirsiniz.</p>

    <label class="fld"><span>Tapşırıq</span>
      <textarea class="input" id="qvAiBrief" rows="4" maxlength="1200"
                placeholder="Sumqayıtda gecə növbəsində işləyən anbarda anbardar ölü tapılır. Dörd nəfər o gecə binada olub."></textarea>
    </label>

    <div class="grid2">
      <label class="fld"><span>Vərəq sayı</span>
        <input class="input" type="number" id="qvAiSay" min="{{ \App\Support\Ai\QovluqBrief::SENED_MIN }}"
               max="{{ \App\Support\Ai\QovluqBrief::SENED_MAX }}" value="20">
      </label>
      <label class="fld"><span>Çətinlik</span>
        <select class="input" id="qvAiCetin">
          @foreach(config('dossier.difficulties') as $c)
            <option value="{{ $c }}" @selected($c === 'orta')>{{ config('dossier.difficulty_labels')[$c] ?? $c }}</option>
          @endforeach
        </select>
      </label>
    </div>

    <div class="acts">
      <button class="btn" type="button" id="qvAiBasla">Qur</button>
      <span class="qv-ai-hal" id="qvAiHal"></span>
    </div>

    <div class="qv-ai-cubuq" id="qvAiCubuq" hidden><i></i></div>
    <div class="qv-ai-problem" id="qvAiProblem" hidden></div>
  </details>
@endif

<div class="tbl-wrap">
  <table class="tbl">
    <thead>
      <tr>
        <th>Ad</th><th>Çətinlik</th><th>Vəziyyət</th>
        <th class="num">Sənəd</th><th class="num">Şəkil</th><th>Son dəyişiklik</th><th></th>
      </tr>
    </thead>
    <tbody>
      @forelse($list as $d)
        <tr>
          <td>
            <a href="{{ route('admin.dossier.form', $d) }}"><b>{{ $d->title }}</b></a>
            <div class="muted">{{ $d->no }}</div>
          </td>
          <td>{{ config('dossier.difficulty_labels')[$d->difficulty] ?? $d->difficulty }}</td>
          <td>
            @if($d->status === \App\Models\Dossier::STATUS_PUBLISHED)
              <span class="badge badge-ok">dərc olunub</span>
            @elseif($d->status === \App\Models\Dossier::STATUS_ARCHIVED)
              <span class="badge">arxiv</span>
            @else
              <span class="badge badge-open">qaralama</span>
            @endif
          </td>
          <td class="num">{{ $d->documents_count }}</td>
          <td class="num">{{ $d->images_count }}</td>
          <td class="muted">{{ $d->updated_at?->format('d.m.Y H:i') }}</td>
          <td class="acts">
            <a class="btn btn-ghost btn-sm" href="{{ route('admin.dossier.form', $d) }}">Redaktə</a>
            @if($d->status === \App\Models\Dossier::STATUS_PUBLISHED)
              <a class="btn btn-ghost btn-sm" href="{{ route('dossier.show', $d->slug) }}" target="_blank" rel="noopener">Önizləmə</a>
            @endif
            <form method="POST" action="{{ route('admin.dossier.duplicate', $d) }}">@csrf
              <button class="btn btn-ghost btn-sm" type="submit">Dublikat</button>
            </form>
            <form method="POST" action="{{ route('admin.dossier.archive', $d) }}">@csrf
              <button class="btn btn-ghost btn-sm" type="submit">
                {{ $d->status === \App\Models\Dossier::STATUS_ARCHIVED ? 'Arxivdən çıxar' : 'Arxivlə' }}
              </button>
            </form>
            @if($d->status !== \App\Models\Dossier::STATUS_PUBLISHED)
              {{-- Dərc olunmuş iş silinmir: oyunçuların irəliləyişi
                   `cascadeOnDelete` ilə yox olardı. --}}
              <form method="POST" action="{{ route('admin.dossier.delete', $d) }}">@csrf
                <button class="btn btn-ghost btn-sm" type="submit">Sil</button>
              </form>
            @endif
          </td>
        </tr>
      @empty
        <tr><td colspan="7" class="muted">Hələ iş yoxdur.</td></tr>
      @endforelse
    </tbody>
  </table>
</div>
@endsection

@push('scripts')
<script src="{{ asset('assets/panel-qovluq.js') }}"></script>
@endpush
