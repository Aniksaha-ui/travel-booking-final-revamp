export const monthRunningBalanceColumns = [
  { id: 'serial', label: 'SL', width: '7%', className: 'routes-table__muted' },
  {
    id: 'month',
    label: 'Month',
    width: '24%',
    render: (item) => (
      <div className="routes-table__name">
        <span className="routes-table__avatar">{item.month?.charAt(0) ?? 'M'}</span>
        <span className="routes-table__name-text">{item.month}</span>
      </div>
    ),
  },
  { id: 'totalCreditLabel', label: 'Total Credit', width: '17%' },
  { id: 'totalDebitLabel', label: 'Total Debit', width: '17%' },
  { id: 'openingBalanceLabel', label: 'Opening Balance', width: '17%', className: 'routes-table__muted' },
  { id: 'closingBalanceLabel', label: 'Closing Balance', width: '18%', className: 'routes-table__muted' },
]
