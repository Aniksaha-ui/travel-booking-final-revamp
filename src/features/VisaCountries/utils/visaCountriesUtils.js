const integerFormatter = new Intl.NumberFormat('en-US')

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const toBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    return value === 1
  }

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase()

    if (['1', 'true', 'yes', 'active', 'enabled'].includes(normalizedValue)) {
      return true
    }

    if (['0', 'false', 'no', 'inactive', 'disabled'].includes(normalizedValue)) {
      return false
    }
  }

  return fallback
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

const toDisplayOrderLabel = (value) => {
  if (value === undefined || value === null || value === '') {
    return '-'
  }

  return integerFormatter.format(toNumber(value))
}

const resolveNationalityName = (item = {}) =>
  normalizeText(item.nationality_name ?? item.nationality?.name ?? item.nationality)

const resolveIsActive = (item = {}) =>
  toBoolean(item.is_active ?? item.status ?? item.isActive, true)

const resolveIsPopular = (item = {}) =>
  toBoolean(item.is_popular ?? item.isPopular)

export const normalizeVisaCountry = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const isActive = resolveIsActive(item)
  const isPopular = resolveIsPopular(item)

  return {
    displayOrder: toNumber(item.display_order),
    displayOrderLabel: toDisplayOrderLabel(item.display_order),
    flag: normalizeText(item.flag, ''),
    id: item.id ?? `${normalizeText(item.iso_code, 'visa-country')}-${serial}`,
    isActive,
    isPopular,
    isoCode: normalizeText(item.iso_code),
    isoCodeLabel: normalizeText(item.iso_code).toUpperCase(),
    name: normalizeText(item.name, 'Unnamed Country'),
    nationalityName: resolveNationalityName(item),
    serial,
    status: isActive ? 'active' : 'inactive',
    statusLabel: isActive ? 'Active' : 'Inactive',
  }
}

export const toVisaCountryFormValues = (item = {}) => ({
  flag: normalizeText(item.flag, ''),
  is_popular: resolveIsPopular(item),
  iso_code: normalizeText(item.iso_code, ''),
  name: normalizeText(item.name, ''),
  status: resolveIsActive(item),
})

export const buildVisaCountryPayload = (values = {}, mode = 'create') => {
  const basePayload = {
    iso_code: normalizeText(values.iso_code, '').toUpperCase(),
    name: normalizeText(values.name, ''),
  }

  if (mode === 'edit') {
    return basePayload
  }

  return {
    ...basePayload,
    flag: normalizeText(values.flag, ''),
    is_popular: Boolean(values.is_popular),
    status: Boolean(values.status),
  }
}

export const buildVisaCountryMetrics = (rows = []) => {
  const activeCount = rows.filter((row) => row.isActive).length
  const popularCount = rows.filter((row) => row.isPopular).length
  const nationalityCount = new Set(rows.map((row) => row.nationalityName).filter((value) => value && value !== '-')).size

  return {
    activeCount,
    nationalityCount,
    popularCount,
    totalCount: rows.length,
  }
}
