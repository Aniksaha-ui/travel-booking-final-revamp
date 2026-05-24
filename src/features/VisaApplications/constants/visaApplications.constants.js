export const VISA_APPLICATIONS_PAGE_COPY = {
  title: 'Visa Applications',
  subtitle:
    'Track submitted visa cases, payment status, assigned officers, and review progress across the application pipeline.',
  searchPlaceholder: 'Search by application no, passport, applicant, package, country, or officer',
}

export const VISA_APPLICATIONS_EMPTY_STATE = {
  adminNote: 'No admin note',
  assignedOfficer: 'Not assigned',
  noApplications: 'No visa applications found.',
  noDocuments: 'No documents uploaded yet.',
  noLogs: 'No status logs found.',
  noPayments: 'No payments found.',
  noRequirements: 'No required documents listed.',
  travelDate: 'Not set',
}

export const VISA_APPLICATION_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'document_pending', label: 'Document Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export const VISA_DOCUMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

export const VISA_APPLICATION_SUCCESS_MESSAGES = {
  adminUpdate: 'Visa application updated successfully.',
  assign: 'Visa application assigned successfully.',
  document: 'Visa document reviewed successfully.',
  status: 'Visa application status updated successfully.',
}

export const DEFAULT_ASSIGNMENT_DATA = {
  officer_id: '',
  remarks: 'Assigned to visa officer',
}

export const DEFAULT_ADMIN_UPDATE_DATA = {
  assigned_to: '',
  remarks: '',
}

export const DEFAULT_STATUS_DATA = {
  remarks: '',
  status: '',
}
