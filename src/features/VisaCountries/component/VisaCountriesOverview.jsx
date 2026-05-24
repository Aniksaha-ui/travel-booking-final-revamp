function InsightCard({ label, value, toneClassName = 'text-white' }) {
  return (
    <article className="rounded-xl border border-[#2d282b] bg-[#171314] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className={`mt-3 text-2xl font-black ${toneClassName}`}>{value}</p>
    </article>
  )
}

export function VisaCountriesOverview({ metrics, pagination }) {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <InsightCard label="Matched Countries" value={pagination.total || metrics.totalCount} toneClassName="text-blue-200" />
      <InsightCard label="Active On This Page" value={metrics.activeCount} toneClassName="text-emerald-200" />
      <InsightCard label="Popular On This Page" value={metrics.popularCount} toneClassName="text-cyan-200" />
      <InsightCard label="Nationalities Covered" value={metrics.nationalityCount} toneClassName="text-amber-200" />
    </section>
  )
}
