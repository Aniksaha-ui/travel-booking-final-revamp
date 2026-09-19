import { Boxes, BriefcaseBusiness, ClipboardList, KanbanSquare } from 'lucide-react'
import {
  formatVisaStatusLabel,
  getVisaStatusToneClassName,
} from '../utils/visaApplicationsUtils'

const WORKSPACE_TABS = [
  {
    key: 'workflow',
    label: 'Workflow',
    description: 'Board and action controls',
    icon: KanbanSquare,
  },
  {
    key: 'overview',
    label: 'Overview',
    description: 'Applicant and trip snapshot',
    icon: ClipboardList,
  },
  {
    key: 'documents',
    label: 'Documents',
    description: 'Uploads and verification',
    icon: Boxes,
  },
  {
    key: 'activity',
    label: 'Activity',
    description: 'Timeline and payments',
    icon: BriefcaseBusiness,
  },
]

const buildTabMetaLabel = (application, key) => {
  switch (key) {
    case 'workflow':
      return application.statusLabel
    case 'overview':
      return application.countryName
    case 'documents':
      return `${application.documents.length} uploaded`
    case 'activity':
      return `${application.statusLogs.length + application.payments.length} records`
    default:
      return ''
  }
}

export function VisaApplicationWorkspaceTabs({
  activeTab,
  application,
  onChange,
  selectedStatus,
}) {
  const hasStagedStatus = selectedStatus && selectedStatus !== application.status

  return (
    <section className="rounded-2xl border border-[#2d282b] bg-[#171314] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold text-white">Case workspace</p>
          <p className="mt-1 text-sm text-[#8fa0bd]">Review the applicant, documents, case actions, and history in order.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 ${getVisaStatusToneClassName(
              application.status,
            )}`}
          >
            Current: {application.statusLabel}
          </span>
          {hasStagedStatus ? (
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 ${getVisaStatusToneClassName(
                selectedStatus,
              )}`}
            >
              Staged: {formatVisaStatusLabel(selectedStatus)}
            </span>
          ) : null}
        </div>
      </div>

      <nav
        aria-label="Visa application detail sections"
        className="mt-4 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
      >
        {WORKSPACE_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              aria-selected={isActive}
              className={`inline-flex min-w-max items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition ${
                isActive
                  ? 'border-blue-500/35 bg-blue-500/15 text-white'
                  : 'border-[#332d30] bg-[#201c1e] text-[#c5d9f7] hover:border-[#3f383c] hover:bg-[#262123]'
              }`}
              id={`visa-application-tab-${tab.key}`}
              onClick={() => onChange(tab.key)}
              role="tab"
              type="button"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white/12 text-white' : 'bg-[#171314] text-[#8fa0bd]'}`}><Icon size={16} /></span>
              <span><span className="block text-sm font-bold">{tab.label}</span><span className="block text-xs text-[#8fa0bd]">{buildTabMetaLabel(application, tab.key)}</span></span>
            </button>
          )
        })}
      </nav>
    </section>
  )
}
