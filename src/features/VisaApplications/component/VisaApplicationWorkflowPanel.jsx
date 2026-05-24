import { VISA_APPLICATION_STATUS_OPTIONS } from '../constants/visaApplications.constants'

function ActionCard({ children, title }) {
  return (
    <article className="rounded-xl border border-[#332d30] bg-[#211d20] p-4">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </article>
  )
}

export function VisaApplicationWorkflowPanel({
  activeAction,
  adminUpdateData,
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
  return (
    <section className="rounded-xl border border-[#2d282b] bg-[#171314] shadow-[0_14px_36px_rgba(0,0,0,0.2)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">Workflow Actions</h2>
      </header>

      <div className="grid gap-4 p-5 lg:grid-cols-3">
        <ActionCard title="Assign Officer">
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

        <ActionCard title="Save Admin Update">
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

        <ActionCard title="Update Status">
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
