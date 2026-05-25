import { ExternalLink } from 'lucide-react'
import { VISA_APPLICATIONS_EMPTY_STATE, VISA_DOCUMENT_STATUS_OPTIONS } from '../constants/visaApplications.constants'
import { VisaApplicationStatusBadge } from './StatusBadge.jsx'

export function VisaApplicationDocumentsPanel({
  activeAction,
  documentReviews,
  documents,
  onDocumentReviewChange,
  onVerifyDocument,
  requiredCount = 0,
}) {
  return (
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <header className="flex flex-col gap-3 border-b border-[#2d282b] px-5 py-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-white">Documents</h2>
          <p className="mt-2 text-sm text-[#8fa0bd]">
            Review uploads, leave verification notes, and approve or reject files without leaving
            the case workspace.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="inline-flex items-center rounded-full border border-[#3a3337] bg-[#211d20] px-3 py-1 text-[#c5d9f7]">
            {documents.length} uploaded
          </span>
          <span className="inline-flex items-center rounded-full border border-[#3a3337] bg-[#211d20] px-3 py-1 text-[#8fa0bd]">
            {requiredCount} required
          </span>
        </div>
      </header>

      <div className="overflow-x-auto p-5">
        <table className="w-full min-w-[940px] border-collapse overflow-hidden rounded-xl border border-[#2d282b] bg-[#100d0e]">
          <thead>
            <tr className="bg-[#171314] text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Uploaded By</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.length ? (
              documents.map((document) => {
                const review = documentReviews[document.id] ?? {
                  remarks: '',
                  status: document.reviewStatus,
                }

                return (
                  <tr
                    key={document.id}
                    className="border-t border-[#2d282b] align-top text-sm text-slate-200 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-white">{document.label}</div>
                      <div className="mt-1 text-xs text-[#8fa0bd]">{document.originalName}</div>
                      <div className="text-xs text-[#8fa0bd]">{document.fileSizeLabel}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div>{document.uploadedByName}</div>
                      <div className="mt-1 text-xs text-[#8fa0bd]">{document.createdAtLabel}</div>
                    </td>
                    <td className="px-4 py-4">
                      <VisaApplicationStatusBadge status={document.reviewStatusLabel} />
                      {document.reviewedByName && document.reviewedByName !== '-' ? (
                        <div className="mt-2 text-xs text-[#8fa0bd]">By {document.reviewedByName}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <select
                          className="h-9 w-full rounded-lg border border-[#332d30] bg-[#171314] px-3 text-sm text-white outline-none"
                          value={review.status}
                          onChange={(event) => onDocumentReviewChange(document.id, 'status', event.target.value)}
                        >
                          {VISA_DOCUMENT_STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption.value} value={statusOption.value}>
                              {statusOption.label}
                            </option>
                          ))}
                        </select>
                        <textarea
                          rows={2}
                          className="w-full rounded-lg border border-[#332d30] bg-[#171314] px-3 py-2 text-sm text-white outline-none"
                          placeholder="Enter remarks"
                          value={review.remarks}
                          onChange={(event) => onDocumentReviewChange(document.id, 'remarks', event.target.value)}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">{document.updatedAtLabel}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {document.filePath ? (
                          <a
                            href={document.filePath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#332d30] bg-[#211d20] px-3 text-xs font-bold uppercase tracking-[0.08em] text-[#c5d9f7]"
                          >
                            <ExternalLink size={14} />
                            View File
                          </a>
                        ) : null}
                        <button
                          type="button"
                          className="refund-action-button"
                          disabled={activeAction === `document-${document.id}`}
                          onClick={() => onVerifyDocument(document.id)}
                        >
                          {activeAction === `document-${document.id}` ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#8fa0bd]">
                  {VISA_APPLICATIONS_EMPTY_STATE.noDocuments}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
