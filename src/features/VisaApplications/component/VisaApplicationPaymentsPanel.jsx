import { VISA_APPLICATIONS_EMPTY_STATE } from '../constants/visaApplications.constants'
import { VisaPaymentStatusBadge } from './StatusBadge.jsx'

export function VisaApplicationPaymentsPanel({ payments }) {
  return (
    <section className="rounded-xl border border-[#2d282b] bg-[#171314] shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">Payments</h2>
      </header>

      <div className="overflow-x-auto p-5">
        <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-xl border border-[#2d282b] bg-[#100d0e]">
          <thead>
            <tr className="bg-[#171314] text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length ? (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t border-[#2d282b] text-sm text-slate-200">
                  <td className="px-4 py-4 font-semibold text-white">{payment.amountLabel}</td>
                  <td className="px-4 py-4">{payment.methodLabel}</td>
                  <td className="px-4 py-4">{payment.referenceLabel}</td>
                  <td className="px-4 py-4">
                    <VisaPaymentStatusBadge status={payment.statusLabel} />
                  </td>
                  <td className="px-4 py-4">{payment.createdAtLabel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#8fa0bd]">
                  {VISA_APPLICATIONS_EMPTY_STATE.noPayments}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
