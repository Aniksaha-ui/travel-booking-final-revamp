import { ClipboardList, MessageSquareText, ReceiptText, RefreshCcw } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { getAssignedPackages } from '../service/guidePackagesService'
import { useGuideCollection } from '../hooks/useGuideCollection'

export default function GuidePackagesPage() {
  const navigate = useNavigate(); const load = useCallback((options) => getAssignedPackages(options), []); const state = useGuideCollection(load, 'Unable to load assigned packages.')
  const columns = [{ id: 'serial', label: 'SL', width: '72px', render: (_, index) => (state.pagination.from || 0) + index + 1 }, { id: 'package', label: 'Assigned Package', width: '42%', render: (row) => <div><p className="font-semibold text-white">{row.package_name || 'Unnamed package'}</p><p className="mt-1 text-xs text-[#8fa0bd]">Trip: {row.trip_name || '-'}</p></div> }, { id: 'trip', label: 'Trip', accessor: 'trip_name', width: '30%' }]
  return <main className="routes-page"><div className="routes-page__inner"><header className="routes-page__header"><div className="routes-page__title"><ClipboardList size={20} color="#4f83ff" /><h1>My Assigned Packages</h1></div><p className="routes-page__subtitle">Review your assigned trips, record expenses, and read traveller feedback from one place.</p></header><AdminDataTable columns={columns} data={state.items} emptyMessage="No packages are assigned to you yet." isLoading={state.isLoading} onPageChange={state.setPage} onSearchChange={(value) => { state.setPage(1); state.setSearch(value) }} pagination={state.pagination} search={state.search} searchPlaceholder="Search package or trip" resultLabel={`${state.pagination.total || state.items.length} assigned packages`} rowActionsWidth="220px" actions={<AdminTableButton onClick={state.refresh}><RefreshCcw size={14} />Refresh</AdminTableButton>} renderRowActions={(row) => <div className="flex gap-2"><button className="refund-action-button" type="button" onClick={() => navigate(`/guide/my-packageCosting/${row.id}`)}><ReceiptText size={14} />Costing</button><button className="routes-icon-button" title="View feedback" type="button" onClick={() => navigate(`/guide/my-feedback/${row.id}`)}><MessageSquareText size={15} /></button></div>} /></div></main>
}
