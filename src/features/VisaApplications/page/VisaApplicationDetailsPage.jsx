import {
  BriefcaseBusiness,
  CheckCheck,
  ClipboardList,
  KanbanSquare,
  RefreshCcw,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import { DashboardMetricCard } from '../../../components/ui/DashboardMetricCard'
import { APP_ROUTES } from '../../../constants/routes'
import {
  DEFAULT_ADMIN_UPDATE_DATA,
  DEFAULT_ASSIGNMENT_DATA,
  DEFAULT_STATUS_DATA,
  VISA_APPLICATION_SUCCESS_MESSAGES,
} from '../constants/visaApplications.constants'
import { VisaApplicationDetailsHeader } from '../component/VisaApplicationDetailsHeader.jsx'
import { VisaApplicationDocumentsPanel } from '../component/VisaApplicationDocumentsPanel.jsx'
import { VisaApplicationKanbanBoard } from '../component/VisaApplicationKanbanBoard.jsx'
import { VisaApplicationOverviewPanel } from '../component/VisaApplicationOverviewPanel.jsx'
import { VisaApplicationPaymentsPanel } from '../component/VisaApplicationPaymentsPanel.jsx'
import { VisaApplicationStatusLogsPanel } from '../component/VisaApplicationStatusLogsPanel.jsx'
import { VisaApplicationWorkflowPanel } from '../component/VisaApplicationWorkflowPanel.jsx'
import { VisaApplicationWorkspaceTabs } from '../component/VisaApplicationWorkspaceTabs.jsx'
import {
  assignVisaApplication,
  fetchVisaApplicationOfficers,
  getVisaApplicationById,
  printVisaApplicationPdf,
  updateVisaApplication,
  updateVisaApplicationStatus,
  verifyVisaApplicationDocument,
} from '../service/visaApplicationsService'
import { buildApplicationFormState } from '../utils/visaApplicationsUtils'

export default function VisaApplicationDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('workflow')
  const [application, setApplication] = useState(null)
  const [officers, setOfficers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPrinting, setIsPrinting] = useState(false)
  const [activeAction, setActiveAction] = useState('')
  const [assignmentData, setAssignmentData] = useState(DEFAULT_ASSIGNMENT_DATA)
  const [adminUpdateData, setAdminUpdateData] = useState(DEFAULT_ADMIN_UPDATE_DATA)
  const [statusData, setStatusData] = useState(DEFAULT_STATUS_DATA)
  const [documentReviews, setDocumentReviews] = useState({})

  const syncApplicationState = (nextApplication) => {
    setApplication(nextApplication)
    const state = buildApplicationFormState(nextApplication)
    setAssignmentData(state.assignmentData)
    setAdminUpdateData(state.adminUpdateData)
    setStatusData(state.statusData)
    setDocumentReviews(state.documentReviews)
  }

  useEffect(() => {
    let mounted = true

    const loadDetails = async () => {
      setIsLoading(true)

      try {
        const [nextApplication, nextOfficers] = await Promise.all([
          getVisaApplicationById(id),
          fetchVisaApplicationOfficers(),
        ])

        if (!mounted) {
          return
        }

        syncApplicationState(nextApplication)
        setOfficers(nextOfficers)
      } catch (error) {
        if (!mounted) {
          return
        }

        toast.error(error.message || 'Unable to load visa application details.')
        navigate(APP_ROUTES.visaApplications)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadDetails()

    return () => {
      mounted = false
    }
  }, [id, navigate, toast])

  const refreshApplication = async (message) => {
    const nextApplication = await getVisaApplicationById(id)
    syncApplicationState(nextApplication)
    if (message) {
      toast.success(message)
    }
  }

  const handleAssignmentChange = (event) => {
    const { name, value } = event.target
    setAssignmentData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleAdminUpdateChange = (event) => {
    const { name, value } = event.target
    setAdminUpdateData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleStatusChange = (event) => {
    const { name, value } = event.target
    setStatusData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleBoardStatusMove = async (nextStatus) => {
    if (!application || !nextStatus || nextStatus === application.status || activeAction === 'status') {
      return
    }

    const previousStatus = application.status

    setStatusData((currentData) => ({
      ...currentData,
      status: nextStatus,
    }))

    try {
      setActiveAction('status')
      await updateVisaApplicationStatus({
        remarks: statusData.remarks.trim(),
        status: nextStatus,
        visa_application_id: Number.parseInt(id, 10),
      })
      await refreshApplication(VISA_APPLICATION_SUCCESS_MESSAGES.status)
    } catch (error) {
      setStatusData((currentData) => ({
        ...currentData,
        status: previousStatus,
      }))
      toast.error(error.message || 'Unable to update visa application status.')
    } finally {
      setActiveAction('')
    }
  }

  const handleDocumentReviewChange = (documentId, field, value) => {
    setDocumentReviews((currentReviews) => ({
      ...currentReviews,
      [documentId]: {
        ...currentReviews[documentId],
        [field]: value,
      },
    }))
  }

  const handleAssign = async () => {
    if (!assignmentData.officer_id) {
      toast.error('Please select an officer.')
      return
    }

    try {
      setActiveAction('assign')
      await assignVisaApplication({
        remarks: assignmentData.remarks.trim(),
        officer_id: Number.parseInt(assignmentData.officer_id, 10),
        visa_application_id: Number.parseInt(id, 10),
      })
      await refreshApplication(VISA_APPLICATION_SUCCESS_MESSAGES.assign)
    } catch (error) {
      toast.error(error.message || 'Unable to assign visa application.')
    } finally {
      setActiveAction('')
    }
  }

  const handleAdminUpdate = async () => {
    if (!adminUpdateData.assigned_to) {
      toast.error('Please select an officer.')
      return
    }

    try {
      setActiveAction('update')
      await updateVisaApplication(id, {
        assigned_to: Number.parseInt(adminUpdateData.assigned_to, 10),
        remarks: adminUpdateData.remarks.trim(),
      })
      await refreshApplication(VISA_APPLICATION_SUCCESS_MESSAGES.adminUpdate)
    } catch (error) {
      toast.error(error.message || 'Unable to update visa application.')
    } finally {
      setActiveAction('')
    }
  }

  const handleStatusUpdate = async () => {
    if (!statusData.status) {
      toast.error('Please select a status.')
      return
    }

    try {
      setActiveAction('status')
      await updateVisaApplicationStatus({
        remarks: statusData.remarks.trim(),
        status: statusData.status,
        visa_application_id: Number.parseInt(id, 10),
      })
      await refreshApplication(VISA_APPLICATION_SUCCESS_MESSAGES.status)
    } catch (error) {
      toast.error(error.message || 'Unable to update visa application status.')
    } finally {
      setActiveAction('')
    }
  }

  const handleVerifyDocument = async (documentId) => {
    try {
      setActiveAction(`document-${documentId}`)
      const review = documentReviews[documentId] ?? { remarks: '', status: 'pending' }
      await verifyVisaApplicationDocument({
        remarks: review.remarks.trim(),
        status: review.status,
        visa_document_id: documentId,
      })
      await refreshApplication(VISA_APPLICATION_SUCCESS_MESSAGES.document)
    } catch (error) {
      toast.error(error.message || 'Unable to review visa document.')
    } finally {
      setActiveAction('')
    }
  }

  const handlePrint = async () => {
    try {
      setIsPrinting(true)
      const pdfBlob = await printVisaApplicationPdf(id)
      const blobUrl = URL.createObjectURL(pdfBlob)
      window.open(blobUrl, '_blank', 'noopener,noreferrer')
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (error) {
      toast.error(error.message || 'Unable to open visa application PDF.')
    } finally {
      setIsPrinting(false)
    }
  }

  const summaryCards = useMemo(() => {
    if (!application) {
      return []
    }

    const reviewedDocuments = application.documents.filter(
      (document) => document.reviewStatus !== 'pending',
    ).length
    const documentTarget = Math.max(application.documents.length, application.requiredDocuments.length)

    return [
      {
        label: 'Workflow Stage',
        value: application.statusLabel,
        icon: KanbanSquare,
        tone: 'blue',
      },
      {
        label: 'Payment Status',
        value: application.paymentStatusLabel,
        icon: BriefcaseBusiness,
        tone: application.paymentStatus === 'paid' ? 'green' : 'amber',
      },
      {
        label: 'Documents Reviewed',
        value: `${reviewedDocuments}/${documentTarget || 0}`,
        icon: ClipboardList,
        tone: reviewedDocuments === documentTarget && documentTarget ? 'emerald' : 'cyan',
      },
      {
        label: 'Timeline Entries',
        value: `${application.statusLogs.length}`,
        icon: CheckCheck,
        tone: 'emerald',
      },
    ]
  }, [application])

  if (isLoading || !application) {
    return (
      <main className="routes-page">
        <div className="routes-page__inner">
          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#2d282b] bg-[#171314] text-sm font-semibold text-[#8fa0bd]">
            Loading visa application details...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner space-y-4">
        <VisaApplicationDetailsHeader
          application={application}
          isPrinting={isPrinting}
          onBack={() => navigate(APP_ROUTES.visaApplications)}
          onPrint={handlePrint}
        />

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <DashboardMetricCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              tone={item.tone}
              value={item.value}
            />
          ))}
        </section>

        <VisaApplicationWorkspaceTabs
          activeTab={activeTab}
          application={application}
          onChange={setActiveTab}
          selectedStatus={statusData.status}
        />

        {activeTab === 'workflow' ? (
          <div className="space-y-4">
            <VisaApplicationKanbanBoard
              application={application}
              isUpdatingStatus={activeAction === 'status'}
              onMoveStatus={handleBoardStatusMove}
              selectedStatus={statusData.status}
            />

            <VisaApplicationWorkflowPanel
              activeAction={activeAction}
              adminUpdateData={adminUpdateData}
              application={application}
              assignmentData={assignmentData}
              officers={officers}
              onAdminUpdate={handleAdminUpdate}
              onAdminUpdateChange={handleAdminUpdateChange}
              onAssign={handleAssign}
              onAssignmentChange={handleAssignmentChange}
              onStatusChange={handleStatusChange}
              onStatusUpdate={handleStatusUpdate}
              statusData={statusData}
            />
          </div>
        ) : null}

        {activeTab === 'overview' ? <VisaApplicationOverviewPanel application={application} /> : null}

        {activeTab === 'documents' ? (
          <VisaApplicationDocumentsPanel
            activeAction={activeAction}
            documentReviews={documentReviews}
            documents={application.documents}
            onDocumentReviewChange={handleDocumentReviewChange}
            onVerifyDocument={handleVerifyDocument}
            requiredCount={application.requiredDocuments.length}
          />
        ) : null}

        {activeTab === 'activity' ? (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <VisaApplicationStatusLogsPanel statusLogs={application.statusLogs} />
            <VisaApplicationPaymentsPanel payments={application.payments} />
          </section>
        ) : null}

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#211d20] px-4 text-sm font-semibold text-[#c5d9f7]"
            onClick={() => navigate(APP_ROUTES.visaApplications)}
          >
            <RefreshCcw size={15} />
            Back to applications
          </button>
        </div>
      </div>
    </main>
  )
}
