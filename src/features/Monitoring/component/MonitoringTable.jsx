import { DashboardSection } from '../../../components/ui/DashboardSection'

function EmptyRows({ colSpan, message }) {
  return (
    <tr>
      <td colSpan={colSpan} className="routes-table__empty">
        {message}
      </td>
    </tr>
  )
}

export function MonitoringTable({ columns, emptyMessage = 'No records found.', getRowClassName, icon, rows, title }) {
  return (
    <DashboardSection
      className="mb-5 overflow-hidden"
      title={title}
      icon={icon}
      bodyClassName="border-t border-[#2d282b]"
    >
      <div className="monitoring-table-wrap">
        <table className="monitoring-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={row.id ?? index} className={getRowClassName?.(row)}>
                  {columns.map((column) => (
                    <td key={column.id} data-label={column.label} className={column.className}>
                      {column.render ? column.render(row) : row[column.accessor ?? column.id]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <EmptyRows colSpan={columns.length} message={emptyMessage} />
            )}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  )
}
