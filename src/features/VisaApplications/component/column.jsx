import { VisaApplicationStatusBadge, VisaPaymentStatusBadge } from './StatusBadge.jsx'

export const visaApplicationsColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    id: 'applicationNo',
    label: 'Application No',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.applicationNoLabel}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">Passport: {item.passportNo}</div>
      </div>
    ),
    width: '190px',
  },
  {
    id: 'applicant',
    label: 'Applicant',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.fullName}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{item.email}</div>
        <div className="text-xs text-[#8fa0bd]">{item.phone}</div>
      </div>
    ),
    width: '220px',
  },
  {
    id: 'packageTitle',
    label: 'Package',
    render: (item) => (
      <div>
        <div className="text-white">{item.packageTitle}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{item.packageSubtitle}</div>
      </div>
    ),
    width: '210px',
  },
  {
    accessor: 'countryName',
    id: 'country',
    label: 'Country',
    width: '150px',
  },
  {
    id: 'status',
    label: 'Status',
    render: (item) => <VisaApplicationStatusBadge status={item.statusLabel} />,
    width: '140px',
  },
  {
    id: 'paymentStatus',
    label: 'Payment',
    render: (item) => <VisaPaymentStatusBadge status={item.paymentStatusLabel} />,
    width: '130px',
  },
  {
    accessor: 'assignedOfficerName',
    id: 'assignedOfficer',
    label: 'Assigned Officer',
    width: '170px',
  },
  {
    accessor: 'createdAtLabel',
    id: 'createdAt',
    label: 'Submitted',
    width: '130px',
  },
]
