export const BLOGS_PAGE_COPY = {
  newButtonLabel: 'Create Blog',
  title: 'Blog Management',
  subtitle:
    'Create, publish, and maintain blog stories with a visual builder, SEO metadata, and live preview in one admin workspace.',
  searchPlaceholder: 'Search by title, slug, author, status, publish date, or meta description',
}

export const BLOG_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export const BLOG_COMPONENT_TYPES = [
  {
    id: 'header',
    icon: 'H1',
    label: 'Header',
    placeholder: 'Enter section heading',
    description: 'Large section heading',
  },
  {
    id: 'subheader',
    icon: 'H2',
    label: 'Subheader',
    placeholder: 'Enter subsection heading',
    description: 'Secondary heading',
  },
  {
    id: 'paragraph',
    icon: 'P',
    label: 'Paragraph',
    placeholder: 'Write the main paragraph content...',
    description: 'Rich body paragraph',
  },
  {
    id: 'image',
    icon: 'IMG',
    label: 'Image',
    placeholder: 'Paste image URL',
    description: 'Image with optional caption',
  },
  {
    id: 'quote',
    icon: '""',
    label: 'Quote',
    placeholder: 'Add a pull quote or testimonial...',
    description: 'Featured quotation',
  },
  {
    id: 'code',
    icon: '</>',
    label: 'Code Block',
    placeholder: 'Paste code sample...',
    description: 'Preformatted code snippet',
  },
  {
    id: 'highlight',
    icon: '★',
    label: 'Highlight',
    placeholder: 'Call out an important takeaway...',
    description: 'Highlighted callout box',
  },
  {
    id: 'footer',
    icon: '___',
    label: 'Footer',
    placeholder: 'Add a closing note or CTA...',
    description: 'Ending section',
  },
]

export const BLOGS_EMPTY_STATE = {
  noAuthor: 'Unknown author',
  noCoverImage: 'No cover image',
  noMetaDescription: 'No meta description provided.',
  noPublishDate: 'Not scheduled',
  noSlug: 'No slug',
}

export const BLOG_FORM_DEFAULT_VALUES = {
  author: '',
  components: [],
  content: '',
  coverImage: '',
  metaDescription: '',
  publishDate: '',
  slug: '',
  status: 'draft',
  title: '',
}

