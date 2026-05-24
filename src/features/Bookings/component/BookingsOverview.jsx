import { CalendarClock, CheckCircle2, Ticket, UsersRound } from 'lucide-react'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { DashboardSection } from '../../../components/ui/DashboardSection'

export function BookingsOverview({ isLoading, summary }) {
  const metricItems = [
    {
      icon: Ticket,
      label: 'Bookings on Page',
      tone: 'blue',
      value: summary.totalBookingsLabel,
    },
    {
      icon: UsersRound,
      label: 'Customers',
      tone: 'emerald',
      value: summary.totalCustomersLabel,
    },
    {
      icon: CalendarClock,
      label: 'Assigned Seats',
      tone: 'cyan',
      value: summary.totalSeatsLabel,
    },
    {
      icon: CheckCircle2,
      label: 'Confirmed',
      tone: 'amber',
      value: summary.confirmedBookingsLabel,
    },
  ]

  return (
    <>
      <section className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {metricItems.map((item) => (
          <DashboardMetricCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            tone={item.tone}
            value={isLoading ? '...' : item.value}
          />
        ))}
      </section>

      <DashboardSection
        className="mb-6"
        title="Booking Mix on Current Page"
        icon={<Ticket size={16} className="text-blue-400" />}
        action={
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-200">
            Top Type: {isLoading ? 'Loading...' : summary.topTypeLabel}
          </span>
        }
        bodyClassName="border-t border-[#2d282b] p-5"
      >
        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            Loading booking overview...
          </div>
        ) : summary.totalBookings ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="space-y-4">
              {summary.typeBreakdown.map((item) => (
                <article key={item.key} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-[#c5d9f7]">{item.totalLabel}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#231f21]">
                    <div className="h-2 rounded-full" style={{ backgroundColor: item.color, width: item.width }} />
                  </div>
                </article>
              ))}
            </div>

            <div className="space-y-4">
              <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8fa0bd]">
                  Latest Booking
                </span>
                <p className="mt-3 text-lg font-bold text-white">{summary.latestBookingLabel}</p>
              </article>

              <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8fa0bd]">
                  Payment Status Snapshot
                </span>
                <div className="mt-4 grid gap-3">
                  {summary.statusBreakdown.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg bg-[#221e20] px-3 py-2.5">
                      <span className="text-sm font-semibold text-white">{item.label}</span>
                      <span className="text-sm font-bold text-[#c5d9f7]">{item.totalLabel}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[240px] items-center justify-center text-sm font-semibold text-[#8fa0bd]">
            No bookings found for the current selection.
          </div>
        )}
      </DashboardSection>
    </>
  )
}
