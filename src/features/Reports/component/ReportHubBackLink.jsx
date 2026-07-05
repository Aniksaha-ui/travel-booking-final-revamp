import { ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../../../constants/routes'

export function ReportHubBackLink() {
  const location = useLocation()
  const reportCategory = location.state?.reportCategory
  const reportHubPath = reportCategory ? `${APP_ROUTES.reports}?category=${reportCategory}` : APP_ROUTES.reports

  return (
    <Link
      to={reportHubPath}
      className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[#2d282b] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7] transition duration-200 hover:border-[#426dff] hover:bg-[#1d181a] hover:text-white"
    >
      <ArrowLeft size={16} />
      <span>{reportCategory ? 'Back to Report List' : 'Back to Reports'}</span>
    </Link>
  )
}
