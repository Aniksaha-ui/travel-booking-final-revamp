import { ArrowLeft, CheckCheck, CreditCard, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import { APP_ROUTES } from '../../../constants/routes'
import {
  ONLINE_PAYMENT_FOR_OPTIONS,
  ONLINE_PAYMENT_STATUS_OPTIONS,
} from '../constants/onlinePaymentConfig.constants'
import {
  createOnlinePaymentConfiguration,
  getOnlinePaymentConfigurationById,
  updateOnlinePaymentConfiguration,
} from '../service/onlinePaymentConfigService'
import {
  buildOnlinePaymentFormData,
  buildOnlinePaymentFormState,
  formatPaymentForLabel,
  getOnlinePaymentStatusMeta,
} from '../utils/onlinePaymentConfigUtils'

function SectionCard({ children, description, title }) {
  return (
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#8fa0bd]">{description}</p>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default function OnlinePaymentConfigFormPage({ action = 'add' }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams()
  const isEditing = action === 'update'
  const [formData, setFormData] = useState(buildOnlinePaymentFormState())
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing || !id) {
      return undefined
    }

    let mounted = true

    const loadConfiguration = async () => {
      setIsLoading(true)

      try {
        const configuration = await getOnlinePaymentConfigurationById(id)

        if (!mounted) {
          return
        }

        setFormData(buildOnlinePaymentFormState(configuration))
      } catch (error) {
        if (!mounted) {
          return
        }

        toast.error(error.message || 'Unable to load online payment configuration.')
        navigate(APP_ROUTES.onlinePaymentConfig)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadConfiguration()

    return () => {
      mounted = false
    }
  }, [id, isEditing, navigate, toast])

  const updateField = (name, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.payment_for) {
      toast.error('Please select a payment flow.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = buildOnlinePaymentFormData(formData, isEditing ? id : undefined)

      if (isEditing) {
        await updateOnlinePaymentConfiguration(payload)
        toast.success('Online payment configuration updated successfully.')
      } else {
        await createOnlinePaymentConfiguration(payload)
        toast.success('Online payment configuration created successfully.')
      }

      navigate(APP_ROUTES.onlinePaymentConfig)
    } catch (error) {
      toast.error(
        error.message ||
          `Unable to ${isEditing ? 'update' : 'create'} online payment configuration.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="routes-page">
        <div className="routes-page__inner">
          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#2d282b] bg-[#171314] text-sm font-semibold text-[#8fa0bd]">
            Loading online payment configuration...
          </div>
        </div>
      </main>
    )
  }

  const statusMeta = getOnlinePaymentStatusMeta(formData.online_payment)

  return (
    <main className="routes-page">
      <div className="routes-page__inner space-y-5">
        <header className="rounded-[28px] border border-[#2d282b] bg-[#171314] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#332d30] bg-[#211d20] text-[#c5d9f7]"
                onClick={() => navigate(APP_ROUTES.onlinePaymentConfig)}
              >
                <ArrowLeft size={16} />
              </button>

              <div>
                <div className="routes-page__title">
                  <CreditCard size={20} color="#4f83ff" />
                  <h1>{isEditing ? 'Update Payment Configuration' : 'Add Payment Configuration'}</h1>
                </div>
                <p className="routes-page__subtitle">
                  Control whether SSLCommerz is active for each booking flow without touching code or database records manually.
                </p>
              </div>
            </div>

            <div
              className={`inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold ${statusMeta.badgeClassName}`}
            >
              {statusMeta.label}
            </div>
          </div>
        </header>

        <form className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_360px]" onSubmit={handleSubmit}>
          <SectionCard
            title="Configuration Setup"
            description="Choose the booking flow this rule applies to and decide whether online payment is available."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="crud-field">
                <span>Payment For</span>
                <select
                  name="payment_for"
                  value={formData.payment_for}
                  onChange={(event) => updateField('payment_for', event.target.value)}
                >
                  <option value="">Select payment flow</option>
                  {ONLINE_PAYMENT_FOR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="crud-field">
                <span>Online Payment</span>
                <select
                  name="online_payment"
                  value={formData.online_payment}
                  onChange={(event) => updateField('online_payment', event.target.value)}
                >
                  {ONLINE_PAYMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#332d30] bg-[#211d20] px-5 text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5"
                onClick={() => navigate(APP_ROUTES.onlinePaymentConfig)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-500/30 bg-[linear-gradient(135deg,rgba(37,99,235,0.24),rgba(8,47,73,0.4))] px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isSubmitting}
              >
                <Save size={16} />
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Configuration' : 'Create Configuration'}
              </button>
            </div>
          </SectionCard>

          <div className="space-y-5">
            <SectionCard
              title="Rule Preview"
              description="A quick summary of how this configuration will behave after saving."
            >
              <div className="space-y-3">
                <div className="rounded-[18px] border border-[#332d30] bg-[#211d20] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
                    Payment Flow
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatPaymentForLabel(formData.payment_for)}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#332d30] bg-[#211d20] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7ea1ff]">
                    Availability
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">{statusMeta.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#8fa0bd]">{statusMeta.description}</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Ops Note"
              description="Use one record per payment flow so support and finance teams can clearly see what is live."
            >
              <div className="rounded-[18px] border border-[#332d30] bg-[#211d20] px-4 py-4 text-sm leading-6 text-[#8fa0bd]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-200">
                    <CheckCheck size={16} />
                  </span>
                  <p>
                    Enabling online payment here makes that booking flow eligible for gateway-based
                    checkout. Disabling it keeps the flow available, but customers will need an
                    offline payment method instead.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </form>
      </div>
    </main>
  )
}

