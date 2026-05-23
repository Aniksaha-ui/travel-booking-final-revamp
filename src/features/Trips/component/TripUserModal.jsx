import { calculateBookingTotal } from "../utils/calculate"

export function TripUsersModal({ loading, onClose, trip, users }) {
  const totalRevenue = users.reduce((sum, user) => sum + calculateBookingTotal(user.seat_ids, user.price), 0)

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close users" onClick={onClose} />
      <section className="crud-modal__panel trip-summary-modal">
        <header className="crud-modal__header">
          <div>
            <p className="crud-modal__eyebrow">Booked users</p>
            <h2>{trip?.trip_name ?? 'Trip Users'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="trip-summary-modal__body">
          {loading ? (
            <div className="trip-summary-empty">Loading trip users...</div>
          ) : (
            <>
              <div className="trip-users-summary">
                <article>
                  <span>Total users</span>
                  <strong>{users.length}</strong>
                </article>
                <article>
                  <span>Total booking value</span>
                  <strong>BDT {new Intl.NumberFormat('en-US').format(totalRevenue)}</strong>
                </article>
              </div>

              <table className="trip-summary-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
                    users.map((user, index) => {
                      const rowTotal = calculateBookingTotal(user.seat_ids, user.price)

                      return (
                        <tr key={user.booking_id ?? user.id ?? index}>
                          <td>{user.user_name ?? user.name ?? 'Guest User'}</td>
                          <td>{user.user_email ?? user.email ?? '-'}</td>
                          <td>{user.seat_ids ?? '-'}</td>
                          <td>BDT {user.price ?? 0}</td>
                          <td>BDT {new Intl.NumberFormat('en-US').format(rowTotal)}</td>
                          <td>{user.booking_status ?? user.status ?? '-'}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6}>No users found for this trip.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </section>
    </div>
  )
}