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
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
            Application Workspace
          </p>
          <p className="mt-2 text-sm text-[#9fb2d0]">
            Switch between the live workflow, applicant context, file review, and case activity.
          </p>
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
        className="mt-4 flex gap-3 overflow-x-auto pb-1"
        role="tablist"
      >
        {WORKSPACE_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key

          return (
            <button
              key={tab.key}
              aria-selected={isActive}
              className={`min-w-[220px] flex-1 rounded-[20px] border px-4 py-4 text-left transition ${
                isActive
                  ? 'border-blue-500/35 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(8,47,73,0.35))] text-white shadow-[0_12px_30px_rgba(37,99,235,0.16)]'
                  : 'border-[#332d30] bg-[#201c1e] text-[#c5d9f7] hover:border-[#3f383c] hover:bg-[#262123]'
              }`}
              id={`visa-application-tab-${tab.key}`}
              onClick={() => onChange(tab.key)}
              role="tab"
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    isActive ? 'bg-white/12 text-white' : 'bg-[#171314] text-[#8fa0bd]'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                    isActive
                      ? 'border-white/10 bg-white/10 text-blue-50'
                      : 'border-[#3a3337] bg-[#171314] text-[#8fa0bd]'
                  }`}
                >
                  {buildTabMetaLabel(application, tab.key)}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm font-bold">{tab.label}</p>
                <p className={`mt-1 text-sm ${isActive ? 'text-blue-50/80' : 'text-[#8fa0bd]'}`}>
                  {tab.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>
    </section>
  )
}
