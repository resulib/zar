{{-- Kənar qeydi — müstəntiqin qırmızı qələmi. Blok deyil, blokun nişanıdır.
     Hansı bloka aid olduğu `kenar` açarı ilə göstərilir; hansı SÖZƏ aid
     olduğu isə mətnin içində `%%söz%%` ilə — söz indeksi mətn bir kəlmə
     dəyişəndə sürüşür, işarə isə sözlə birlikdə gəzir. --}}
@if(! empty($b['kenar']['metn']))
  @php($k = $b['kenar'])
  <div class="p-kenar p-kenar-{{ $k['nov'] ?? 'qeyd' }} p-kenar-{{ $k['yer'] ?? 'sag' }}">
    @if(($k['nov'] ?? '') === 'sual')<span class="p-kenar-i" aria-hidden="true">?</span>@endif
    <span>{{ $k['metn'] }}</span>
  </div>
@endif
