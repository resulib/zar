{{-- CİNAYƏT LENTİ — sarı zolaq, üstündə qara yazı.

     Mətn TƏKRARLANIR və `aria-hidden`-dir: bu, oxunacaq cümlə deyil,
     tanınacaq NAXIŞDIR. Ekran oxuyucusuna «CİNAYƏT İŞİ CİNAYƏT İŞİ …»
     demək məlumat yox, səs-küydür.

     Şəkil deyil, mətn+CSS-dir: bölmədə şəkil faylı yoxdur və hər ölçüdə
     iti qalmalıdır.

     $az — daha nazik variant (kart və kiçik sahələr üçün). --}}
<div class="skoc @if(! empty($az)) skoc-az @endif" aria-hidden="true">
  <div class="skoc-in">
    @for($i = 0; $i < 14; $i++)<span>CİNAYƏT İŞİ</span>@endfor
  </div>
</div>
