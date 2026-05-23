import { SeatLayout } from "./SeatLayout";
import { TripSummaryTable } from "./TripSummary";

export function TripSummaryModal({ data, loading, onClose, trip }) {
  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close summary" onClick={onClose} />
      <section className="crud-modal__panel trip-summary-modal">
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Booking summary</p>
            <h2>{trip?.trip_name ?? 'Trip Summary'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="trip-summary-modal__body">
          {loading ? (
            <div className="trip-summary-empty">Loading trip summary...</div>
          ) : (
            <>
              <TripSummaryTable rows={data.tripSummaries ?? []} />
              <SeatLayout seats={data.seat_layout ?? []} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}