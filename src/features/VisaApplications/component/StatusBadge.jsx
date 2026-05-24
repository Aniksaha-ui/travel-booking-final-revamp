import {
  getPaymentStatusToneClassName,
  getVisaStatusToneClassName,
} from '../utils/visaApplicationsUtils'

export function VisaApplicationStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-[96px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getVisaStatusToneClassName(
        status,
      )}`}
    >
      {status}
    </span>
  )
}

export function VisaPaymentStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex min-w-[82px] justify-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${getPaymentStatusToneClassName(
        status,
      )}`}
    >
      {status}
    </span>
  )
}
