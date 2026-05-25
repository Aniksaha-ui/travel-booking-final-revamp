export const onlinePaymentConfigColumns = [
  {
    id: 'id',
    label: 'Config ID',
    render: (configuration) => <span className="font-semibold text-white">#{configuration.id}</span>,
    width: '120px',
  },
  {
    id: 'paymentForLabel',
    label: 'Payment For',
    render: (configuration) => (
      <div className="space-y-1">
        <p className="font-semibold text-white">{configuration.paymentForLabel}</p>
        <p className="text-xs text-[#7d8ca5]">{configuration.statusDescription}</p>
      </div>
    ),
    width: '40%',
  },
  {
    id: 'statusLabel',
    label: 'Online Payment',
    render: (configuration) => (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${configuration.statusToneClassName}`}
      >
        {configuration.statusLabel}
      </span>
    ),
    width: '18%',
  },
]

