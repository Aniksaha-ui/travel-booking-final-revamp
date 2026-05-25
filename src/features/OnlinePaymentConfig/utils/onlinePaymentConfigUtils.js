import {
  ONLINE_PAYMENT_CONFIG_EMPTY_STATE,
  ONLINE_PAYMENT_CONFIG_FORM_DEFAULT_VALUES,
  ONLINE_PAYMENT_FOR_OPTIONS,
} from '../constants/onlinePaymentConfig.constants'

const integerFormatter = new Intl.NumberFormat('en-US')

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

export const formatPaymentForLabel = (value) => {
  const normalizedValue = normalizeText(value, '').toLowerCase()
  const matchingOption = ONLINE_PAYMENT_FOR_OPTIONS.find((option) => option.value === normalizedValue)

  if (matchingOption) {
    return matchingOption.label
  }

  if (!normalizedValue) {
    return ONLINE_PAYMENT_CONFIG_EMPTY_STATE.noPaymentFor
  }

  return normalizedValue
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

export const getOnlinePaymentStatusMeta = (value) => {
  const normalizedValue = String(value ?? '').trim()
  const isEnabled = normalizedValue === '1' || normalizedValue.toLowerCase() === 'yes' || normalizedValue === 'true'

  return {
    badgeClassName: isEnabled
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
      : 'border-rose-500/20 bg-rose-500/10 text-rose-100',
    description: isEnabled ? 'Customers can pay online for this flow.' : 'Customers must use offline payment for this flow.',
    key: isEnabled ? 'enabled' : 'disabled',
    label: isEnabled ? 'Enabled' : 'Disabled',
  }
}

export const normalizeOnlinePaymentConfig = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const paymentFor = normalizeText(item.payment_for, '')
  const statusMeta = getOnlinePaymentStatusMeta(item.online_payment)

  return {
    id: item.id ?? `online-payment-config-${serial}`,
    onlinePayment: String(item.online_payment ?? '0'),
    paymentFor,
    paymentForLabel: formatPaymentForLabel(paymentFor),
    serial,
    statusDescription: statusMeta.description,
    statusKey: statusMeta.key,
    statusLabel: statusMeta.label,
    statusToneClassName: statusMeta.badgeClassName,
  }
}

export const buildOnlinePaymentConfigMetrics = (rows = []) => {
  const enabledCount = rows.filter((row) => row.statusKey === 'enabled').length
  const disabledCount = rows.filter((row) => row.statusKey === 'disabled').length
  const paymentFlows = new Set(rows.map((row) => row.paymentFor).filter(Boolean))

  return {
    disabledCount,
    disabledCountLabel: integerFormatter.format(disabledCount),
    enabledCount,
    enabledCountLabel: integerFormatter.format(enabledCount),
    paymentFlowCount: paymentFlows.size,
    paymentFlowCountLabel: integerFormatter.format(paymentFlows.size),
    totalCount: rows.length,
    totalCountLabel: integerFormatter.format(rows.length),
  }
}

export const buildOnlinePaymentFormState = (configuration = {}) => ({
  ...ONLINE_PAYMENT_CONFIG_FORM_DEFAULT_VALUES,
  online_payment:
    configuration.onlinePayment !== undefined
      ? String(configuration.onlinePayment)
      : configuration.online_payment !== undefined
        ? String(configuration.online_payment)
        : ONLINE_PAYMENT_CONFIG_FORM_DEFAULT_VALUES.online_payment,
  payment_for:
    configuration.paymentFor ?? configuration.payment_for ?? ONLINE_PAYMENT_CONFIG_FORM_DEFAULT_VALUES.payment_for,
})

export const buildOnlinePaymentFormData = (formState, configurationId) => {
  const payload = new FormData()

  payload.append('payment_for', normalizeText(formState.payment_for, ''))
  payload.append('online_payment', normalizeText(formState.online_payment, '0'))

  if (configurationId) {
    payload.append('configuration_id', configurationId)
  }

  return payload
}

export const filterOnlinePaymentConfigByStatus = (rows = [], statusFilter = 'all') => {
  if (statusFilter === 'all') {
    return rows
  }

  return rows.filter((row) => row.statusKey === statusFilter)
}

export const buildOnlinePaymentStatusFilters = (rows = []) => {
  const enabledCount = rows.filter((row) => row.statusKey === 'enabled').length
  const disabledCount = rows.filter((row) => row.statusKey === 'disabled').length

  return [
    { key: 'all', label: 'All Configs', count: rows.length },
    { key: 'enabled', label: 'Enabled', count: enabledCount },
    { key: 'disabled', label: 'Disabled', count: disabledCount },
  ]
}

