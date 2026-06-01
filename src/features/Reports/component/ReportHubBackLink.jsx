import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../../../constants/routes'

export function ReportHubBackLink() {
  return (
    <Link
      to={APP_ROUTES.reports}
      className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[#2d282b] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7] transition duration-200 hover:border-[#426dff] hover:bg-[#1d181a] hover:text-white"
    >
      <ArrowLeft size={16} />
      <span>Back to Reports</span>
    </Link>
  )
}
