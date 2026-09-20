import { ArrowLeft, MessageSquareText, Star } from 'lucide-react'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminDataTable from '../../../components/ui/AdminDataTable'
import { useGuideCollection } from '../hooks/useGuideCollection'
import { getPackageFeedback } from '../service/guidePackagesService'

export default function GuidePackageFeedbackPage() {
  const { id } = useParams(); const navigate = useNavigate(); const load = useCallback((options) => getPackageFeedback(id, options), [id]); const state = useGuideCollection(load, 'Unable to load package feedback.')
  const columns = [{ id: 'serial', label: 'SL', width: '72px', render: (_, index) => (state.pagination.from || 0) + index + 1 }, { id: 'feedback', label: 'Traveller Feedback', width: '66%', render: (row) => <p className="max-w-xl leading-6 text-white">{row.feedback || 'No comment provided.'}</p> }, { id: 'rating', label: 'Rating', width: '160px', render: (row) => <span className="inline-flex items-center gap-1 font-bold text-amber-200"><Star size={15} fill="currentColor" />{row.rating || 0}/5</span> }]
  return <main className="routes-page"><div className="routes-page__inner"><header className="routes-page__header"><button type="button" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8fa0bd] hover:text-white" onClick={() => navigate('/guide/myAssignPackages')}><ArrowLeft size={16} />Assigned packages</button><div className="routes-page__title"><MessageSquareText size={20} color="#4f83ff" /><h1>Package Feedback</h1></div><p className="routes-page__subtitle">Read traveller ratings and feedback for this assigned package.</p></header><AdminDataTable columns={columns} data={state.items} emptyMessage="No traveller feedback has been submitted yet." isLoading={state.isLoading} onPageChange={state.setPage} onSearchChange={(value) => { state.setPage(1); state.setSearch(value) }} pagination={state.pagination} search={state.search} searchPlaceholder="Search feedback" resultLabel={`${state.pagination.total || state.items.length} feedback entries`} /></div></main>
}
