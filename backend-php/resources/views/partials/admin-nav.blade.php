@php($openReports = \App\Models\Report::query()->where('status', 'open')->count())
<a href="{{ route('admin.dashboard') }}" @if(request()->routeIs('admin.dashboard')) aria-current="page" @endif>Ümumi baxış</a>
<a href="{{ route('admin.documents') }}" @if(request()->routeIs('admin.documents*')) aria-current="page" @endif>Sənədlər</a>
<a href="{{ route('admin.payments') }}" @if(request()->routeIs('admin.payments')) aria-current="page" @endif>Ödənişlər</a>
<a href="{{ route('admin.transactions') }}" @if(request()->routeIs('admin.transactions')) aria-current="page" @endif>Əməliyyatlar</a>
<a href="{{ route('admin.users') }}" @if(request()->routeIs('admin.users*')) aria-current="page" @endif>İstifadəçilər</a>
<a href="{{ route('admin.reports') }}" @if(request()->routeIs('admin.reports')) aria-current="page" @endif>
  Şikayətlər
  @if($openReports > 0)<span class="count badge-open">{{ $openReports }}</span>@endif
</a>
<a href="{{ route('admin.settings') }}" @if(request()->routeIs('admin.settings')) aria-current="page" @endif>Parametrlər</a>
