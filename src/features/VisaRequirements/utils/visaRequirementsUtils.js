const bool = (value, fallback = false) => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  if (typeof value === 'string') return ['1', 'true', 'yes', 'active'].includes(value.toLowerCase())
  return fallback
}
const text = (value, fallback = '-') => String(value ?? '').trim() || fallback

export const normalizeVisaRequirement = (item = {}, index = 0, pagination = {}) => ({
  id: item.id ?? `requirement-${index}`,
  serial: (pagination.from || 0) + index + 1,
  countryName: text(item.country_name),
  visaName: text(item.visa_name ?? item.visa_title),
  documentName: text(item.document_name, 'Untitled document'),
  instructions: text(item.instructions),
  isRequired: bool(item.is_required, true),
  allowMultiple: bool(item.allow_multiple),
  sortOrder: Number(item.sort_order) || 0,
})

export const toVisaRequirementValues = (item = {}) => ({
  visa_type_id: item.visa_type_id ? String(item.visa_type_id) : '',
  document_name: text(item.document_name, ''),
  instructions: text(item.instructions, ''),
  is_required: bool(item.is_required, true),
  allow_multiple: bool(item.allow_multiple),
  sort_order: item.sort_order ?? 0,
})

export const buildVisaRequirementPayload = (values) => ({
  visa_type_id: Number.parseInt(values.visa_type_id, 10),
  document_name: text(values.document_name, ''),
  instructions: text(values.instructions, ''),
  is_required: Boolean(values.is_required),
  allow_multiple: Boolean(values.allow_multiple),
  sort_order: Number.parseInt(values.sort_order, 10) || 0,
})
