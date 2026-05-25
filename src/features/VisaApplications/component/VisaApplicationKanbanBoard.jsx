import {
  BriefcaseBusiness,
  CalendarClock,
  GripVertical,
  KanbanSquare,
  MessageSquareText,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { DashboardSection } from '../../../components/ui/DashboardSection'
import { VisaApplicationStatusBadge, VisaPaymentStatusBadge } from './StatusBadge.jsx'
import { formatVisaStatusLabel } from '../utils/visaApplicationsUtils'

const VISA_BOARD_COLUMNS = [
  {
    key: 'draft',
    title: 'Draft',
    description: 'Cases that have started intake but are not yet ready for live processing.',
    badgeClassName: 'border-slate-500/20 bg-slate-500/10 text-slate-200',
    dotClassName: 'bg-slate-400',
  },
  {
    key: 'submitted',
    title: 'Submitted',
    description: 'Applications officially lodged and waiting for the desk team to take ownership.',
    badgeClassName: 'border-blue-500/20 bg-blue-500/10 text-blue-200',
    dotClassName: 'bg-blue-400',
  },
  {
    key: 'under_review',
    title: 'Under Review',
    description: 'Officer is validating the case, checking data quality, and confirming readiness.',
    badgeClassName: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200',
    dotClassName: 'bg-cyan-400',
  },
  {
    key: 'document_pending',
    title: 'Document Pending',
    description: 'Application is blocked on missing files, corrections, or traveller follow-up.',
    badgeClassName: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
    dotClassName: 'bg-amber-400',
  },
  {
    key: 'processing',
    title: 'Processing',
    description: 'Operations team is actively advancing the case through the visa process.',
    badgeClassName: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-200',
    dotClassName: 'bg-indigo-400',
  },
  {
    key: 'approved',
    title: 'Approved',
    description: 'Application has successfully cleared processing and reached a positive outcome.',
    badgeClassName: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200',
    dotClassName: 'bg-emerald-400',
  },
  {
    key: 'rejected',
    title: 'Rejected',
    description: 'Case was declined, cancelled, or could not move forward as submitted.',
    badgeClassName: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
    dotClassName: 'bg-rose-400',
  },
]

function VisaWorkflowCard({
  application,
  boardStatus,
  disabled,
  isDragging,
  isUpdatingStatus,
  onDragEnd,
  onStartDrag,
}) {
  const summaryText =
    application.adminNote && application.adminNote !== 'No admin note'
      ? application.adminNote
      : application.travelPurpose && application.travelPurpose !== '-'
        ? application.travelPurpose
        : `${application.visaName} / ${application.packageTitle}`

  return (
    <article
      className={`rounded-lg border border-[#332d30] bg-[#171314] p-4 shadow-sm transition ${
        disabled
          ? 'cursor-not-allowed opacity-70'
          : isDragging
            ? 'cursor-grabbing opacity-50 ring-2 ring-blue-400/30'
            : 'cursor-grab hover:border-[#4a4348] hover:bg-[#1d181a] active:cursor-grabbing'
      }`}
      draggable={!disabled}
      onDragEnd={onDragEnd}
      onDragStart={onStartDrag}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase text-[#7ea1ff]">
            #{application.applicationNoLabel}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-white">{application.fullName}</h3>
        </div>
        <GripVertical size={16} className="mt-0.5 shrink-0 text-[#62718c]" />
      </div>

      <p className="mt-3 text-sm leading-6 text-[#b4c5df]">{summaryText}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <VisaApplicationStatusBadge status={formatVisaStatusLabel(boardStatus)} />
        <VisaPaymentStatusBadge status={application.paymentStatusLabel} />
        {isUpdatingStatus ? (
          <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-100">
            Updating...
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 text-xs text-[#8fa0bd]">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness size={14} />
          <span className="truncate">
            {application.countryName} / {application.visaName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserRound size={14} />
          <span className="truncate">{application.assignedOfficerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock size={14} />
          <span>{application.travelDateLabel}</span>
        </div>
        <div className="flex items-start gap-2">
          <MessageSquareText size={14} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">Live status: {application.statusLabel}</span>
        </div>
      </div>
    </article>
  )
}

function VisaWorkflowColumn({
  activeDragId,
  application,
  boardStatus,
  column,
  disabled,
  isUpdatingStatus,
  onDragEnd,
  onDropApplication,
  onStartDrag,
}) {
  const hasCard = boardStatus === column.key

  const handleDrop = async (event) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    await onDropApplication(column.key)
  }

  return (
    <section
      className="flex min-h-[520px] flex-col rounded-lg border border-[#332d30] bg-[#231f21]"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <header className="border-b border-[#2d282b] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${column.dotClassName}`} />
              <h3 className="text-sm font-bold text-white">{column.title}</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#8fa0bd]">{column.description}</p>
          </div>
          <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${column.badgeClassName}`}>
            {hasCard ? 1 : 0}
          </span>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {hasCard ? (
          <VisaWorkflowCard
            application={application}
            boardStatus={boardStatus}
            disabled={disabled}
            isDragging={String(activeDragId) === String(application.id)}
            isUpdatingStatus={isUpdatingStatus}
            onDragEnd={onDragEnd}
            onStartDrag={(event) => onStartDrag(event, application)}
          />
        ) : (
          <button
            type="button"
            className={`flex min-h-[160px] flex-1 items-center justify-center rounded-lg border border-dashed px-5 py-8 text-center text-sm font-medium transition ${
              disabled
                ? 'cursor-not-allowed border-[#2d282b] bg-[#171314] text-[#66758d]'
                : 'border-[#332d30] bg-[#171314] text-[#8fa0bd] hover:border-[#4f83ff] hover:text-white'
            }`}
            disabled={disabled}
            onClick={() => onDropApplication(column.key)}
          >
            Drop the application here or click to move it to {column.title.toLowerCase()}.
          </button>
        )}
      </div>
    </section>
  )
}

export function VisaApplicationKanbanBoard({
  application,
  isUpdatingStatus = false,
  onMoveStatus,
  selectedStatus,
}) {
  const [activeDragId, setActiveDragId] = useState(null)

  const boardStatus = isUpdatingStatus && selectedStatus ? selectedStatus : application.status

  const boardColumns = useMemo(() => VISA_BOARD_COLUMNS, [])

  const handleDropApplication = async (targetColumnKey) => {
    if (isUpdatingStatus || boardStatus === targetColumnKey) {
      setActiveDragId(null)
      return
    }

    await onMoveStatus(targetColumnKey)
    setActiveDragId(null)
  }

  const handleStartDrag = (event, draggedApplication) => {
    if (isUpdatingStatus) {
      event.preventDefault()
      return
    }

    event.dataTransfer.effectAllowed = 'move'
    setActiveDragId(draggedApplication.id)
  }

  return (
    <DashboardSection
      title="Application Workflow"
      icon={<KanbanSquare size={16} className="text-blue-400" />}
      action={
        <div className="flex flex-wrap items-center justify-end gap-2">
          {isUpdatingStatus ? (
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-100">
              Updating: {formatVisaStatusLabel(boardStatus)}
            </span>
          ) : null}
          <span className="rounded-full border border-[#332d30] bg-[#171314] px-2.5 py-1 text-[11px] font-bold text-[#9fb2d0]">
            1 application on board
          </span>
        </div>
      }
      bodyClassName="border-t border-[#2d282b] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 px-1 pb-4">
        <p className="max-w-3xl text-sm leading-6 text-[#8fa0bd]">
          Move the application card between lanes just like the complaint board. Dropping the card
          or clicking a lane updates the visa status immediately through the admin API.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-[1760px] gap-4 xl:grid-cols-7">
          {boardColumns.map((column) => (
            <VisaWorkflowColumn
              key={column.key}
              activeDragId={activeDragId}
              application={application}
              boardStatus={boardStatus}
              column={column}
              disabled={isUpdatingStatus}
              isUpdatingStatus={isUpdatingStatus}
              onDragEnd={() => setActiveDragId(null)}
              onDropApplication={handleDropApplication}
              onStartDrag={handleStartDrag}
            />
          ))}
        </div>
      </div>
    </DashboardSection>
  )
}
