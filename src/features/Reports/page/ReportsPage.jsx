import { ArrowRight, BarChart3, FolderKanban } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  buildFallbackReportMenuItems,
  REPORT_CATALOG_BY_PATH,
} from '../../../constants/reportCatalog'
import { APP_ROUTES } from '../../../constants/routes'
import { useAuthContext } from '../../../contexts/AuthContext'
import { getSupportedRoute } from '../../menu/utils/menuHelpers'

const flattenReportItems = (items = []) => {
  const flattenedItems = []

  items.forEach((item) => {
    flattenedItems.push(item)
    flattenedItems.push(...flattenReportItems(item.children ?? []))
    flattenedItems.push(...flattenReportItems(item.reportChildren ?? []))
  })

  return flattenedItems
}

const buildReportCards = (items = []) => {
  const reportsByRoute = new Map()
  const availableItems = [...flattenReportItems(items), ...buildFallbackReportMenuItems()]

  availableItems.forEach((item) => {
    const supportedRoute = getSupportedRoute(item.path)

    if (!supportedRoute || supportedRoute === APP_ROUTES.reports) {
      return
    }

    const catalogItem = REPORT_CATALOG_BY_PATH[supportedRoute]

    if (reportsByRoute.has(supportedRoute)) {
      return
    }

    reportsByRoute.set(supportedRoute, {
      description: catalogItem?.description ?? 'Open this report to review its latest data.',
      order: Number(item.order ?? catalogItem?.order ?? 9999),
      path: supportedRoute,
      title: item.title ?? catalogItem?.title ?? 'Untitled Report',
    })
  })

  return [...reportsByRoute.values()].sort((firstItem, secondItem) => firstItem.order - secondItem.order)
}

export default function ReportsPage() {
  const { menu } = useAuthContext()

  const reportCards = useMemo(() => {
    const reportHubItem = [...menu.mainMenuItems, ...menu.bottomMenuItems].find(
      (item) => getSupportedRoute(item.path) === APP_ROUTES.reports,
    )

    return buildReportCards(reportHubItem?.reportChildren ?? [])
  }, [menu.bottomMenuItems, menu.mainMenuItems])

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header rounded-[28px] border border-[#2d282b] bg-[#171314] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <FolderKanban size={20} color="#4f83ff" />
                <h1>Reports</h1>
              </div>
              <p className="routes-page__subtitle">
                Open any report from here. The sidebar stays as a single report menu item, and each report opens on
                demand.
              </p>
            </div>

            <div className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#2d282b] bg-[#100d0e] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BarChart3 size={16} />
              <span>{reportCards.length} reports</span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reportCards.map((report) => (
            <Link
              key={report.path}
              to={report.path}
              className="group rounded-[24px] border border-[#2d282b] bg-[#171314] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition duration-200 hover:-translate-y-1 hover:border-[#426dff] hover:bg-[#1d181a]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2f2a2d] bg-[#211d20] text-[#7ea1ff]">
                  <BarChart3 size={20} />
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 text-[#6d7486] transition group-hover:translate-x-1 group-hover:text-white"
                />
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">{report.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#8fa0bd]">{report.description}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#7ea1ff]">Open report</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
