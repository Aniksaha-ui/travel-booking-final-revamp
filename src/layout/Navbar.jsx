import { Bell, ChevronDown, Menu, PanelLeft, Search, Sun } from 'lucide-react'
import { useAuthContext } from '../contexts/AuthContext'

export function Navbar({ title, onMenuClick }) {
  const { auth, sessionMessage, clearSessionMessage } = useAuthContext()
  const userInitial = auth.user?.name?.charAt(0)?.toUpperCase() || auth.user?.email?.charAt(0)?.toUpperCase() || 'A'
  const userName = auth.user?.name ?? 'admin'

  return (
    <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-[#2d282b] bg-[#171314] px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-[#969baa] hover:bg-[#211c1f] hover:text-white md:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <PanelLeft size={17} className="hidden text-[#969baa] md:block" />
        <h1 className="ml-3 text-sm font-bold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {sessionMessage ? (
          <button
            type="button"
            onClick={clearSessionMessage}
            className="rounded-md border border-red-900/70 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-200"
          >
            {sessionMessage}
          </button>
        ) : null}

        <label className="hidden h-10 w-[190px] items-center gap-2 rounded-xl border border-[#2d282b] bg-[#211c1f] px-3 text-sm text-[#969baa] lg:flex xl:w-[260px]">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search menus"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#969baa]"
          />
          <span className="rounded-md bg-[#171314] px-2 py-1 text-xs text-[#686b77]">Ctrl K</span>
        </label>

        <button className="hidden h-10 items-center gap-2 rounded-xl border border-[#2d282b] bg-[#211c1f] px-3 text-sm font-semibold text-white sm:inline-flex">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#100d0e] text-xs">US</span>
          English
          <ChevronDown size={15} className="text-[#969baa]" />
        </button>

        <button className="rounded-lg p-2 text-[#969baa] hover:bg-[#211c1f] hover:text-white" aria-label="Theme">
          <Sun size={18} />
        </button>

        <button className="rounded-lg p-2 text-[#969baa] hover:bg-[#211c1f] hover:text-white" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <button className="flex h-10 items-center gap-2 rounded-xl border border-[#2d282b] bg-[#211c1f] px-2 pr-3 text-sm font-semibold text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-xs font-bold">
            {userInitial}
          </span>
          <span className="hidden sm:inline">{userName}</span>
          <ChevronDown size={15} className="text-[#969baa]" />
        </button>
      </div>
    </header>
  )
}
