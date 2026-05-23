const getPaginationItems = (currentPage = 1, lastPage = 1) => {
  if (lastPage <= 1) {
    return [1]
  }

  const pages = new Set([1, lastPage, currentPage, currentPage - 1, currentPage + 1])

  if (currentPage <= 3) {
    pages.add(2)
    pages.add(3)
  }

  if (currentPage >= lastPage - 2) {
    pages.add(lastPage - 1)
    pages.add(lastPage - 2)
  }

  const orderedPages = [...pages]
    .filter((page) => page >= 1 && page <= lastPage)
    .sort((firstPage, secondPage) => firstPage - secondPage)

  return orderedPages.reduce((items, page, index) => {
    const previousPage = orderedPages[index - 1]

    if (previousPage && page - previousPage > 1) {
      items.push(`ellipsis-${previousPage}-${page}`)
    }

    items.push(page)
    return items
  }, [])
}

export function DailyBalancePagination({ isLoading, page, pagination, setPage }) {
  const currentPage = pagination?.currentPage ?? 1
  const lastPage = pagination?.lastPage ?? 1
  const paginationItems = getPaginationItems(currentPage, lastPage)

  if (!pagination || lastPage <= 1) {
    return null
  }

  return (
    <div className="routes-pagination">
      <button
        type="button"
        disabled={isLoading || currentPage <= 1}
        onClick={() => setPage(currentPage - 1)}
      >
        Previous
      </button>
      <div className="routes-pagination__pages">
        {paginationItems.map((item) =>
          typeof item === 'string' ? (
            <span key={item} className="routes-pagination__ellipsis">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={item === page ? 'is-active' : ''}
              disabled={isLoading || item === currentPage}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        disabled={isLoading || currentPage >= lastPage}
        onClick={() => setPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  )
}
