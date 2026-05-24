const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

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

const toTitleCase = (value) =>
  normalizeText(value, '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(' ')

const formatFeeLabel = (fee, currency) => {
  const normalizedCurrency = normalizeText(currency)

  if (normalizedCurrency === '-') {
    return numberFormatter.format(toNumber(fee))
  }

  return `${normalizedCurrency} ${numberFormatter.format(toNumber(fee))}`
}

export const normalizeVisaType = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const fee = toNumber(item.fee)
  const processingDays = toNumber(item.processing_days)
  const currency = normalizeText(item.currency)
  const isActive = toBoolean(item.status ?? item.is_active, true)

  return {
    countryId: item.country_id ? String(item.country_id) : '',
    countryName: normalizeText(item.country_name),
    currency,
    description: normalizeText(item.description, ''),
    entryType: normalizeText(item.entry_type),
    entryTypeLabel: toTitleCase(item.entry_type) || '-',
    fee,
    feeLabel: formatFeeLabel(fee, currency),
    id: item.id ?? `visa-type-${serial}`,
    isActive,
    processingDays,
    processingDaysLabel: processingDays ? String(processingDays) : '0',
    serial,
    status: isActive ? 'active' : 'inactive',
    statusLabel: isActive ? 'Active' : 'Inactive',
    title: normalizeText(item.title ?? item.visa_title ?? item.visa_name),
    titleLabel: normalizeText(item.title ?? item.visa_title ?? item.visa_name),
    visaName: normalizeText(item.visa_name ?? item.title),
  }
}

export const toVisaTypeFormValues = (item = {}) => ({
  country_id: item.country_id ? String(item.country_id) : '',
  description: normalizeText(item.description, ''),
  fee: item.fee ?? '',
  processing_days: item.processing_days ?? '',
  status: toBoolean(item.status ?? item.is_active, true),
  visa_name: normalizeText(item.visa_name, ''),
})

const parseInteger = (value) => {
  const parsedValue = Number.parseInt(String(value ?? '').trim(), 10)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

const parseDecimal = (value) => {
  const parsedValue = Number.parseFloat(String(value ?? '').trim())
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

export const buildVisaTypePayload = (values = {}) => ({
  country_id: parseInteger(values.country_id),
  description: normalizeText(values.description, ''),
  fee: parseDecimal(values.fee),
  processing_days: parseInteger(values.processing_days),
  status: Boolean(values.status),
  visa_name: normalizeText(values.visa_name, ''),
})

export const buildVisaTypeMetrics = (rows = []) => {
  const activeCount = rows.filter((row) => row.isActive).length
  const uniqueCountries = new Set(rows.map((row) => row.countryName).filter((value) => value && value !== '-')).size
  const rowsWithProcessingDays = rows.filter((row) => row.processingDays > 0)
  const averageProcessingDays =
    rowsWithProcessingDays.length > 0
      ? rowsWithProcessingDays.reduce((sum, row) => sum + row.processingDays, 0) / rowsWithProcessingDays.length
      : 0

  return {
    activeCount,
    averageProcessingDaysLabel: averageProcessingDays ? `${averageProcessingDays.toFixed(1)} days` : '0 days',
    feeListedCount: rows.filter((row) => row.fee > 0).length,
    totalCount: rows.length,
    uniqueCountries,
  }
}
