{{-- İZAHAT — şəxsdən alınan sənəd. Blank sadədir və kiçikdir, çünki
     izahatın əsas hissəsi şəxsin öz sözləridir; bunun əvəzinə yuxarıda
     hüquq bildirişi durur. Real izahat vərəqində bu sətir olmadan sənəd
     etibarsızdır, ona görə o, mətndən əvvəl gəlir. --}}
@props(['head' => [], 'dossier', 'doc'])
<div class="p-blank p-blank-izahat">
  <x-blank.ust :head="$head" :olcu="56" qeyd=""/>
</div>
<div class="p-rule"></div>
<div class="p-huquq">
  İzahat verən şəxsə öz dilində danışmaq, izahat verməkdən imtina etmək və
  yazılanı oxuyub düzəliş tələb etmək hüququ izah edilmişdir.
  <span>vərəq {{ $doc->page }} · iş № {{ $dossier->no }}</span>
</div>
