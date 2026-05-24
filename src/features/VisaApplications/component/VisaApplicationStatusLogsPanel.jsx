import { VISA_APPLICATIONS_EMPTY_STATE } from '../constants/visaApplications.constants'

export function VisaApplicationStatusLogsPanel({ statusLogs }) {
  return (
    <section className="rounded-xl border border-[#2d282b] bg-[#171314] shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">Status Timeline</h2>
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
                <tr key={log.id} className="border-t border-[#2d282b] text-sm text-slate-200">
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
