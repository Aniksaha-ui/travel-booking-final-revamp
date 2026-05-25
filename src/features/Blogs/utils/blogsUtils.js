import dayjs from 'dayjs'
import {
  BLOG_COMPONENT_TYPES,
  BLOG_FORM_DEFAULT_VALUES,
  BLOGS_EMPTY_STATE,
} from '../constants/blogs.constants'

const integerFormatter = new Intl.NumberFormat('en-US')

const COMPONENT_TYPE_MAP = BLOG_COMPONENT_TYPES.reduce((collection, component) => {
  collection[component.id] = component
  return collection
}, {})

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const normalizeStatusKey = (value) => {
  const normalizedValue = String(value ?? 'draft').trim().toLowerCase()

  if (['draft', 'published', 'archived'].includes(normalizedValue)) {
    return normalizedValue
  }

  return 'draft'
}

const formatDateLabel = (value, fallback = BLOGS_EMPTY_STATE.noPublishDate) => {
  const parsedValue = dayjs(value)
  return parsedValue.isValid() ? parsedValue.format('DD MMM YYYY') : fallback
}

const formatDateInputValue = (value) => {
  const parsedValue = dayjs(value)
  return parsedValue.isValid() ? parsedValue.format('YYYY-MM-DD') : ''
}

const buildStyleParts = (settings = {}, extraParts = []) => {
  const styleParts = [...extraParts]

  if (settings.color) {
    styleParts.push(`color: ${settings.color}`)
  }

  if (settings.backgroundColor) {
    styleParts.push(`background-color: ${settings.backgroundColor}`)
  }

  if (settings.alignment) {
    styleParts.push(`text-align: ${settings.alignment}`)
  }

  return styleParts.join('; ')
}

const buildStyleAttribute = (settings = {}, extraParts = []) => {
  const inlineStyle = buildStyleParts(settings, extraParts)
  return inlineStyle ? ` style="${inlineStyle}"` : ''
}

const parseComponents = (value) => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value !== 'string' || !value.trim()) {
    return []
  }

  try {
    const parsedValue = JSON.parse(value)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export const createBlogComponentId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export const createEmptyBlogComponent = (type = 'paragraph') => ({
  content: '',
  id: createBlogComponentId(),
  settings: {},
  type,
})

export const slugifyBlogTitle = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const formatBlogStatusLabel = (status) =>
  normalizeStatusKey(status)
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

export const getBlogStatusToneClassName = (status) => {
  switch (normalizeStatusKey(status)) {
    case 'published':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
    case 'archived':
      return 'border-slate-500/20 bg-slate-500/10 text-slate-200'
    case 'draft':
    default:
      return 'border-amber-500/20 bg-amber-500/10 text-amber-100'
  }
}

export const normalizeBlogComponent = (component = {}, index = 0) => {
  const normalizedType = COMPONENT_TYPE_MAP[component.type]?.id ?? 'paragraph'

  return {
    content: normalizeText(component.content, ''),
    id: component.id ?? `${normalizedType}-${index + 1}`,
    settings: {
      alignment: normalizeText(component.settings?.alignment, ''),
      backgroundColor: normalizeText(component.settings?.backgroundColor, ''),
      caption: normalizeText(component.settings?.caption, ''),
      color: normalizeText(component.settings?.color, ''),
    },
    type: normalizedType,
  }
}

export const generateBlogHtml = (components = []) => {
  const safeComponents = components.map(normalizeBlogComponent)
  let htmlContent =
    '<article class="blog-post" style="display:grid;gap:24px;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#0f172a;line-height:1.7;">'

  safeComponents.forEach((component) => {
    switch (component.type) {
      case 'header':
        htmlContent += `<h2${buildStyleAttribute(component.settings, [
          'font-size: 32px',
          'font-weight: 800',
          'letter-spacing: -0.02em',
          'margin: 0',
        ])}>${escapeHtml(component.content || 'Header')}</h2>`
        break
      case 'subheader':
        htmlContent += `<h3${buildStyleAttribute(component.settings, [
          'font-size: 24px',
          'font-weight: 700',
          'margin: 0',
        ])}>${escapeHtml(component.content || 'Subheader')}</h3>`
        break
      case 'paragraph':
        htmlContent += `<p${buildStyleAttribute(component.settings, [
          'font-size: 16px',
          'margin: 0',
          'white-space: normal',
        ])}>${escapeHtml(component.content || 'Paragraph').replaceAll('\n', '<br>')}</p>`
        break
      case 'image':
        if (component.content) {
          const figureStyle = buildStyleParts(component.settings, [
            'margin: 0',
            'display: grid',
            'gap: 10px',
          ])
          const captionStyle = buildStyleParts(component.settings, [
            'font-size: 13px',
            'opacity: 0.75',
          ])

          htmlContent += `<figure${figureStyle ? ` style="${figureStyle}"` : ''}><img src="${escapeHtml(
            component.content,
          )}" alt="Blog visual" style="width:100%;border-radius:18px;object-fit:cover;max-height:480px;" />${
            component.settings.caption
              ? `<figcaption${captionStyle ? ` style="${captionStyle}"` : ''}>${escapeHtml(
                  component.settings.caption,
                )}</figcaption>`
              : ''
          }</figure>`
        } else {
          htmlContent += `<div${buildStyleAttribute(component.settings, [
            'border: 1px dashed #94a3b8',
            'border-radius: 18px',
            'padding: 28px',
            'font-size: 14px',
            'color: #64748b',
          ])}>Image placeholder</div>`
        }
        break
      case 'quote':
        htmlContent += `<blockquote${buildStyleAttribute(component.settings, [
          'border-left: 4px solid #3b82f6',
          'padding: 8px 0 8px 18px',
          'font-size: 20px',
          'font-style: italic',
          'margin: 0',
        ])}>${escapeHtml(component.content || 'Quote').replaceAll('\n', '<br>')}</blockquote>`
        break
      case 'code':
        htmlContent += `<pre${buildStyleAttribute(component.settings, [
          'background-color: #0f172a',
          'color: #e2e8f0',
          'padding: 18px',
          'border-radius: 18px',
          'overflow-x: auto',
          'margin: 0',
          'font-size: 14px',
        ])}><code>${escapeHtml(component.content || 'Code Block')}</code></pre>`
        break
      case 'highlight':
        htmlContent += `<div${buildStyleAttribute(component.settings, [
          'border: 1px solid rgba(59,130,246,0.18)',
          'border-radius: 18px',
          'padding: 20px',
          'background: rgba(59,130,246,0.08)',
          'font-size: 15px',
        ])}>${escapeHtml(component.content || 'Highlight Content').replaceAll('\n', '<br>')}</div>`
        break
      case 'footer':
        htmlContent += `<footer${buildStyleAttribute(component.settings, [
          'border-top: 1px solid rgba(148,163,184,0.3)',
          'padding-top: 18px',
          'font-size: 14px',
          'opacity: 0.82',
        ])}>${escapeHtml(component.content || 'Footer Content').replaceAll('\n', '<br>')}</footer>`
        break
      default:
        break
    }
  })

  htmlContent += '</article>'

  return htmlContent
}

export const normalizeBlog = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const components = parseComponents(item.components_json ?? item.componentsJson).map(normalizeBlogComponent)
  const status = normalizeStatusKey(item.status)
  const publishDate = item.publishDate ?? item.publish_date ?? item.published_at ?? ''
  const author = normalizeText(item.author, BLOGS_EMPTY_STATE.noAuthor)
  const metaDescription = normalizeText(
    item.metaDescription ?? item.meta_description,
    BLOGS_EMPTY_STATE.noMetaDescription,
  )

  return {
    author,
    componentCount: components.length,
    componentCountLabel: `${components.length} block${components.length === 1 ? '' : 's'}`,
    components,
    content: normalizeText(item.content, ''),
    coverImage: normalizeText(item.coverImage ?? item.cover_image, ''),
    id: item.id ?? `blog-${serial}`,
    metaDescription,
    publishDate,
    publishDateLabel: formatDateLabel(publishDate),
    serial,
    slug: normalizeText(item.slug, BLOGS_EMPTY_STATE.noSlug),
    status,
    statusLabel: formatBlogStatusLabel(status),
    title: normalizeText(item.title, `Untitled Blog ${serial}`),
  }
}

