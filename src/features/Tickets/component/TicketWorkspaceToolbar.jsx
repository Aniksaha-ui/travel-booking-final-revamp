import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import useDebouncedValue from '../../../hooks/useDebouncedValue'
import { TICKET_VIEW_OPTIONS } from '../constants/tickets.constants'

export function TicketWorkspaceToolbar({
  activeView,
  boardCount,
  pendingCount,
  search,
  setActiveView,
  setSearch,
}) {
  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebouncedValue(searchInput)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    if (debouncedSearch !== search) {
      setSearch(debouncedSearch)
    }
  }, [debouncedSearch, search, setSearch])

  return (
    <section className="mb-5 rounded-lg border border-[#332d30] bg-[#231f21] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-[#332d30] bg-[#171314] p-1">
            {TICKET_VIEW_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold transition ${
                  activeView === option.key
                    ? 'bg-[#1d4ed8] text-white shadow-sm'
                    : 'text-[#9fb2d0] hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setActiveView(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="inline-flex h-8 items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-3 text-amber-100">
              {pendingCount} pending issues
            </span>
            <span className="inline-flex h-8 items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 text-blue-200">
              {boardCount} board tickets
            </span>
          </div>
        </div>

        <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-3 text-sm text-[#8c97aa] lg:max-w-[320px]">
          <Search size={16} />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#70798a]"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search ticket, requester, remarks..."
            value={searchInput}
          />
        </label>
      </div>
    </section>
  )
}
