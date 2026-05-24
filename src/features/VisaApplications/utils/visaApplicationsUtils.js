import dayjs from 'dayjs'
import { APP_CONFIG } from '../../../services/config'
import {
  DEFAULT_ADMIN_UPDATE_DATA,
  DEFAULT_ASSIGNMENT_DATA,
  DEFAULT_STATUS_DATA,
  VISA_APPLICATIONS_EMPTY_STATE,
} from '../constants/visaApplications.constants'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

const fileSizeFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

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

export const formatVisaStatusLabel = (value) =>
  normalizeText(value, '')
    .split('_')
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ') || '-'

const formatDateLabel = (value, fallback = '-') => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY') : normalizeText(value, fallback)
}

const formatDateTimeLabel = (value, fallback = '-') => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('DD MMM YYYY, hh:mm A') : normalizeText(value, fallback)
}

const formatFeeLabel = (amount, currency) => {
  const normalizedCurrency = normalizeText(currency, '')

  if (!normalizedCurrency) {
    return currencyFormatter.format(toNumber(amount))
  }

  return `${currencyFormatter.format(toNumber(amount))} ${normalizedCurrency}`
}

const formatPaymentAmount = (amount, currency) => {
  const normalizedCurrency = normalizeText(currency, '')

  if (!normalizedCurrency) {
    return currencyFormatter.format(toNumber(amount))
  }

  return `${normalizedCurrency} ${currencyFormatter.format(toNumber(amount))}`
}

const formatFileSize = (value) => {
  const bytes = toNumber(value)

  if (!bytes) {
    return '-'
  }

  return `${fileSizeFormatter.format(bytes / 1024)} KB`
}

export const getVisaStatusToneClassName = (status) => {
  const normalizedStatus = normalizeText(status, '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  switch (normalizedStatus) {
    case 'approved':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
    case 'submitted':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-200'
    case 'under_review':
      return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200'
    case 'document_pending':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-200'
    case 'processing':
      return 'border-indigo-500/20 bg-indigo-500/10 text-indigo-200'
    case 'rejected':
      return 'border-rose-500/20 bg-rose-500/10 text-rose-200'
    default:
      return 'border-slate-500/20 bg-slate-500/10 text-slate-200'
  }
}

export const getPaymentStatusToneClassName = (status) => {
  const normalizedStatus = normalizeText(status, '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  switch (normalizedStatus) {
    case 'paid':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
    case 'partial':
      return 'border-cyan-500/20 bg-cyan-500/10 text-cyan-200'
    case 'pending':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-200'
    case 'unpaid':
      return 'border-rose-500/20 bg-rose-500/10 text-rose-200'
    default:
      return 'border-slate-500/20 bg-slate-500/10 text-slate-200'
  }
}

export const buildVisaApplicationFileUrl = (path) => {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const baseUrl = APP_CONFIG.imageBaseUrl.replace(/\/+$/, '')
  const normalizedPath = String(path).startsWith('/') ? path : `/${path}`
  return `${baseUrl}${normalizedPath}`
}

export const normalizeOfficer = (user = {}) => {
  const roleLabel =
    normalizeText(user.role, '') ||
    normalizeText(user.user_role, '') ||
    normalizeText(user.roles?.[0]?.name, '')

  return {
    id: user.id ?? user.user_id ?? '',
    label: roleLabel ? `${normalizeText(user.name, 'Unknown User')} (${roleLabel})` : normalizeText(user.name, 'Unknown User'),
    name: normalizeText(user.name, 'Unknown User'),
    roleLabel: roleLabel || '-',
  }
}

export const normalizeVisaApplication = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const status = normalizeText(item.status, 'draft').toLowerCase()
  const paymentStatus = normalizeText(item.payment_status, 'unpaid').toLowerCase()

  return {
    applicationNoLabel: normalizeText(item.application_no, `APP-${serial}`),
    assignedOfficerName: normalizeText(item.assigned_officer_name, VISA_APPLICATIONS_EMPTY_STATE.assignedOfficer),
    countryName: normalizeText(item.country_name),
    createdAtLabel: formatDateLabel(item.created_at ?? item.applied_at),
    email: normalizeText(item.email),
    fullName: normalizeText(item.full_name, 'Unknown Applicant'),
    id: item.id ?? `visa-application-${serial}`,
    isAssigned: Boolean(item.assigned_officer_name || item.assigned_to),
    packageSubtitle: normalizeText(item.visa_type),
    packageTitle: normalizeText(item.package_title ?? item.visa_name),
    passportNo: normalizeText(item.passport_no),
    paymentStatus,
    paymentStatusLabel: formatVisaStatusLabel(paymentStatus),
    phone: normalizeText(item.phone),
    serial,
    status,
    statusLabel: formatVisaStatusLabel(status),
    visaName: normalizeText(item.visa_name),
  }
}

const normalizeRequiredDocument = (document = {}) => ({
  id: document.id ?? document.document_key ?? document.document_label ?? Math.random().toString(16).slice(2),
  label: normalizeText(document.document_label ?? document.document_key),
})

const normalizeVisaDocument = (document = {}) => {
  const status = normalizeText(document.verification_status, 'pending').toLowerCase()

  return {
    createdAtLabel: formatDateLabel(document.created_at),
    filePath: buildVisaApplicationFileUrl(document.file_path),
    fileSizeLabel: formatFileSize(document.file_size),
    id: document.id ?? `${document.document_key ?? 'document'}-${document.original_name ?? ''}`,
    label: normalizeText(document.document_label ?? document.document_key),
    originalName: normalizeText(document.original_name),
    reviewedByName: normalizeText(document.reviewed_by_name, ''),
    remarks: normalizeText(document.remarks, ''),
    reviewStatus: status,
    reviewStatusLabel: formatVisaStatusLabel(status),
    updatedAtLabel: formatDateTimeLabel(document.updated_at),
    uploadedByName: normalizeText(document.uploaded_by_name),
  }
}

