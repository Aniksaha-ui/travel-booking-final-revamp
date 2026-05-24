function OverviewCard({ label, value, toneClassName = 'text-white' }) {
  return (
    <article className="rounded-xl border border-[#2d282b] bg-[#171314] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className={`mt-3 text-2xl font-black ${toneClassName}`}>{value}</p>
    </article>
  )
}

export function VisaApplicationsOverview({ metrics, pagination }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <OverviewCard label="Matched Applications" value={pagination.total || metrics.totalCount} toneClassName="text-blue-200" />
      <OverviewCard label="Assigned On This Page" value={metrics.assignedCount} toneClassName="text-cyan-200" />
      <OverviewCard label="Paid On This Page" value={metrics.paidCount} toneClassName="text-emerald-200" />
      <OverviewCard label="In Progress" value={metrics.inProgressCount} toneClassName="text-amber-200" />
    </section>
  )
}
