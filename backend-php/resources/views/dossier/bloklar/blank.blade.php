{{-- Blank başlığı. NÖV MƏLUMATDAN GƏLİR, koddan yox.

     Bütün sənədlərin eyni başlığı olması səhv idi: qərar, arayış, protokol
     və izahat real həyatda TAMAMİLƏ FƏRQLİ formalardır. Amma bu, hər sənəd
     növü üçün ayrıca şablon demək DEYİL — `views/dossier/senedler/` qovluğu
     məhz ona görə silinmişdi və `check-dossier.js` onun geri qayıtmamasını
     yoxlayır. Burada başqa yol seçilib: blank bir blokdur, `nov` isə onun
     XASSƏSİDİR, kilidin `nov`-u kimi. Render qatı yenə hekayəni tanımır.

     Hər növ ayrıca təkrar işlənən komponentdir (`components/blank/*`) və
     hamısı ortaq `<x-blank.ust>` başlığını işlədir — gerb və qurum sətirləri
     bir yerdə dəyişir, hər yerdə dəyişir. --}}
@php($setirler = array_values(array_filter((array) ($b['setirler'] ?? []))) ?: $head)
@php($novler = (array) config('dossier.blank_novleri', ['resmi']))
{{-- Ağ siyahı MƏCBURİDİR: `nov` komponentin adına düşür, yəni yoxlanmamış
     dəyər ixtiyari görünüşü render etməyə cəhd edərdi. --}}
@php($nov = in_array($b['nov'] ?? 'resmi', $novler, true) ? ($b['nov'] ?? 'resmi') : 'resmi')
<x-dynamic-component :component="'blank.' . $nov"
                     :head="$setirler" :dossier="$dossier" :doc="$doc"/>
@include('dossier.partials.kenar')
