<a href="{{ route('account.index') }}" @if(request()->routeIs('account.index')) aria-current="page" @endif>
  Ümumi baxış
</a>
<a href="{{ route('account.documents') }}" @if(request()->routeIs('account.documents')) aria-current="page" @endif>
  Sənədlərim <span class="count">{{ $navDocCount ?? '' }}</span>
</a>
<a href="{{ route('account.transactions') }}" @if(request()->routeIs('account.transactions')) aria-current="page" @endif>
  Əməliyyatlar
</a>
<a href="{{ route('account.auth') }}" @if(request()->routeIs('account.auth')) aria-current="page" @endif>
  Hesab
</a>
