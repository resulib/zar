@if ($paginator->hasPages())
  <nav class="pager" aria-label="Səhifələmə">
    @if ($paginator->onFirstPage())
      <span class="pager-btn is-off">Əvvəlki</span>
    @else
      <a class="pager-btn" href="{{ $paginator->previousPageUrl() }}" rel="prev">Əvvəlki</a>
    @endif

    <span class="pager-info">
      {{ $paginator->firstItem() }}–{{ $paginator->lastItem() }} / {{ $paginator->total() }}
    </span>

    @if ($paginator->hasMorePages())
      <a class="pager-btn" href="{{ $paginator->nextPageUrl() }}" rel="next">Növbəti</a>
    @else
      <span class="pager-btn is-off">Növbəti</span>
    @endif
  </nav>
@endif
