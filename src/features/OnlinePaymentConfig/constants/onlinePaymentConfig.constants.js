export const ONLINE_PAYMENT_CONFIG_PAGE_COPY = {
  title: 'Online Payment Configure',
  subtitle:
    'Manage which booking flows allow online payment, keep SSLCommerz availability in sync, and control payment coverage from one admin page.',
  searchPlaceholder: 'Search by payment flow, status, or configuration ID',
  newButtonLabel: 'Add Configuration',
}

export const ONLINE_PAYMENT_FOR_OPTIONS = [
  { value: 'trip', label: 'Trip' },
  { value: 'package', label: 'Package' },
  { value: 'hotel', label: 'Hotel' },
]

export const ONLINE_PAYMENT_STATUS_OPTIONS = [
  { value: '1', label: 'Enabled' },
  { value: '0', label: 'Disabled' },
]

export const ONLINE_PAYMENT_CONFIG_FORM_DEFAULT_VALUES = {
  online_payment: '0',
  payment_for: '',
}

export const ONLINE_PAYMENT_CONFIG_EMPTY_STATE = {
  noConfigurations: 'No payment configurations found.',
  noPaymentFor: 'No payment flow selected',
}

