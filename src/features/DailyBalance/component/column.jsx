export function LedgerColumns() {
  return (
    <tr>
      <th>Date</th>
      <th style={{ textAlign: 'center' }}>Transactions</th>
      <th style={{ textAlign: 'right' }}>Credit</th>
      <th style={{ textAlign: 'right' }}>Debit</th>
      <th style={{ textAlign: 'right' }}>Balance</th>
    </tr>
  )
}

export function HistoryColumns() {
  return (
    <tr>
      <th>Report Name</th>
      <th>Month</th>
      <th>Created At</th>
      <th style={{ textAlign: 'right' }}>Action</th>
    </tr>
  )
}
