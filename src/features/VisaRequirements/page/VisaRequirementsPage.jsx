import { ClipboardList, Pencil, Plus, RefreshCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { APP_ROUTES } from '../../../constants/routes'
import { visaRequirementsColumns } from '../component/column.jsx'
import useVisaRequirements from '../hooks/useVisaRequirements'

export default function VisaRequirementsPage() {
  const navigate = useNavigate()
  const apiState = useVisaRequirements()
  const resultLabel = useMemo(() => {
    if (!apiState.items.length) return 'No visa requirements found.'
    const { from, to, total } = apiState.pagination
    return `Showing ${from || 1}-${to || apiState.items.length} of ${total || apiState.items.length} requirements`
  }, [apiState.items.length, apiState.pagination])

  return <main className="routes-page"><div className="routes-page__inner">
    <header className="routes-page__header"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="routes-page__title"><ClipboardList size={20} color="#4f83ff" /><h1>Visa Requirements</h1></div><p className="routes-page__subtitle">Define the documents each visa type requires, their upload rules, and display order.</p></div><button className="routes-new-button" type="button" onClick={() => navigate(`${APP_ROUTES.visaRequirements}/add`)}><Plus size={15} />Add New</button></div></header>
    <AdminDataTable actions={<><AdminTableButton disabled={apiState.isLoading} onClick={() => apiState.refresh()}><RefreshCcw size={14} />Refresh</AdminTableButton><button className="routes-new-button" type="button" onClick={() => navigate(`${APP_ROUTES.visaRequirements}/add`)}><Plus size={15} />Add New</button></>} columns={visaRequirementsColumns} data={apiState.items} emptyMessage="No visa requirements found." isLoading={apiState.isLoading} onPageChange={apiState.setPage} onSearchChange={(value) => { apiState.setPage(1); apiState.setSearch(value) }} pagination={apiState.pagination} renderRowActions={(row) => <button type="button" className="routes-icon-button" aria-label={`Edit ${row.documentName}`} onClick={() => navigate(`${APP_ROUTES.visaRequirements}/update/${row.id}`)}><Pencil size={15} /></button>} resultLabel={resultLabel} rowActionsWidth="72px" search={apiState.search} searchPlaceholder="Search documents, countries, or visa types" />
  </div></main>
}
