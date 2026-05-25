import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarClock,
  FileText,
  GripVertical,
  Laptop,
  Plus,
  Save,
  Smartphone,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import { APP_ROUTES } from '../../../constants/routes'
import {
  BLOG_COMPONENT_TYPES,
  BLOG_STATUS_OPTIONS,
} from '../constants/blogs.constants'
import {
  createBlog,
  getBlogDetails,
  updateBlog,
} from '../service/blogsService'
import {
  buildBlogFormState,
  buildBlogPayload,
  createEmptyBlogComponent,
  formatBlogStatusLabel,
  generateBlogHtml,
  getBlogStatusToneClassName,
  slugifyBlogTitle,
} from '../utils/blogsUtils'

function SectionCard({ children, description, title }) {
  return (
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#8fa0bd]">{description}</p>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

function AlignmentButton({ active, children, onClick, title }) {
  return (
    <button
      type="button"
      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
        active
          ? 'border-blue-500/30 bg-blue-500/15 text-blue-50'
          : 'border-[#352f32] bg-[#211d20] text-[#8fa0bd] hover:border-[#40506e] hover:text-white'
      }`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

function ComponentEditor({ component, index, isDragging, onChangeContent, onChangeSetting, onMove, onRemove }) {
  return (
    <article
      className={`rounded-[22px] border bg-[#141113] shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition ${
        isDragging ? 'border-blue-500/35 opacity-60' : 'border-[#2f2a2d]'
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2b2528] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#352f32] bg-[#211d20] text-sm font-bold text-[#dbeafe]">
            {BLOG_COMPONENT_TYPES.find((type) => type.id === component.type)?.icon ?? 'P'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {BLOG_COMPONENT_TYPES.find((type) => type.id === component.type)?.label ?? 'Block'}
            </p>
            <p className="text-xs text-[#7283a0]">Block {index + 1}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#352f32] bg-[#211d20] px-3 text-xs font-semibold text-[#9fb2d0]">
            <GripVertical size={14} />
            Drag
          </span>

          <div className="flex items-center gap-1">
            <AlignmentButton
              active={(component.settings?.alignment || '') === 'left'}
              onClick={() => onChangeSetting('alignment', 'left')}
              title="Align left"
            >
              <AlignLeft size={14} />
            </AlignmentButton>
            <AlignmentButton
              active={(component.settings?.alignment || '') === 'center'}
              onClick={() => onChangeSetting('alignment', 'center')}
              title="Align center"
            >
              <AlignCenter size={14} />
            </AlignmentButton>
            <AlignmentButton
              active={(component.settings?.alignment || '') === 'right'}
              onClick={() => onChangeSetting('alignment', 'right')}
              title="Align right"
            >
              <AlignRight size={14} />
            </AlignmentButton>
          </div>

          <label className="flex h-8 items-center gap-2 rounded-lg border border-[#352f32] bg-[#211d20] px-2 text-xs font-semibold text-[#9fb2d0]">
            Txt
            <input
              type="color"
              title="Text color"
              value={component.settings?.color || '#f8fafc'}
              onChange={(event) => onChangeSetting('color', event.target.value)}
            />
          </label>

          <label className="flex h-8 items-center gap-2 rounded-lg border border-[#352f32] bg-[#211d20] px-2 text-xs font-semibold text-[#9fb2d0]">
            Bg
            <input
              type="color"
              title="Background color"
              value={component.settings?.backgroundColor || '#0f172a'}
              onChange={(event) => onChangeSetting('backgroundColor', event.target.value)}
            />
          </label>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#352f32] bg-[#211d20] text-[#8fa0bd] transition hover:border-[#40506e] hover:text-white"
            onClick={() => onMove(-1)}
            title="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#352f32] bg-[#211d20] text-[#8fa0bd] transition hover:border-[#40506e] hover:text-white"
            onClick={() => onMove(1)}
            title="Move down"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-100 transition hover:bg-rose-500/15"
            onClick={onRemove}
            title="Remove block"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </header>

      <div className="space-y-4 p-4">
        {component.type === 'header' ? (
          <label className="crud-field">
            <span>Heading</span>
            <input
              placeholder="Enter section heading"
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'subheader' ? (
          <label className="crud-field">
            <span>Subheading</span>
            <input
              placeholder="Enter subsection heading"
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'paragraph' ? (
          <label className="crud-field">
            <span>Paragraph</span>
            <textarea
              placeholder="Write the main paragraph content..."
              rows={5}
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'quote' ? (
          <label className="crud-field">
            <span>Quote</span>
            <textarea
              placeholder="Add a pull quote or testimonial..."
              rows={4}
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'code' ? (
          <label className="crud-field">
            <span>Code</span>
            <textarea
              className="font-mono"
              placeholder="Paste code sample..."
              rows={6}
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'highlight' ? (
          <label className="crud-field">
            <span>Highlight</span>
            <textarea
              placeholder="Call out an important takeaway..."
              rows={4}
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'footer' ? (
          <label className="crud-field">
            <span>Footer Note</span>
            <textarea
              placeholder="Add a closing note or CTA..."
              rows={3}
              value={component.content}
              onChange={(event) => onChangeContent(event.target.value)}
            />
          </label>
        ) : null}

        {component.type === 'image' ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-4">
              <label className="crud-field">
                <span>Image URL</span>
                <input
                  placeholder="https://example.com/cover.jpg"
                  value={component.content}
                  onChange={(event) => onChangeContent(event.target.value)}
                />
              </label>
              <label className="crud-field">
                <span>Caption</span>
                <input
                  placeholder="Optional image caption"
                  value={component.settings?.caption || ''}
                  onChange={(event) => onChangeSetting('caption', event.target.value)}
                />
              </label>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-[#312b2e] bg-[#111012]">
              {component.content ? (
                <img
                  alt="Block preview"
                  className="h-full w-full object-cover"
                  src={component.content}
                />
              ) : (
                <div className="flex h-full min-h-[180px] items-center justify-center px-4 text-center text-sm font-medium text-[#7283a0]">
                  Image preview
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default function BlogFormPage({ action = 'add' }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams()
  const isEditing = action === 'update'
  const [formData, setFormData] = useState(buildBlogFormState())
  const [components, setComponents] = useState([])
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState('desktop')
  const draggedIndexRef = useRef(null)
  const dragOverIndexRef = useRef(null)

  useEffect(() => {
    if (!isEditing || !id) {
      return undefined
    }

    let mounted = true

    const loadBlog = async () => {
      setIsLoading(true)

      try {
        const blog = await getBlogDetails(id)

        if (!mounted) {
          return
        }

        const nextFormState = buildBlogFormState(blog)
        setFormData(nextFormState)
        setComponents(nextFormState.components)
      } catch (error) {
        if (!mounted) {
          return
        }

        toast.error(error.message || 'Unable to load blog details.')
        navigate(APP_ROUTES.blogs)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadBlog()

    return () => {
      mounted = false
    }
  }, [id, isEditing, navigate, toast])

  const previewHtml = useMemo(() => generateBlogHtml(components), [components])

  const updateField = (name, value) => {
    setFormData((currentData) => {
      if (name !== 'title') {
        return {
          ...currentData,
          [name]: value,
        }
      }

      const nextSlug = slugifyBlogTitle(value)
      const shouldSyncSlug = !isEditing && (!currentData.slug || currentData.slug === slugifyBlogTitle(currentData.title))

      return {
        ...currentData,
        slug: shouldSyncSlug ? nextSlug : currentData.slug,
        title: value,
      }
    })
  }

  const addComponent = (type) => {
    setComponents((currentComponents) => [...currentComponents, createEmptyBlogComponent(type)])
  }

  const updateComponentContent = (componentId, value) => {
    setComponents((currentComponents) =>
      currentComponents.map((component) =>
        component.id === componentId
          ? {
              ...component,
              content: value,
            }
          : component,
      ),
    )
  }

  const updateComponentSetting = (componentId, key, value) => {
    setComponents((currentComponents) =>
      currentComponents.map((component) =>
        component.id === componentId
          ? {
              ...component,
              settings: {
                ...component.settings,
                [key]: value,
              },
            }
          : component,
      ),
    )
  }

  const removeComponent = (componentId) => {
    setComponents((currentComponents) =>
      currentComponents.filter((component) => component.id !== componentId),
    )
  }

  const moveComponent = (componentIndex, direction) => {
    setComponents((currentComponents) => {
      const targetIndex = componentIndex + direction

      if (targetIndex < 0 || targetIndex >= currentComponents.length) {
        return currentComponents
      }

      const nextComponents = [...currentComponents]
      const [movedComponent] = nextComponents.splice(componentIndex, 1)
      nextComponents.splice(targetIndex, 0, movedComponent)
      return nextComponents
    })
  }

  const handleToolDragStart = (event, componentType) => {
    event.dataTransfer.setData('blog-component-type', componentType)
    event.dataTransfer.effectAllowed = 'copy'
  }

  const handleCanvasDrop = (event) => {
    event.preventDefault()
    const componentType = event.dataTransfer.getData('blog-component-type')

    if (!componentType) {
      return
    }

    addComponent(componentType)
  }

  const handleComponentDragStart = (event, index) => {
    draggedIndexRef.current = index
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleComponentDragEnd = () => {
    const draggedIndex = draggedIndexRef.current
    const dragOverIndex = dragOverIndexRef.current

    if (
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      draggedIndexRef.current = null
      dragOverIndexRef.current = null
      return
    }

    setComponents((currentComponents) => {
      const nextComponents = [...currentComponents]
      const [movedComponent] = nextComponents.splice(draggedIndex, 1)
      nextComponents.splice(dragOverIndex, 0, movedComponent)
      return nextComponents
    })

    draggedIndexRef.current = null
    dragOverIndexRef.current = null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Blog title is required.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = buildBlogPayload(formData, components)

      if (isEditing && id) {
        await updateBlog(id, payload)
        toast.success('Blog updated successfully.')
      } else {
        await createBlog(payload)
        toast.success('Blog created successfully.')
      }

      navigate(APP_ROUTES.blogs)
    } catch (error) {
      toast.error(error.message || `Unable to ${isEditing ? 'update' : 'create'} blog.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="routes-page">
        <div className="routes-page__inner">
          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#2d282b] bg-[#171314] text-sm font-semibold text-[#8fa0bd]">
            Loading blog builder...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner space-y-5">
        <header className="rounded-[28px] border border-[#2d282b] bg-[#171314] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#332d30] bg-[#211d20] text-[#c5d9f7]"
                onClick={() => navigate(APP_ROUTES.blogs)}
              >
                <ArrowLeft size={16} />
              </button>

              <div>
                <div className="routes-page__title">
                  <FileText size={20} color="#4f83ff" />
                  <h1>{isEditing ? 'Edit Blog' : 'Create Blog'}</h1>
                </div>
                <p className="routes-page__subtitle">
                  Build the article layout with reusable content blocks, SEO metadata, and a live
                  preview before publishing.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-[#c5d9f7]">
                <CalendarClock size={15} />
                {components.length} block{components.length === 1 ? '' : 's'}
              </span>
              <span
                className={`inline-flex h-10 items-center rounded-lg border px-4 ${getBlogStatusToneClassName(
                  formData.status,
                )}`}
              >
                {formatBlogStatusLabel(formData.status)}
              </span>
            </div>
          </div>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_minmax(340px,0.92fr)]">
            <div className="space-y-5">
              <SectionCard
                title="Builder Toolbox"
                description="Drag a block into the canvas or tap add to insert it at the end."
              >
                <div className="space-y-3">
                  {BLOG_COMPONENT_TYPES.map((componentType) => (
                    <button
                      key={componentType.id}
                      type="button"
                      className="flex w-full items-center justify-between rounded-[18px] border border-[#322c2f] bg-[#211d20] px-4 py-3 text-left transition hover:border-[#3f4f70] hover:bg-[#262124]"
                      draggable
                      onClick={() => addComponent(componentType.id)}
                      onDragStart={(event) => handleToolDragStart(event, componentType.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#171314] text-sm font-bold text-[#dbeafe]">
                          {componentType.icon}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{componentType.label}</p>
                          <p className="text-xs text-[#7283a0]">{componentType.description}</p>
                        </div>
                      </div>

                      <span className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#393235] bg-[#171314] px-2.5 text-[11px] font-bold text-[#9fb2d0]">
                        <Plus size={13} />
                        Add
                      </span>
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Publishing Snapshot"
                description="A quick overview of what this post will carry when saved."
              >
                <div className="space-y-3 text-sm text-[#9fb2d0]">
                  <div className="rounded-[18px] border border-[#322c2f] bg-[#211d20] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
                      Slug
                    </p>
                    <p className="mt-2 break-all text-white">
                      {formData.slug || slugifyBlogTitle(formData.title) || 'blog-slug'}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-[#322c2f] bg-[#211d20] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
                      Meta Description
                    </p>
                    <p className="mt-2 leading-6">
                      {formData.metaDescription || 'Add a short summary for search and social previews.'}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-[#322c2f] bg-[#211d20] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
                      Publish Date
                    </p>
                    <p className="mt-2 text-white">{formData.publishDate || 'Not scheduled yet'}</p>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="space-y-5">
              <SectionCard
                title="Blog Metadata"
                description="Set the title, canonical slug, author line, publish date, and SEO summary."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="crud-field md:col-span-2">
                    <span>Title</span>
                    <input
                      name="title"
                      placeholder="Write the article title"
                      value={formData.title}
                      onChange={(event) => updateField('title', event.target.value)}
                    />
                  </label>

                  <label className="crud-field">
                    <span>Slug</span>
                    <input
                      name="slug"
                      placeholder="blog-slug"
                      value={formData.slug}
                      onChange={(event) => updateField('slug', event.target.value)}
                    />
                    <small>Used for the blog URL and should stay unique.</small>
                  </label>

                  <label className="crud-field">
                    <span>Author</span>
                    <input
                      name="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={(event) => updateField('author', event.target.value)}
                    />
                  </label>

                  <label className="crud-field">
                    <span>Publish Date</span>
                    <input
                      name="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(event) => updateField('publishDate', event.target.value)}
                    />
                  </label>

                  <label className="crud-field">
                    <span>Status</span>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(event) => updateField('status', event.target.value)}
                    >
                      {BLOG_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="crud-field md:col-span-2">
                    <span>Cover Image</span>
                    <input
                      name="coverImage"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.coverImage}
                      onChange={(event) => updateField('coverImage', event.target.value)}
                    />
                  </label>

                  <label className="crud-field md:col-span-2">
                    <span>Meta Description</span>
                    <textarea
                      name="metaDescription"
                      placeholder="Brief summary for SEO and sharing cards"
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(event) => updateField('metaDescription', event.target.value)}
                    />
                  </label>
                </div>
              </SectionCard>

              <SectionCard
                title="Content Canvas"
                description="Shape the article body with draggable builder blocks and block-level styling controls."
              >
                <div
                  className="rounded-[22px] border border-dashed border-[#33415d] bg-[#111012] p-4"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleCanvasDrop}
                >
                  {components.length ? (
                    <div className="space-y-4">
                      {components.map((component, index) => (
                        <div
                          key={component.id}
                          draggable
                          onDragEnd={handleComponentDragEnd}
                          onDragEnter={() => {
                            dragOverIndexRef.current = index
                          }}
                          onDragOver={(event) => event.preventDefault()}
                          onDragStart={(event) => handleComponentDragStart(event, index)}
                        >
                          <ComponentEditor
                            component={component}
                            index={index}
                            isDragging={draggedIndexRef.current === index}
                            onChangeContent={(value) => updateComponentContent(component.id, value)}
                            onChangeSetting={(key, value) => updateComponentSetting(component.id, key, value)}
                            onMove={(direction) => moveComponent(index, direction)}
                            onRemove={() => removeComponent(component.id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[18px] border border-dashed border-[#2d3546] bg-[#141214] px-6 text-center">
                      <p className="text-base font-semibold text-white">Start building the story</p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-[#7f8da7]">
                        Drag a component from the toolbox into this canvas or click add to create
                        your first block.
                      </p>
                    </div>
                  )}
                </div>
              </SectionCard>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#332d30] bg-[#211d20] px-5 text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5"
                  onClick={() => navigate(APP_ROUTES.blogs)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-500/30 bg-[linear-gradient(135deg,rgba(37,99,235,0.24),rgba(8,47,73,0.4))] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
                  disabled={isSubmitting}
                >
                  <Save size={16} />
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <SectionCard
                title="Live Preview"
                description="Review the post as a rendered article before saving it to the blog list."
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
                          viewMode === 'desktop'
                            ? 'border-blue-500/30 bg-blue-500/15 text-blue-50'
                            : 'border-[#332d30] bg-[#211d20] text-[#9fb2d0]'
                        }`}
                        onClick={() => setViewMode('desktop')}
                      >
                        <Laptop size={14} />
                        Desktop
                      </button>
                      <button
                        type="button"
                        className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
                          viewMode === 'mobile'
                            ? 'border-blue-500/30 bg-blue-500/15 text-blue-50'
                            : 'border-[#332d30] bg-[#211d20] text-[#9fb2d0]'
                        }`}
                        onClick={() => setViewMode('mobile')}
                      >
                        <Smartphone size={14} />
                        Mobile
                      </button>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getBlogStatusToneClassName(
                        formData.status,
                      )}`}
                    >
                      {formatBlogStatusLabel(formData.status)}
                    </span>
                  </div>

                  <div className="rounded-[26px] border border-[#2d282b] bg-[#110f10] p-4">
                    <div
                      className={`mx-auto rounded-[24px] border border-[#2e282b] bg-white p-6 text-slate-900 shadow-[0_24px_60px_rgba(0,0,0,0.22)] ${
                        viewMode === 'mobile' ? 'max-w-[390px]' : 'max-w-none'
                      }`}
                    >
                      <div className="border-b border-slate-200 pb-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 normal-case tracking-normal ${getBlogStatusToneClassName(
                              formData.status,
                            )}`}
                          >
                            {formatBlogStatusLabel(formData.status)}
                          </span>
                          <span>{formData.publishDate || 'Draft date'}</span>
                        </div>
                        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                          {formData.title || 'Your blog title'}
                        </h1>
                        <p className="mt-3 text-sm italic text-slate-500">
                          By {formData.author || 'Author name'}
                        </p>
                        {formData.coverImage ? (
                          <div className="mt-5 overflow-hidden rounded-[24px]">
                            <img
                              alt="Blog cover"
                              className="h-auto w-full object-cover"
                              src={formData.coverImage}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div
                        className="mt-6"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

