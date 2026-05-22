import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Search,
} from 'lucide-react'

const getDefaultVisibleColumnIds = (columns) =>
  columns.filter((column) => column.defaultHidden !== true).map((column) => column.id)

function SortIcon() {
  return <span aria-hidden="true"> ^</span>
}

function ColumnsDropdown({ columns, visibleColumnIds, onToggleColumn, onResetColumns }) {
  return (
    <div className="routes-columns-menu">
      <div className="routes-columns-menu__header">
        <span>Columns</span>
        <button type="button" onClick={onResetColumns}>
          Reset
        </button>
      </div>
      <div className="routes-columns-menu__body">
        {columns.map((column) => (
          <label key={column.id} className="routes-columns-menu__option">
            <input
              type="checkbox"
              checked={visibleColumnIds.includes(column.id)}
              onChange={() => onToggleColumn(column.id)}
            />
            <span>{column.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function AdminTableButton({ children, count, variant = 'default', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`routes-control ${variant === 'blue' ? 'routes-control--blue' : ''} ${className}`}
      {...props}
    >
      {children}
      {count ? <span className="routes-control__count">{count}</span> : null}
    </button>
  )
}

export function AdminTableSelectButton({ children }) {
  return (
    <AdminTableButton>
      {children}
      <ChevronDown size={13} />
    </AdminTableButton>
  )
}

export default function AdminDataTable({
  actions,
  columns,
  data,
  emptyMessage = 'No data found',
  filters,
  getRowKey = (row) => row.id,
  renderRowActions,
  resultLabel,
  searchPlaceholder = 'Search',
}) {
  const columnsMenuRef = useRef(null)
  const defaultVisibleColumnIds = useMemo(() => getDefaultVisibleColumnIds(columns), [columns])
  const [visibleColumnIds, setVisibleColumnIds] = useState(defaultVisibleColumnIds)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const visibleColumns = useMemo(
    () => columns.filter((column) => visibleColumnIds.includes(column.id)),
    [columns, visibleColumnIds],
  )

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target)) {
        setColumnsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const toggleColumn = (columnId) => {
    setVisibleColumnIds((currentColumnIds) => {
      if (currentColumnIds.includes(columnId)) {
        if (currentColumnIds.length === 1) {
          return currentColumnIds
        }

        return currentColumnIds.filter((currentColumnId) => currentColumnId !== columnId)
      }

      return columns
        .map((column) => column.id)
        .filter((defaultColumnId) => defaultColumnId === columnId || currentColumnIds.includes(defaultColumnId))
    })
  }

  return (
    <section className="routes-table-card">
      <div className="routes-table-toolbar">
        <label className="routes-search">
          <Search size={15} />
          <input type="search" placeholder={searchPlaceholder} />
        </label>

        <div className="routes-columns" ref={columnsMenuRef}>
          <button type="button" className="routes-control" onClick={() => setColumnsOpen((open) => !open)}>
            <Columns3 size={14} />
            Columns
            <span className="routes-control__count">{visibleColumnIds.length}</span>
          </button>
          {columnsOpen ? (
            <ColumnsDropdown
              columns={columns}
              visibleColumnIds={visibleColumnIds}
              onToggleColumn={toggleColumn}
              onResetColumns={() => setVisibleColumnIds(defaultVisibleColumnIds)}
            />
          ) : null}
        </div>

        {filters}
        {actions}
      </div>

      <table className="routes-table">
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <th key={column.id} style={{ width: column.width, textAlign: column.align }}>
                {column.label} {column.sortable === false ? null : <SortIcon />}
              </th>
            ))}
            {renderRowActions ? <th style={{ width: '5%', textAlign: 'right' }}>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((row) => (
              <tr key={getRowKey(row)}>
                {visibleColumns.map((column) => (
                  <td key={column.id} className={column.className}>
                    {column.render ? column.render(row) : row[column.accessor ?? column.id]}
                  </td>
                ))}
                {renderRowActions ? <td>{renderRowActions(row)}</td> : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={visibleColumns.length + (renderRowActions ? 1 : 0)} className="routes-table__empty">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="routes-table-footer">
        <p>{resultLabel ?? `Showing ${data.length} result's`}</p>
        <div className="routes-pagination">
          <button type="button">
            <ChevronLeft size={14} />
            Previous
          </button>
          <button type="button">
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}