const normalizeStatusLog = (log = {}) => ({
  changedByName: normalizeText(log.changed_by_name),
  createdAtLabel: formatDateTimeLabel(log.created_at),
  id: log.id ?? `${log.old_status ?? 'status'}-${log.created_at ?? Math.random().toString(16).slice(2)}`,
  newStatusLabel: formatVisaStatusLabel(log.new_status),
  note: normalizeText(log.note),
  oldStatusLabel: formatVisaStatusLabel(log.old_status),
})

const normalizePayment = (payment = {}, fallbackCurrency = '') => {
  const status = normalizeText(payment.payment_status, 'paid').toLowerCase()
  const currency =
    normalizeText(payment.currency, '') ||
    normalizeText(payment.currency_snapshot, '') ||
    normalizeText(fallbackCurrency, '')

  return {
    amountLabel: formatPaymentAmount(payment.amount, currency),
    createdAtLabel: formatDateTimeLabel(payment.created_at),
    id: payment.id ?? `${payment.transaction_reference ?? payment.transaction_id ?? Math.random().toString(16).slice(2)}`,
    methodLabel: normalizeText(payment.payment_method),
    referenceLabel: normalizeText(payment.transaction_reference ?? payment.transaction_id),
    status,
    statusLabel: formatVisaStatusLabel(status),
  }
}

export const normalizeVisaApplicationDetails = (item = {}) => {
  const base = normalizeVisaApplication(item, 0, { from: 0 })
  const applicantInfo = item.applicant_info ?? {}
  const requiredDocuments = Array.isArray(item.required_documents) ? item.required_documents : []
  const documents = Array.isArray(item.documents) ? item.documents : []
  const statusLogs = Array.isArray(item.status_logs) ? item.status_logs : []
  const payments = Array.isArray(item.payments) ? item.payments : []

  return {
    ...base,
    adminNote: normalizeText(item.admin_note, VISA_APPLICATIONS_EMPTY_STATE.adminNote),
    applicantAddress: normalizeText(item.present_address ?? applicantInfo.address),
    applicantDateOfBirth: normalizeText(item.date_of_birth ?? applicantInfo.date_of_birth),
    applicantEmail: normalizeText(item.email ?? applicantInfo.email),
    applicantGender: formatVisaStatusLabel(item.gender),
    applicantNationality: normalizeText(item.nationality ?? applicantInfo.nationality),
    applicantPhone: normalizeText(item.phone ?? applicantInfo.phone),
    appliedAtLabel: formatDateTimeLabel(item.applied_at ?? item.created_at),
    assignedTo: item.assigned_to ? String(item.assigned_to) : '',
    documents: documents.map(normalizeVisaDocument),
    feeSnapshotLabel: formatFeeLabel(item.fee_snapshot, item.currency_snapshot),
    passportExpiryLabel: normalizeText(item.passport_expiry_date ?? applicantInfo.passport_expiry),
    payments: payments.map((payment) => normalizePayment(payment, item.currency_snapshot)),
    processingDaysLabel: normalizeText(item.processing_days_snapshot),
    requiredDocuments: requiredDocuments.map(normalizeRequiredDocument),
    statusLogs: statusLogs.map(normalizeStatusLog),
    travelDateLabel: normalizeText(item.travel_date, VISA_APPLICATIONS_EMPTY_STATE.travelDate),
    travelPurpose: normalizeText(item.travel_purpose),
    userEmail: normalizeText(item.user_email),
    userName: normalizeText(item.user_name),
    visaPackageDescription: normalizeText(item.package_description),
  }
}

export const buildDocumentReviewState = (documents = []) =>
  documents.reduce((collection, document) => {
    collection[document.id] = {
      remarks: document.remarks && document.remarks !== '-' ? document.remarks : '',
      status: document.reviewStatus || 'pending',
    }

    return collection
  }, {})

export const buildApplicationFormState = (application) => ({
  adminUpdateData: {
    ...DEFAULT_ADMIN_UPDATE_DATA,
    assigned_to: application?.assignedTo ?? '',
    remarks: application?.adminNote && application.adminNote !== VISA_APPLICATIONS_EMPTY_STATE.adminNote ? application.adminNote : '',
  },
  assignmentData: {
    ...DEFAULT_ASSIGNMENT_DATA,
    officer_id: application?.assignedTo ?? '',
  },
  documentReviews: buildDocumentReviewState(application?.documents ?? []),
  statusData: {
    ...DEFAULT_STATUS_DATA,
    remarks: application?.adminNote && application.adminNote !== VISA_APPLICATIONS_EMPTY_STATE.adminNote ? application.adminNote : '',
    status: application?.status ?? '',
  },
})

export const buildVisaApplicationMetrics = (rows = []) => {
  const assignedCount = rows.filter((row) => row.isAssigned).length
  const paidCount = rows.filter((row) => row.paymentStatus === 'paid').length
  const inProgressCount = rows.filter((row) =>
    ['submitted', 'under_review', 'document_pending', 'processing'].includes(row.status),
  ).length

  return {
    assignedCount,
    inProgressCount,
    paidCount,
    totalCount: rows.length,
  }
}
