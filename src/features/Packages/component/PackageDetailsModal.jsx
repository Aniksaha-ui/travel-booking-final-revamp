import { CalendarClock, ImageOff, MapPinned, UserRound } from 'lucide-react'
import { PackageFeatureBadgeList } from './PackageFeatureBadgeList.jsx'

export function PackageDetailsModal({ details, isLoading, onClose, packageItem }) {
  const packageSummary = packageItem ?? details

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close package details" onClick={onClose} />

      <div className="crud-modal__panel package-details-modal__panel">
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Package details</p>
            <h2>{packageSummary?.name ?? 'Package details'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="package-details-modal__body">
          {isLoading ? (
            <div className="package-empty-state">Loading package details...</div>
          ) : (
            <>
              <section className="package-detail-card package-detail-card--hero">
                <div className="package-detail-card__media">
                  {details?.imageUrl ? (
                    <img src={details.imageUrl} alt={details.name} />
                  ) : (
                    <div className="package-detail-card__placeholder">
                      <ImageOff size={22} />
                      <span>No package image</span>
                    </div>
                  )}
                </div>

                <div className="package-detail-card__content">
                  <div className="package-detail-card__meta">
                    <span>Package #{details?.id}</span>
                    <span>{packageSummary?.tripName ?? details?.trip?.tripName}</span>
                  </div>
                  <h3>{details?.name}</h3>
                  <p>{details?.description}</p>
                  <PackageFeatureBadgeList
                    packageItem={{
                      includesBus: details?.includesBus,
                      includesHotel: details?.includesHotel,
                      includesMeal: details?.includesMeal,
                    }}
                  />
                </div>
              </section>

              <div className="package-details-grid">
                <section className="package-detail-card">
                  <div className="package-detail-card__title">
                    <MapPinned size={16} className="text-blue-400" />
                    <h4>Trip Information</h4>
                  </div>

                  <div className="package-detail-list">
                    <div>
                      <span>Trip</span>
                      <strong>{details?.trip?.tripName}</strong>
                    </div>
                    <div>
                      <span>Route</span>
                      <strong>{details?.trip?.routeName}</strong>
                    </div>
                    <div>
                      <span>Departure</span>
                      <strong>{details?.trip?.departureDateLabel}</strong>
                    </div>
                    <div>
                      <span>Arrival</span>
                      <strong>{details?.trip?.arrivalDateLabel}</strong>
                    </div>
                    <div>
                      <span>Departure At</span>
                      <strong>{details?.trip?.departureAt}</strong>
                    </div>
                    <div>
                      <span>Arrival At</span>
                      <strong>{details?.trip?.arrivalAt}</strong>
                    </div>
                  </div>
                </section>

                <section className="package-detail-card">
                  <div className="package-detail-card__title">
                    <UserRound size={16} className="text-cyan-400" />
                    <h4>Guide and Coverage</h4>
                  </div>

                  <div className="package-detail-list">
                    <div>
                      <span>Assigned Guide</span>
                      <strong>{details?.guideName}</strong>
                    </div>
                    <div>
                      <span>Coverage</span>
                      <strong>
                        {[
                          details?.includesMeal ? 'Meal' : null,
                          details?.includesHotel ? 'Hotel' : null,
                          details?.includesBus ? 'Vehicle' : null,
                        ]
                          .filter(Boolean)
                          .join(', ') || 'Custom'}
                      </strong>
                    </div>
                    <div>
                      <span>Pricing Tiers</span>
                      <strong>{details?.pricing?.length || 0}</strong>
                    </div>
                    <div>
                      <span>Included Items</span>
                      <strong>{details?.inclusions?.length || 0}</strong>
                    </div>
                    <div>
                      <span>Excluded Items</span>
                      <strong>{details?.exclusions?.length || 0}</strong>
                    </div>
                    <div>
                      <span>Loaded At</span>
                      <strong className="inline-flex items-center gap-2">
                        <CalendarClock size={14} />
                        Current session
                      </strong>
                    </div>
                  </div>
                </section>

                <section className="package-detail-card">
                  <div className="package-detail-card__title">
                    <h4>Inclusions</h4>
                  </div>
                  {details?.inclusions?.length ? (
                    <ul className="package-detail-bullets">
                      {details.inclusions.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="package-empty-state">No inclusions listed.</div>
                  )}
                </section>

                <section className="package-detail-card">
                  <div className="package-detail-card__title">
                    <h4>Exclusions</h4>
                  </div>
                  {details?.exclusions?.length ? (
                    <ul className="package-detail-bullets">
                      {details.exclusions.map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="package-empty-state">No exclusions listed.</div>
                  )}
                </section>
              </div>

              <section className="package-detail-card package-detail-card--full">
                <div className="package-detail-card__title">
                  <h4>Pricing Details</h4>
                </div>

                {details?.pricing?.length ? (
                  <div className="overflow-x-auto">
                    <table className="trip-summary-table">
                      <thead>
                        <tr>
                          <th>Tier</th>
                          <th>Adult Price</th>
                          <th>Child Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.pricing.map((price, index) => (
                          <tr key={price.id}>
                            <td>Tier {index + 1}</td>
                            <td>{price.adultPriceLabel}</td>
                            <td>{price.childPriceLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="package-empty-state">No pricing tiers were returned for this package.</div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
