import { CheckCircle2, ClipboardCheck, FileWarning, FolderOpen, ShieldCheck, UserRoundCheck } from 'lucide-react'

export function VisaApplicationReviewGuide({ application, onOpenDocuments, onOpenWorkflow }) {
  const uploaded = application.documents.length
  const required = application.requiredDocuments.length
  const reviewed = application.documents.filter((document) => document.reviewStatus !== 'pending').length
  const missing = Math.max(required - uploaded, 0)
  const reviewComplete = uploaded > 0 && reviewed === uploaded && missing === 0
  const steps = [
    { label: 'Submitted', done: !['draft'].includes(application.status) },
    { label: 'Documents', done: reviewComplete, active: !reviewComplete },
    { label: 'Processing', done: ['processing', 'approved'].includes(application.status), active: application.status === 'processing' },
    { label: 'Decision', done: ['approved', 'rejected'].includes(application.status), active: ['approved', 'rejected'].includes(application.status) },
  ]

  return <section className="space-y-3">
    <article className="rounded-2xl border border-[#31384c] bg-[#171314] p-5 shadow-[0_18px_38px_rgba(0,0,0,.18)]"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[.12em] text-[#7ea1ff]">Case progress</p><p className="mt-1 text-sm text-[#9fb2d0]">Follow the application from submission through the final decision.</p></div><span className="rounded-full border border-[#3a3337] bg-[#211d20] px-3 py-1.5 text-xs font-bold text-[#c5d9f7]">Current: {application.statusLabel}</span></div><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{steps.map((step, index) => <div key={step.label} className="relative"><div className={`flex items-center gap-2 ${step.done ? 'text-emerald-200' : step.active ? 'text-blue-200' : 'text-[#71809a]'}`}><span className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black ${step.done ? 'border-emerald-400/30 bg-emerald-400/15' : step.active ? 'border-blue-400/40 bg-blue-500/20' : 'border-[#3a414f] bg-[#211d20]'}`}>{step.done ? <CheckCircle2 size={16} /> : index + 1}</span><span className="text-sm font-bold">{step.label}</span></div></div>)}</div></article>
    <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr_1fr]">
    <article className="rounded-2xl border border-blue-500/25 bg-[linear-gradient(135deg,rgba(30,64,175,.30),rgba(23,19,20,1))] p-5 shadow-[0_18px_38px_rgba(0,0,0,.18)]">
      <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[.1em] text-blue-200">Next step</p><h2 className="mt-2 text-lg font-black text-white">{missing ? 'Request missing documents' : reviewed < uploaded ? 'Review uploaded documents' : reviewComplete ? 'Documents are ready' : 'Check application documents'}</h2><p className="mt-2 text-sm leading-6 text-blue-100/75">{missing ? `${missing} required document${missing === 1 ? '' : 's'} still need to be uploaded.` : reviewed < uploaded ? `${uploaded - reviewed} uploaded document${uploaded - reviewed === 1 ? '' : 's'} still need a decision.` : 'Open the document checklist to confirm the case is ready to progress.'}</p></div><ClipboardCheck className="shrink-0 text-blue-200" size={25} /></div>
      <button type="button" onClick={onOpenDocuments} className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-bold text-white hover:bg-blue-400"><FolderOpen size={16} />Review documents</button>
    </article>
    <article className="rounded-2xl border border-[#332d30] bg-[#171314] p-5"><div className="flex items-center justify-between"><p className="text-sm font-bold text-white">Document checklist</p>{missing ? <FileWarning size={19} className="text-amber-300" /> : <ShieldCheck size={19} className="text-emerald-300" />}</div><p className="mt-4 text-3xl font-black text-white">{uploaded}<span className="text-base font-semibold text-[#8fa0bd]"> / {required || '—'}</span></p><p className="mt-2 text-sm text-[#8fa0bd]">uploaded / required</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#2a2528]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${required ? Math.min((uploaded / required) * 100, 100) : uploaded ? 100 : 0}%` }} /></div></article>
    <article className="rounded-2xl border border-[#332d30] bg-[#171314] p-5"><div className="flex items-center gap-2"><UserRoundCheck size={18} className="text-blue-300" /><p className="text-sm font-bold text-white">Case ownership</p></div><p className="mt-4 truncate text-lg font-black text-white">{application.assignedOfficerName}</p><p className="mt-2 text-sm text-[#8fa0bd]">Current officer</p><button type="button" onClick={onOpenWorkflow} className="mt-4 inline-flex rounded-lg bg-[#211d20] px-3 py-2 text-sm font-bold text-blue-300 hover:bg-[#2a2528] hover:text-blue-200">Manage workflow →</button></article>
    </div>
  </section>
}
