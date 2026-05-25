import { VISA_APPLICATIONS_EMPTY_STATE } from '../constants/visaApplications.constants'

export function VisaApplicationStatusLogsPanel({ statusLogs }) {
  return (
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <header className="flex flex-col gap-3 border-b border-[#2d282b] px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Status Timeline</h2>
          <p className="mt-2 text-sm text-[#8fa0bd]">
            Follow every application transition with who changed it, when it moved, and the note
            left behind.
          </p>
        </div>

        <span className="inline-flex items-center self-start rounded-full border border-[#3a3337] bg-[#211d20] px-3 py-1 text-xs font-semibold text-[#c5d9f7]">
          {statusLogs.length} updates
        </span>
      </header>

      <div className="overflow-x-auto p-5">
        <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-xl border border-[#2d282b] bg-[#100d0e]">
          <thead>
            <tr className="bg-[#171314] text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Changed By</th>
              <th className="px-4 py-3">Transition</th>
              <th className="px-4 py-3">Note</th>
            </tr>
          </thead>
          <tbody>
            {statusLogs.length ? (
              statusLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-[#2d282b] text-sm text-slate-200 transition hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-4">{log.createdAtLabel}</td>
                  <td className="px-4 py-4">{log.changedByName}</td>
                  <td className="px-4 py-4">
                    <span className="text-[#8fa0bd]">{log.oldStatusLabel}</span> {' -> '}
                    <span className="font-semibold text-white">{log.newStatusLabel}</span>
                  </td>
                  <td className="px-4 py-4">{log.note}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#8fa0bd]">
                  {VISA_APPLICATIONS_EMPTY_STATE.noLogs}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
