import { useEffect } from 'react'
import { FileText, Landmark, TimerReset } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { VISA_TYPE_FORM_COPY, VISA_TYPE_FORM_DEFAULT_VALUES } from '../constants/visaTypes.constants'
import { toVisaTypeFormValues } from '../utils/visaTypesUtils'

const requiredTextRule = (label) => ({
  required: `${label} is required.`,
  validate: (value) => String(value ?? '').trim().length > 0 || `${label} is required.`,
})

const positiveNumberRule = (label) => ({
  required: `${label} is required.`,
  validate: (value) => {
    const parsedValue = Number(value)

    if (!Number.isFinite(parsedValue)) {
      return `${label} is required.`
    }

    return parsedValue >= 0 || `${label} must be zero or greater.`
  },
})

const getCountryOptionId = (country) => country.id ?? country.country_id ?? ''
const getCountryOptionLabel = (country) => country.name ?? country.country_name ?? `Country ${getCountryOptionId(country)}`

export function VisaTypeFormModal({
  countries,
  countriesLoading = false,
  isLoading = false,
  isMutating = false,
  mode = 'create',
  onClose,
  onSubmit,
  visaType,
}) {
  const isEdit = mode === 'edit'
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: VISA_TYPE_FORM_DEFAULT_VALUES,
    mode: 'onBlur',
  })

  useEffect(() => {
    reset(isEdit ? toVisaTypeFormValues(visaType) : VISA_TYPE_FORM_DEFAULT_VALUES)
  }, [isEdit, reset, visaType])

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close visa type form" onClick={onClose} />

      <form className="crud-modal__panel" style={{ width: 'min(840px, 100%)' }} onSubmit={handleSubmit(onSubmit)}>
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">
              {isEdit ? VISA_TYPE_FORM_COPY.editEyebrow : VISA_TYPE_FORM_COPY.createEyebrow}
            </p>
            <h2>{isEdit ? VISA_TYPE_FORM_COPY.editTitle : VISA_TYPE_FORM_COPY.createTitle}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center p-6 text-sm font-semibold text-[#8fa0bd]">
            Loading visa type details...
          </div>
        ) : (
          <div className="max-h-[72vh] overflow-y-auto p-5">
            <section className="rounded-xl border border-[#2d282b] bg-[#171314] p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-200">
                  <Landmark size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Country & Visa Setup</h3>
                  <p className="mt-1 text-sm text-[#8fa0bd]">
                    Attach the visa type to the correct country and label the offering travelers will see.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="crud-field">
                  <span>Country</span>
                  <select {...register('country_id', requiredTextRule('Country'))} disabled={countriesLoading}>
                    <option value="">{countriesLoading ? 'Loading countries...' : 'Select Country'}</option>
                    {countries.map((country) => (
                      <option key={getCountryOptionId(country)} value={String(getCountryOptionId(country))}>
                        {getCountryOptionLabel(country)}
                      </option>
                    ))}
                  </select>
                  {errors.country_id ? <small>{errors.country_id.message}</small> : null}
                </label>

                <label className="crud-field">
                  <span>Visa Name</span>
                  <input
                    type="text"
                    placeholder="Enter visa name"
                    {...register('visa_name', requiredTextRule('Visa name'))}
                  />
                  {errors.visa_name ? <small>{errors.visa_name.message}</small> : null}
                </label>
              </div>
            </section>

            <section className="mt-4 rounded-xl border border-[#2d282b] bg-[#171314] p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                  <TimerReset size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Pricing & Processing</h3>
                  <p className="mt-1 text-sm text-[#8fa0bd]">
                    Set the published fee and expected processing time for this visa type.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="crud-field">
                  <span>Processing Days</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter processing days"
                    {...register('processing_days', positiveNumberRule('Processing days'))}
                  />
                  {errors.processing_days ? <small>{errors.processing_days.message}</small> : null}
                </label>

                <label className="crud-field">
                  <span>Fee</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter fee amount"
                    {...register('fee', positiveNumberRule('Fee'))}
                  />
                  {errors.fee ? <small>{errors.fee.message}</small> : null}
                </label>
              </div>
            </section>

            <section className="mt-4 rounded-xl border border-[#2d282b] bg-[#171314] p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Publishing Details</h3>
                  <p className="mt-1 text-sm text-[#8fa0bd]">
                    Add internal notes and control whether this visa type is active in the catalog.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="crud-field md:col-span-2">
                  <span>Description</span>
                  <textarea rows={4} placeholder="Enter description" {...register('description')} />
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-[#332d30] bg-[#211d20] p-4 md:col-span-2">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-[#40537a] bg-[#171314] text-blue-500"
                    {...register('status')}
                  />
                  <span className="min-w-0">
                    <strong className="block text-sm text-white">Status</strong>
                    <small className="mt-1 block text-xs font-medium text-[#8fa0bd]">Active</small>
                  </span>
                </label>
              </div>
            </section>
          </div>
        )}

        <footer className="crud-modal__footer">
          <button type="button" className="crud-button crud-button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="crud-button crud-button--primary"
            disabled={countriesLoading || isLoading || isSubmitting || isMutating}
          >
            {countriesLoading || isLoading
              ? 'Loading...'
              : isSubmitting || isMutating
                ? 'Saving...'
                : VISA_TYPE_FORM_COPY.submitLabel}
          </button>
        </footer>
      </form>
    </div>
  )
}
