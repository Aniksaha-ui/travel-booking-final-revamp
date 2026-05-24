export const financialReportColumns = [
  { id: 'serial', label: 'SL', width: '7%', className: 'routes-table__muted' },
  {
    id: 'financialYearLabel',
    label: 'Financial Year',
    width: '23%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.yearAvatar}</span>
        <span className="routes-table__name-text">{item.financialYearLabel}</span>
      </div>
    ),
  },
  { id: 'paymentAmountLabel', label: 'Payment Amount', width: '18%' },
  { id: 'refundAmountLabel', label: 'Refund', width: '16%' },
  { id: 'costingAmountLabel', label: 'Costing', width: '16%', className: 'routes-table__muted' },
  { id: 'netAmountLabel', label: 'Net', width: '20%', className: 'routes-table__muted' },
]

