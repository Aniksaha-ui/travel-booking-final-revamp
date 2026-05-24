import { ReceiptText, X } from 'lucide-react'

function DetailField({ label, value }) {
  return (
    <div className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

export function TransactionDetailsModal({ onClose, transaction }) {
  if (!transaction) {
    return null
  }

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close transaction details" onClick={onClose} />
      <section className="crud-modal__panel" style={{ width: 'min(1040px, 100%)' }}>
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Transaction Details</p>
            <h2>{transaction.transactionIdLabel}</h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex min-w-[96px] justify-center rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${transaction.paymentMethodToneClassName}`}
            >
              {transaction.paymentMethodLabel}
            </span>
            <button type="button" aria-label="Close transaction details" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
        </header>

        <div className="max-h-[72vh] overflow-y-auto p-5">
          <section className="mb-5 grid gap-3 md:grid-cols-3">
            <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Transaction Amount</p>
              <p className="mt-2 text-lg font-bold text-white">{transaction.amountLabel}</p>
            </article>
            <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Settled Amount</p>
              <p className="mt-2 text-lg font-bold text-emerald-300">{transaction.settledAmountLabel}</p>
            </article>
            <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Customer Paid</p>
              <p className="mt-2 text-lg font-bold text-cyan-300">{transaction.customerPaidAmountLabel}</p>
            </article>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                <header className="flex h-[50px] items-center gap-2 border-b border-[#2d282b] px-5">
                  <ReceiptText size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Core Details</h3>
                </header>
                <div className="grid gap-3 p-4 md:grid-cols-2">
                  <DetailField label="Date" value={transaction.transactionDateTimeLabel} />
                  <DetailField label="Transaction ID" value={transaction.transactionIdLabel} />
                  <DetailField label="Payment ID" value={transaction.paymentIdLabel} />
                  <DetailField label="Booking ID" value={transaction.bookingIdLabel} />
                  <DetailField label="Reference" value={transaction.transactionReference} />
                  <DetailField label="Purpose" value={transaction.purposeLabel} />
                </div>
              </div>

              <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                <header className="flex h-[50px] items-center border-b border-[#2d282b] px-5">
                  <h3 className="text-sm font-bold text-white">Customer Details</h3>
                </header>
                <div className="grid gap-3 p-4 md:grid-cols-2">
                  <DetailField label="Customer Name" value={transaction.customerName} />
                  <DetailField label="Customer Email" value={transaction.customerEmail} />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                <header className="flex h-[50px] items-center border-b border-[#2d282b] px-5">
                  <h3 className="text-sm font-bold text-white">Bank & Card</h3>
                </header>
                <div className="grid gap-3 p-4">
                  <DetailField label="Bank Transaction ID" value={transaction.bankTransactionId} />
                  <DetailField label="Bank Approval ID" value={transaction.bankApprovalId} />
                  <DetailField label="Card Type" value={transaction.cardType} />
                  <DetailField label="Card Brand" value={transaction.cardBrand} />
                </div>
              </div>

              <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                <header className="flex h-[50px] items-center border-b border-[#2d282b] px-5">
                  <h3 className="text-sm font-bold text-white">Risk & Settlement</h3>
                </header>
                <div className="grid gap-3 p-4">
                  <DetailField label="Risk Title" value={transaction.riskTitle} />
                  <div className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
                      Settlement Status
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${transaction.settlementStatusToneClassName}`}
                      >
                        {transaction.settlementStatusLabel}
                      </span>
                    </div>
                  </div>
                  <DetailField label="Settled Amount" value={transaction.settledAmountLabel} />
                  <DetailField label="Customer Paid Amount" value={transaction.customerPaidAmountLabel} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

