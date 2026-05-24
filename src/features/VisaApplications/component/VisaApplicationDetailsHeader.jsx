import { ArrowLeft, Printer } from 'lucide-react'
import { VisaApplicationStatusBadge, VisaPaymentStatusBadge } from './StatusBadge.jsx'

export function VisaApplicationDetailsHeader({ application, isPrinting, onBack, onPrint }) {
  return (
    <section className="rounded-xl border border-[#2d282b] bg-[#171314] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#332d30] bg-[#211d20] text-[#c5d9f7]"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7ea1ff]">Visa Application</p>
            <h1 className="mt-1 text-2xl font-black text-white">{application.applicationNoLabel}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <VisaApplicationStatusBadge status={application.statusLabel} />
              <VisaPaymentStatusBadge status={application.paymentStatusLabel} />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#211d20] px-4 text-sm font-semibold text-[#c5d9f7]"
          onClick={onPrint}
          disabled={isPrinting}
        >
          <Printer size={15} />
          <span>{isPrinting ? 'Printing...' : 'Print PDF'}</span>
        </button>
      </div>
    </section>
  )
}
