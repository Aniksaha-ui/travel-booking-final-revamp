import {
  formatVisaStatusLabel,
  getVisaStatusToneClassName,
} from '../utils/visaApplicationsUtils'
import { VISA_APPLICATION_STATUS_OPTIONS } from '../constants/visaApplications.constants'

function ActionCard({ children, description, title }) {
  return (
    <article className="rounded-[22px] border border-[#332d30] bg-[#211d20] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)]">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-[#8fa0bd]">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </article>
  )
}

export function VisaApplicationWorkflowPanel({
  activeAction,
  adminUpdateData,
  application,
  assignmentData,
  officers,
  onAdminUpdate,
  onAdminUpdateChange,
  onAssign,
  onAssignmentChange,
  onStatusChange,
  onStatusUpdate,
  statusData,
}) {
  const selectedStatus = statusData.status || application.status
  const hasStagedStatus = selectedStatus !== application.status

  return (
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <header className="flex flex-col gap-3 border-b border-[#2d282b] px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Workflow Actions</h2>
          <p className="mt-2 text-sm text-[#8fa0bd]">
            Assign responsibility, capture internal notes, and confirm the next workflow step for
            this case.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="inline-flex items-center rounded-full border border-[#3a3337] bg-[#211d20] px-3 py-1 text-[#c5d9f7]">
            Owner: {application.assignedOfficerName}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 ${getVisaStatusToneClassName(
              selectedStatus,
            )}`}
          >
            {hasStagedStatus ? 'Staged' : 'Selected'}: {formatVisaStatusLabel(selectedStatus)}
          </span>
        </div>
      </header>

      <div className="grid gap-4 p-5 xl:grid-cols-3">
        <ActionCard
          description="Pick the officer who should actively own the next touchpoint on this case."
          title="Assign Officer"
        >
          <label className="crud-field">
            <span>Officer</span>
            <select name="officer_id" value={assignmentData.officer_id} onChange={onAssignmentChange}>
              <option value="">Select officer</option>
              {officers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.label}
                </option>
              ))}
            </select>
          </label>
          <label className="crud-field">
            <span>Remarks</span>
            <textarea
              rows={3}
              name="remarks"
              placeholder="Enter remarks"
              value={assignmentData.remarks}
              onChange={onAssignmentChange}
            />
          </label>
          <button
            type="button"
            className="refund-action-button"
            onClick={onAssign}
            disabled={activeAction === 'assign'}
          >
            {activeAction === 'assign' ? 'Assigning...' : 'Assign Officer'}
          </button>
        </ActionCard>

        <ActionCard
          description="Keep the internal desk notes and assignment context in sync for the team."
          title="Save Admin Update"
        >
          <label className="crud-field">
            <span>Officer</span>
            <select name="assigned_to" value={adminUpdateData.assigned_to} onChange={onAdminUpdateChange}>
              <option value="">Select officer</option>
              {officers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.label}
                </option>
              ))}
            </select>
          </label>
          <label className="crud-field">
            <span>Admin Note</span>
            <textarea
              rows={3}
              name="remarks"
              placeholder="Enter remarks"
              value={adminUpdateData.remarks}
              onChange={onAdminUpdateChange}
            />
          </label>
          <button
            type="button"
            className="refund-action-button"
            onClick={onAdminUpdate}
            disabled={activeAction === 'update'}
          >
            {activeAction === 'update' ? 'Saving...' : 'Save Admin Update'}
          </button>
        </ActionCard>

        <ActionCard
          description="Choose the live application stage. Board selections automatically appear here."
          title="Update Status"
        >
          {hasStagedStatus ? (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-3 text-xs font-semibold leading-5 text-blue-100">
              The board has staged this application for{' '}
              <span className="font-bold">{formatVisaStatusLabel(selectedStatus)}</span>. Save below
              to make the move live.
            </div>
          ) : null}
          <label className="crud-field">
            <span>Status</span>
            <select name="status" value={statusData.status} onChange={onStatusChange}>
              <option value="">Select status</option>
              {VISA_APPLICATION_STATUS_OPTIONS.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </select>
          </label>
          <label className="crud-field">
            <span>Remarks</span>
            <textarea
              rows={3}
              name="remarks"
              placeholder="Enter remarks"
              value={statusData.remarks}
              onChange={onStatusChange}
            />
          </label>
          <button
            type="button"
            className="refund-action-button"
            onClick={onStatusUpdate}
            disabled={activeAction === 'status'}
          >
            {activeAction === 'status' ? 'Updating...' : 'Update Status'}
          </button>
        </ActionCard>
      </div>
    </section>
  )
}
