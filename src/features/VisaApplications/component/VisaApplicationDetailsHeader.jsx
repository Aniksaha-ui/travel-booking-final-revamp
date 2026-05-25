import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  KanbanSquare,
  Printer,
  UserRound,
} from 'lucide-react'
import { VisaApplicationStatusBadge, VisaPaymentStatusBadge } from './StatusBadge.jsx'

export function VisaApplicationDetailsHeader({ application, isPrinting, onBack, onPrint }) {
  const summaryItems = [
    {
      label: 'Applicant',
      value: application.fullName,
      helper: application.applicantEmail,
      icon: UserRound,
    },
    {
      label: 'Destination',
      value: application.countryName,
      helper: `${application.visaName} / ${application.packageTitle}`,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Current Owner',
      value: application.assignedOfficerName,
      helper: application.userName,
      icon: KanbanSquare,
    },
    {
      label: 'Travel Date',
      value: application.travelDateLabel,
      helper: application.appliedAtLabel,
      icon: CalendarClock,
    },
  ]

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-[#2d282b] bg-[#171314] shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_28%)]" />

      <div className="relative p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#332d30] bg-[#211d20] text-[#c5d9f7] shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
                Visa Application
              </p>
              <h1 className="mt-2 text-2xl font-black text-white lg:text-[30px]">
                {application.applicationNoLabel}
              </h1>
              <p className="mt-2 text-sm text-[#9fb2d0]">
                {application.fullName} is travelling to {application.countryName} under{' '}
                {application.packageTitle}.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#332d30] bg-[#211d20] px-4 text-sm font-semibold text-[#c5d9f7] shadow-[0_10px_24px_rgba(0,0,0,0.16)]"
            onClick={onPrint}
            disabled={isPrinting}
          >
            <Printer size={15} />
            <span>{isPrinting ? 'Printing...' : 'Print PDF'}</span>
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <VisaApplicationStatusBadge status={application.statusLabel} />
          <VisaPaymentStatusBadge status={application.paymentStatusLabel} />
          <span className="inline-flex rounded-full border border-[#36558f] bg-[#1a2844] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#c5d9f7]">
            {application.visaName}
          </span>
          <span className="inline-flex rounded-full border border-[#3a3337] bg-[#211d20] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
            Fee: {application.feeSnapshotLabel}
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.label}
                className="rounded-[20px] border border-[#332d30] bg-[#1d191b]/90 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)]"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon size={17} />
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
                    {item.label}
                  </p>
                </div>

                <p className="mt-4 text-sm font-bold text-white">{item.value}</p>
                <p className="mt-1 text-xs text-[#8fa0bd]">{item.helper}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
