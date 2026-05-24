import { VISA_APPLICATIONS_EMPTY_STATE } from '../constants/visaApplications.constants'

function InfoField({ label, value, wide = false }) {
  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value || '-'}</p>
    </div>
  )
}

function OverviewCard({ children, title }) {
  return (
    <article className="rounded-xl border border-[#2d282b] bg-[#171314] shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </header>
      <div className="grid gap-4 p-5 md:grid-cols-2">{children}</div>
    </article>
  )
}

export function VisaApplicationOverviewPanel({ application }) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <OverviewCard title="Applicant Info">
        <InfoField label="Full Name" value={application.fullName} />
        <InfoField label="Email" value={application.applicantEmail} />
        <InfoField label="Phone" value={application.applicantPhone} />
        <InfoField label="Date of Birth" value={application.applicantDateOfBirth} />
        <InfoField label="Gender" value={application.applicantGender} />
        <InfoField label="Nationality" value={application.applicantNationality} />
        <InfoField label="Passport No" value={application.passportNo} />
        <InfoField label="Passport Expiry" value={application.passportExpiryLabel} />
        <InfoField label="Address" value={application.applicantAddress} wide />
      </OverviewCard>

      <OverviewCard title="Package Info">
        <InfoField label="Country" value={application.countryName} />
        <InfoField label="Visa Package" value={application.packageTitle} />
        <InfoField label="Visa Type" value={application.visaName} />
        <InfoField label="Processing Days" value={application.processingDaysLabel} />
        <InfoField label="Travel Date" value={application.travelDateLabel} />
        <InfoField label="Applied At" value={application.appliedAtLabel} />
        <InfoField label="Travel Purpose" value={application.travelPurpose} />
        <InfoField label="Package Description" value={application.visaPackageDescription} wide />
      </OverviewCard>

      <OverviewCard title="Assignment Info">
        <InfoField label="Assigned Officer" value={application.assignedOfficerName} />
        <InfoField label="User" value={application.userName} />
        <InfoField label="User Email" value={application.userEmail} />
        <InfoField label="Fee Snapshot" value={application.feeSnapshotLabel} />
        <InfoField label="Current Status" value={application.statusLabel} />
        <InfoField label="Payment Status" value={application.paymentStatusLabel} />
        <InfoField label="Admin Note" value={application.adminNote} wide />
        <div className="md:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Required Documents</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {application.requiredDocuments.length ? (
              application.requiredDocuments.map((document) => (
                <span
                  key={document.id}
                  className="inline-flex rounded-full border border-slate-500/20 bg-slate-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-200"
                >
                  {document.label}
                </span>
              ))
            ) : (
              <span className="text-sm text-[#8fa0bd]">{VISA_APPLICATIONS_EMPTY_STATE.noRequirements}</span>
            )}
          </div>
        </div>
      </OverviewCard>
    </section>
  )
}
