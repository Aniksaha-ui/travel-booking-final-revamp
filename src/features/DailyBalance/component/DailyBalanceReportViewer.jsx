import { Download, ExternalLink, FileText } from 'lucide-react'

export function DailyBalanceReportViewer({ onClose, report }) {
  const canPreview = Boolean(report?.fileUrl)

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close report viewer" onClick={onClose} />
      <section className="crud-modal__panel" style={{ width: 'min(1180px, 100%)' }}>
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Archived Report</p>
            <h2>{report?.reportName ?? 'Daily balance report'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="border-t border-[#2d282b] p-4 sm:p-5">
          {canPreview ? (
            <div className="overflow-hidden rounded-lg border border-[#332d30] bg-[#100d0e]">
              <iframe
                src={report.fileUrl}
                title={report.reportName}
                className="h-[60vh] w-full sm:h-[72vh]"
                style={{ border: 0 }}
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-[#332d30] bg-[#171314] px-6 text-center">
              <FileText size={28} className="text-[#7ea1ff]" />
              <p className="mt-4 text-base font-semibold text-white">Preview unavailable</p>
              <p className="mt-2 text-sm text-[#8fa0bd]">
                This report does not include a previewable file path.
              </p>
            </div>
          )}
        </div>

        <footer className="crud-modal__footer">
          {canPreview ? (
            <a
              href={report.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#1e40af] bg-[#17214a] px-3 text-sm font-semibold text-[#bfdbfe]"
            >
              <ExternalLink size={16} />
              Open
            </a>
          ) : null}
          {canPreview ? (
            <a
              href={report.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#332d30] bg-[#211d20] px-3 text-sm font-semibold text-[#c5d9f7]"
            >
              <Download size={16} />
              Download
            </a>
          ) : null}
        </footer>
      </section>
    </div>
  )
}
