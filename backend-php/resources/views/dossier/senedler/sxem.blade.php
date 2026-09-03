{{-- Sxem — serverdə saxlanan SVG. Sxem::temizle() süzgəcindən keçir. --}}
@include('dossier.partials.basliq')
@php($sxem = \App\Support\Dossier\Sxem::temizle($c['svg'] ?? ''))
@if($sxem !== '')
<div class="p-sxem">{!! $sxem !!}</div>
@endif
@include('dossier.partials.qeyd')