export const normalizeBlogDetails = (item = {}) => normalizeBlog(item, 0, { from: 0 })

export const buildBlogFormState = (blog = {}) => ({
  ...BLOG_FORM_DEFAULT_VALUES,
  author: blog.author && blog.author !== BLOGS_EMPTY_STATE.noAuthor ? blog.author : '',
  components: Array.isArray(blog.components)
    ? blog.components.map((component) => normalizeBlogComponent(component))
    : parseComponents(blog.components_json ?? blog.componentsJson).map(normalizeBlogComponent),
  content: blog.content || '',
  coverImage: blog.coverImage || '',
  metaDescription:
    blog.metaDescription && blog.metaDescription !== BLOGS_EMPTY_STATE.noMetaDescription
      ? blog.metaDescription
      : '',
  publishDate: formatDateInputValue(blog.publishDate),
  slug: blog.slug && blog.slug !== BLOGS_EMPTY_STATE.noSlug ? blog.slug : '',
  status: normalizeStatusKey(blog.status),
  title: blog.title && !String(blog.title).startsWith('Untitled Blog') ? blog.title : '',
})

export const buildBlogPayload = (formState, components) => ({
  author: normalizeText(formState.author, ''),
  components_json: JSON.stringify(components.map((component) => normalizeBlogComponent(component))),
  content: generateBlogHtml(components),
  coverImage: normalizeText(formState.coverImage, ''),
  metaDescription: normalizeText(formState.metaDescription, ''),
  publishDate: normalizeText(formState.publishDate, ''),
  slug: normalizeText(formState.slug, slugifyBlogTitle(formState.title)),
  status: normalizeStatusKey(formState.status),
  title: normalizeText(formState.title, ''),
})

export const buildBlogMetrics = (rows = []) => {
  const publishedCount = rows.filter((row) => row.status === 'published').length
  const draftCount = rows.filter((row) => row.status === 'draft').length
  const archivedCount = rows.filter((row) => row.status === 'archived').length
  const authors = new Set(
    rows
      .map((row) => row.author)
      .filter((author) => author && author !== '-' && author !== BLOGS_EMPTY_STATE.noAuthor),
  )

  return {
    archivedCount,
    archivedCountLabel: integerFormatter.format(archivedCount),
    authorCount: authors.size,
    authorCountLabel: integerFormatter.format(authors.size),
    draftCount,
    draftCountLabel: integerFormatter.format(draftCount),
    publishedCount,
    publishedCountLabel: integerFormatter.format(publishedCount),
    totalCount: rows.length,
    totalCountLabel: integerFormatter.format(rows.length),
  }
}

