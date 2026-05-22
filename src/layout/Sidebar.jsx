import { ChevronRight, GalleryVerticalEnd, LogOut, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { getSupportedRoute, hasChildren } from '../features/menu/utils/menuHelpers'
import { MenuIcon } from '../features/menu/utils/menuIcons'

function MenuSection({ items, onClose }) {
  const [expandedItems, setExpandedItems] = useState({})

  const toggleExpanded = (itemId) => {
    setExpandedItems((currentItems) => ({
      ...currentItems,
      [itemId]: !currentItems[itemId],
    }))
  }

  const renderItems = (menuItems, level = 0) =>
    menuItems.map((item) => {
      const supportedRoute = getSupportedRoute(item.path)
      const expanded = Boolean(expandedItems[item.id])
      const childItems = hasChildren(item) ? renderItems(item.children, level + 1) : null

      if (supportedRoute) {
        return (
          <div key={item.id}>
            <NavLink
              to={supportedRoute}
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  isActive ? 'bg-[#17214a] text-[#7ea1ff]' : 'text-[#969baa] hover:bg-[#211c1f] hover:text-white'
                }`
              }
              style={{ paddingLeft: `${12 + level * 18}px` }}
            >
              <MenuIcon name={item.icon} size={17} />
              <span className="truncate">{item.title}</span>
            </NavLink>
            {childItems}
          </div>
        )
      }

      return (
        <div key={item.id}>
          <button
            type="button"
            onClick={() => (hasChildren(item) ? toggleExpanded(item.id) : undefined)}
            className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-[#969baa] transition hover:bg-[#211c1f] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{ paddingLeft: `${12 + level * 18}px` }}
            disabled={!hasChildren(item)}
            title={hasChildren(item) ? item.title : 'Page is not available in this revamp yet'}
          >
            <MenuIcon name={item.icon} size={17} />
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
            {hasChildren(item) ? (
              <ChevronRight size={15} className={`transition ${expanded ? 'rotate-90' : ''}`} />
            ) : null}
          </button>
          {expanded ? childItems : null}
        </div>
      )
    })

  return <>{renderItems(items)}</>
}

export function Sidebar({ isOpen, onClose }) {
  const { auth, loadMenu, logout, menu } = useAuthContext()
  const userInitial = auth.user?.name?.charAt(0)?.toUpperCase() || auth.user?.email?.charAt(0)?.toUpperCase() || 'A'
  const userName = auth.user?.name ?? 'admin'
  const userEmail = auth.user?.email ?? ''
  const hasMenu = menu.mainMenuItems.length > 0 || menu.bottomMenuItems.length > 0

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[256px] flex-col justify-between border-r border-[#2d282b] bg-[#171314] text-[#969baa] transition-transform md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <div className="flex h-[74px] items-center gap-3 border-b border-[#2d282b] px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white text-orange-600">
              <GalleryVerticalEnd size={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-none text-white">VeltraxCRM</p>
              <p className="mt-1 truncate text-xs text-[#686b77]">Manage everything in one place</p>
            </div>
          </div>

          <nav className="space-y-2 px-3 py-5">
            {menu.status === 'loading' && !hasMenu ? (
              <div className="rounded-lg border border-[#2d282b] px-3 py-4 text-sm font-medium text-[#969baa]">
                Loading menu items...
              </div>
            ) : null}

            {menu.status === 'failed' && !hasMenu ? (
              <div className="space-y-3 rounded-lg border border-red-900/60 bg-red-950/20 px-3 py-4 text-sm text-red-200">
                <p>{menu.error || 'Unable to load menu items.'}</p>
                <button
                  type="button"
                  onClick={() => loadMenu({ force: true }).catch(() => {})}
                  className="inline-flex items-center gap-2 text-xs font-bold text-red-100 hover:text-white"
                >
                  <RefreshCcw size={14} />
                  Retry
                </button>
              </div>
            ) : null}

            {hasMenu ? (
              <>
                <MenuSection items={menu.mainMenuItems} onClose={onClose} />
                {menu.bottomMenuItems.length ? (
                  <div className="pt-4">
                    <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#686b77]">
                      More tools
                    </p>
                    <MenuSection items={menu.bottomMenuItems} onClose={onClose} />
                  </div>
                ) : null}
              </>
            ) : null}
          </nav>
        </div>

        <div className="border-t border-[#2d282b] p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">{userName}</p>
              <p className="truncate text-xs text-[#686b77]">{userEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-red-800/70 text-xs font-semibold text-red-300 transition hover:bg-red-950/30"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
