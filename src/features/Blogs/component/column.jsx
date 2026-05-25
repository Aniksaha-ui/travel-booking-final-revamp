import { BLOGS_EMPTY_STATE } from '../constants/blogs.constants'
import { formatBlogStatusLabel, getBlogStatusToneClassName } from '../utils/blogsUtils'

const renderCover = (blog) => {
  if (!blog.coverImage) {
    return (
      <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-dashed border-[#40383d] bg-[#211d20] text-[11px] font-semibold text-[#7d8ca5]">
        No cover
      </div>
    )
  }

  return (
    <div className="h-14 w-20 overflow-hidden rounded-xl border border-[#332d30] bg-[#211d20]">
      <img
        alt={blog.title}
        className="h-full w-full object-cover"
        loading="lazy"
        src={blog.coverImage}
      />
    </div>
  )
}

export const blogColumns = [
  {
    id: 'coverImage',
    label: 'Cover',
    render: renderCover,
    sortable: false,
    width: '108px',
  },
  {
    accessor: 'title',
    id: 'title',
    label: 'Title',
    render: (blog) => (
      <div className="space-y-1">
        <div className="font-semibold text-white">{blog.title}</div>
        <div className="text-xs text-[#7d8ca5]">{blog.slug || BLOGS_EMPTY_STATE.noSlug}</div>
        <div className="line-clamp-2 text-xs leading-5 text-[#9fb2d0]">{blog.metaDescription}</div>
      </div>
    ),
    width: '34%',
  },
  {
    accessor: 'author',
    id: 'author',
    label: 'Author',
    render: (blog) => <span className="text-sm text-[#dbe7fb]">{blog.author}</span>,
    width: '15%',
  },
  {
    accessor: 'publishDateLabel',
    id: 'publishDate',
    label: 'Publish Date',
    render: (blog) => <span className="text-sm text-[#c5d9f7]">{blog.publishDateLabel}</span>,
    width: '14%',
  },
  {
    accessor: 'componentCountLabel',
    id: 'componentCount',
    label: 'Builder Blocks',
    render: (blog) => <span className="text-sm text-[#9fb2d0]">{blog.componentCountLabel}</span>,
    width: '12%',
  },
  {
    accessor: 'status',
    id: 'status',
    label: 'Status',
    render: (blog) => (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBlogStatusToneClassName(
          blog.status,
        )}`}
      >
        {formatBlogStatusLabel(blog.status)}
      </span>
    ),
    width: '12%',
  },
]

