import { FileText, Pencil, Plus, RefreshCcw, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import AdminDataTable, { AdminTableButton } from '../../../components/ui/AdminDataTable'
import { APP_ROUTES } from '../../../constants/routes'
import { BlogsOverview } from '../component/BlogsOverview.jsx'
import { blogColumns } from '../component/column.jsx'
import { BLOGS_PAGE_COPY } from '../constants/blogs.constants'
import useBlogs from '../hooks/useBlogs'
import { deleteBlog } from '../service/blogsService'
import { buildBlogMetrics } from '../utils/blogsUtils'

export default function BlogsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const apiState = useBlogs()
  const [activeDeleteId, setActiveDeleteId] = useState(null)
  const metrics = useMemo(() => buildBlogMetrics(apiState.items), [apiState.items])

  const resultLabel = useMemo(() => {
    if (!apiState.pagination.total && !apiState.items.length) {
      return 'No blogs found.'
    }

    const rangeLabel =
      apiState.pagination.from && apiState.pagination.to
        ? `${apiState.pagination.from}-${apiState.pagination.to}`
        : `${apiState.items.length}`

    return `Showing ${rangeLabel} of ${apiState.pagination.total || apiState.items.length} blog posts`
  }, [apiState.items.length, apiState.pagination.from, apiState.pagination.to, apiState.pagination.total])

  const handleDelete = async (blog) => {
    const shouldDelete = window.confirm(`Delete "${blog.title}"? This action cannot be undone.`)

    if (!shouldDelete) {
      return
    }

    try {
      setActiveDeleteId(blog.id)
      await deleteBlog(blog.id)
      toast.success('Blog deleted successfully.')

      const isLastItemOnPage = apiState.items.length === 1 && apiState.page > 1
      const nextPage = isLastItemOnPage ? apiState.page - 1 : apiState.page

      if (nextPage !== apiState.page) {
        apiState.setPage(nextPage)
      } else {
        await apiState.refresh()
      }
    } catch (error) {
      toast.error(error.message || 'Unable to delete blog.')
    } finally {
      setActiveDeleteId(null)
    }
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner">
        <header className="routes-page__header">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="routes-page__title">
                <FileText size={20} color="#4f83ff" />
                <h1>{BLOGS_PAGE_COPY.title}</h1>
              </div>
              <p className="routes-page__subtitle">{BLOGS_PAGE_COPY.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
                <FileText size={16} />
                <span>{apiState.pagination.total || apiState.items.length} matched posts</span>
              </div>

              <button
                type="button"
                className="routes-new-button"
                onClick={() => navigate('/admin/blog/add')}
              >
                <Plus size={15} />
                {BLOGS_PAGE_COPY.newButtonLabel}
              </button>
            </div>
          </div>
        </header>

        <BlogsOverview isLoading={apiState.isLoading} metrics={metrics} />
        {apiState.error ? <p className="month-balance-alert">{apiState.error}</p> : null}

        <AdminDataTable
          actions={
            <>
              <AdminTableButton
                className={apiState.isLoading ? 'opacity-60' : ''}
                disabled={apiState.isLoading}
                onClick={() => apiState.refresh()}
              >
                <RefreshCcw size={14} />
                Refresh
              </AdminTableButton>
              <button
                type="button"
                className="routes-new-button"
                onClick={() => navigate('/admin/blog/add')}
              >
                <Plus size={15} />
                {BLOGS_PAGE_COPY.newButtonLabel}
              </button>
            </>
          }
          columns={blogColumns}
          data={apiState.items}
          emptyMessage="No blogs found."
          isLoading={apiState.isLoading}
          onPageChange={apiState.setPage}
          onSearchChange={(value) => {
            apiState.setPage(1)
            apiState.setSearch(value)
          }}
          pagination={apiState.pagination}
          renderRowActions={(blog) => (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#332d30] bg-[#211d20] px-2.5 text-xs font-semibold text-[#dbe7fb] transition hover:bg-white/5"
                onClick={() => navigate(`/admin/blog/update/${blog.id}`)}
              >
                <Pencil size={13} />
                Edit
              </button>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={activeDeleteId === blog.id}
                onClick={() => handleDelete(blog)}
              >
                <Trash2 size={13} />
                {activeDeleteId === blog.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
          resultLabel={resultLabel}
          rowActionsWidth="194px"
          search={apiState.search}
          searchPlaceholder={BLOGS_PAGE_COPY.searchPlaceholder}
        />
      </div>
    </main>
  )
}

