import { useEffect } from 'react'
import { Globe2, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import {
  VISA_COUNTRY_FORM_COPY,
  VISA_COUNTRY_FORM_DEFAULT_VALUES,
} from '../constants/visaCountries.constants'
import { toVisaCountryFormValues } from '../utils/visaCountriesUtils'

const requiredTextRule = (label) => ({
  required: `${label} is required.`,
  validate: (value) => String(value ?? '').trim().length > 0 || `${label} is required.`,
})

export function VisaCountryFormModal({
  country,
  isLoading = false,
  isMutating = false,
  mode = 'create',
  onClose,
  onSubmit,
}) {
  const isEdit = mode === 'edit'
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: VISA_COUNTRY_FORM_DEFAULT_VALUES,
    mode: 'onBlur',
  })

  useEffect(() => {
    reset(isEdit ? toVisaCountryFormValues(country) : VISA_COUNTRY_FORM_DEFAULT_VALUES)
  }, [country, isEdit, reset])

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close visa country form" onClick={onClose} />

      <form className="crud-modal__panel" style={{ width: 'min(760px, 100%)' }} onSubmit={handleSubmit(onSubmit)}>
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">
              {isEdit ? VISA_COUNTRY_FORM_COPY.editEyebrow : VISA_COUNTRY_FORM_COPY.createEyebrow}
            </p>
            <h2>{isEdit ? VISA_COUNTRY_FORM_COPY.editTitle : VISA_COUNTRY_FORM_COPY.createTitle}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center p-6 text-sm font-semibold text-[#8fa0bd]">
            Loading visa country details...
          </div>
        ) : (
          <div className="max-h-[72vh] overflow-y-auto p-5">
            <section className="rounded-xl border border-[#2d282b] bg-[#171314] p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-200">
                  <Globe2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Country Information</h3>
                  <p className="mt-1 text-sm text-[#8fa0bd]">
                    Keep the core country label and ISO code aligned with the visa catalog.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="crud-field">
                  <span>Country Name</span>
                  <input
                    type="text"
                    placeholder="Enter country name"
                    {...register('name', requiredTextRule('Country name'))}
                  />
                  {errors.name ? <small>{errors.name.message}</small> : null}
                </label>

                <label className="crud-field">
                  <span>ISO Code</span>
                  <input
                    type="text"
                    placeholder="Enter ISO code"
                    {...register('iso_code', requiredTextRule('ISO code'))}
                  />
                  {errors.iso_code ? <small>{errors.iso_code.message}</small> : null}
                </label>
              </div>
            </section>

            {isEdit ? (
              <section className="mt-4 rounded-xl border border-[#2d282b] bg-[#171314] p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-500/20 bg-slate-500/10 text-slate-200">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Update Scope</h3>
                    <p className="mt-1 text-sm text-[#8fa0bd]">
                      This update flow matches the legacy admin module and only edits the country name and ISO code.
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <>
                <section className="mt-4 rounded-xl border border-[#2d282b] bg-[#171314] p-5">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-200">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Create Settings</h3>
                      <p className="mt-1 text-sm text-[#8fa0bd]">
                        These fields are only available when creating a new visa country, just like the original module.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="crud-field md:col-span-2">
                      <span>Flag URL</span>
                      <input type="text" placeholder="Enter flag URL" {...register('flag')} />
                    </label>

                    <label className="flex items-start gap-3 rounded-lg border border-[#332d30] bg-[#211d20] p-4">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-[#40537a] bg-[#171314] text-blue-500"
                        {...register('is_popular')}
                      />
                      <span className="min-w-0">
                        <strong className="block text-sm text-white">Popular Country</strong>
                        <small className="mt-1 block text-xs font-medium text-[#8fa0bd]">Mark as popular</small>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 rounded-lg border border-[#332d30] bg-[#211d20] p-4">
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
              </>
            )}
          </div>
        )}

        <footer className="crud-modal__footer">
          <button type="button" className="crud-button crud-button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="crud-button crud-button--primary"
            disabled={isLoading || isSubmitting || isMutating}
          >
            {isLoading ? 'Loading...' : isSubmitting || isMutating ? 'Saving...' : VISA_COUNTRY_FORM_COPY.submitLabel}
          </button>
        </footer>
      </form>
    </div>
  )
}
