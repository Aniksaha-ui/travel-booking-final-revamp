import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { PACKAGE_FORM_DEFAULT_VALUES } from '../constants/packages.constants.jsx'
import { packageFieldRules } from '../validation/packageValidation'

export function PackageFormModal({
  guideOptions,
  isMutating,
  onClose,
  onSubmit,
  optionsLoading,
  tripOptions,
}) {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: PACKAGE_FORM_DEFAULT_VALUES,
    mode: 'onBlur',
  })
  const inclusionFields = useFieldArray({
    control,
    name: 'inclusions',
  })
  const exclusionFields = useFieldArray({
    control,
    name: 'exclusions',
  })
  const pricingFields = useFieldArray({
    control,
    name: 'pricing',
  })
  const selectedImage = useWatch({
    control,
    name: 'image',
  })
  const selectedImageName = selectedImage?.[0]?.name ?? ''

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close package form" onClick={onClose} />

      <form
        className="crud-modal__panel package-form-modal__panel"
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Create record</p>
            <h2>Create Package</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="package-form-modal__body">
          <section className="package-form-section">
            <div className="package-form-section__header">
              <h3>Package Information</h3>
              <p>Define the package identity, assigned trip, guide, and cover media.</p>
            </div>

            <div className="package-form-grid">
              <label className="crud-field package-form-grid__wide">
                <span>Package Name</span>
                <input
                  type="text"
                  placeholder="Enter package name"
                  {...register('name', packageFieldRules.name)}
                />
                {errors.name ? <small>{errors.name.message}</small> : null}
              </label>

              <label className="crud-field">
                <span>Trip</span>
                <select {...register('trip_id', packageFieldRules.trip_id)} disabled={optionsLoading}>
                  <option value="">Select trip</option>
                  {tripOptions.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.trip_name ?? trip.name}
                    </option>
                  ))}
                </select>
                {errors.trip_id ? <small>{errors.trip_id.message}</small> : null}
              </label>

              <label className="crud-field">
                <span>Guide</span>
                <select {...register('guide_id')} disabled={optionsLoading}>
                  <option value="">Select guide</option>
                  {guideOptions.map((guide) => (
                    <option key={guide.id} value={guide.id}>
                      {guide.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="crud-field package-form-grid__wide">
                <span>Description</span>
                <textarea
                  placeholder="Describe what makes this package valuable to a traveler."
                  rows={5}
                  {...register('description', packageFieldRules.description)}
                />
                {errors.description ? <small>{errors.description.message}</small> : null}
              </label>

              <div className="crud-field package-form-grid__wide">
                <span>Package Image</span>
                <div className="package-form-file">
                  <div className="package-form-file__icon">
                    <ImagePlus size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p>{selectedImageName || 'Choose a package image'}</p>
                    <span>PNG or JPEG cover image</span>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="package-form-file__input"
                      {...register('image', packageFieldRules.image)}
                    />
                  </div>
                </div>
                {errors.image ? <small>{errors.image.message}</small> : null}
              </div>
            </div>

            <div className="package-form-toggles">
              <label>
                <input type="checkbox" {...register('includes_bus')} />
                <span>Includes Vehicle</span>
              </label>
              <label>
                <input type="checkbox" {...register('includes_hotel')} />
                <span>Includes Hotel</span>
              </label>
              <label>
                <input type="checkbox" {...register('includes_meal')} />
                <span>Includes Meal</span>
              </label>
            </div>
          </section>

          <section className="package-form-section">
            <div className="package-form-section__header">
              <h3>Inclusions</h3>
              <button
                type="button"
                className="package-form-inline-button"
                onClick={() => inclusionFields.append({ value: '' })}
              >
                <Plus size={14} />
                Add inclusion
              </button>
            </div>

            <div className="package-form-stack">
              {inclusionFields.fields.map((field, index) => (
                <div key={field.id} className="package-form-inline-row">
                  <label className="crud-field">
                    <span>Inclusion {index + 1}</span>
                    <input
                      type="text"
                      placeholder="Airport pickup, breakfast, guide support..."
                      {...register(`inclusions.${index}.value`, packageFieldRules.inclusion)}
                    />
                    {errors.inclusions?.[index]?.value ? (
                      <small>{errors.inclusions[index].value.message}</small>
                    ) : null}
                  </label>
                  <button
                    type="button"
                    className="package-form-remove-button"
                    disabled={inclusionFields.fields.length === 1}
                    onClick={() => inclusionFields.remove(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="package-form-section">
            <div className="package-form-section__header">
              <h3>Exclusions</h3>
              <button
                type="button"
                className="package-form-inline-button"
                onClick={() => exclusionFields.append({ value: '' })}
              >
                <Plus size={14} />
                Add exclusion
              </button>
            </div>

            <div className="package-form-stack">
              {exclusionFields.fields.map((field, index) => (
                <div key={field.id} className="package-form-inline-row">
                  <label className="crud-field">
                    <span>Exclusion {index + 1}</span>
                    <input
                      type="text"
                      placeholder="Visa fee, personal shopping, room service..."
                      {...register(`exclusions.${index}.value`, packageFieldRules.exclusion)}
                    />
                    {errors.exclusions?.[index]?.value ? (
                      <small>{errors.exclusions[index].value.message}</small>
                    ) : null}
                  </label>
                  <button
                    type="button"
                    className="package-form-remove-button"
                    disabled={exclusionFields.fields.length === 1}
                    onClick={() => exclusionFields.remove(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="package-form-section">
            <div className="package-form-section__header">
              <h3>Pricing Details</h3>
              <button
                type="button"
                className="package-form-inline-button"
                onClick={() => pricingFields.append({ adult_price: '', child_price: '' })}
              >
                <Plus size={14} />
                Add tier
              </button>
            </div>

            <div className="package-form-stack">
              {pricingFields.fields.map((field, index) => (
                <div key={field.id} className="package-form-pricing-row">
                  <label className="crud-field">
                    <span>Adult Price</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register(`pricing.${index}.adult_price`, packageFieldRules.adult_price)}
                    />
                    {errors.pricing?.[index]?.adult_price ? (
                      <small>{errors.pricing[index].adult_price.message}</small>
                    ) : null}
                  </label>
                  <label className="crud-field">
                    <span>Child Price</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register(`pricing.${index}.child_price`, packageFieldRules.child_price)}
                    />
                    {errors.pricing?.[index]?.child_price ? (
                      <small>{errors.pricing[index].child_price.message}</small>
                    ) : null}
                  </label>
                  <button
                    type="button"
                    className="package-form-remove-button"
                    disabled={pricingFields.fields.length === 1}
                    onClick={() => pricingFields.remove(index)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="crud-modal__footer">
          <button type="button" className="crud-button crud-button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="crud-button crud-button--primary"
            disabled={isSubmitting || isMutating}
          >
            {isSubmitting || isMutating ? 'Saving...' : 'Create Package'}
          </button>
        </footer>
      </form>
    </div>
  )
}
