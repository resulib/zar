{{-- Bölmənin öz bildiriş zolağı: `partials/flash.blade.php` saytın digər
     məhsulunun panelinə aiddir və `panel.css` tələb edir. --}}
@if(session('status'))
  <div class="pr-flash ok">{{ session('status') }}</div>
@endif
@if($errors->any())
  <div class="pr-flash xeta">
    @foreach($errors->all() as $x)<span>{{ $x }}</span>@endforeach
  </div>
@endif
