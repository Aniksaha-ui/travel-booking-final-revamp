import { Users2, X } from 'lucide-react'
import { calculateBookingTotal } from '../../Trips/utils/calculate'

const countBookedSeats = (users = []) =>
  users.reduce((totalSeats, user) => {
    if (!user?.seat_ids) {
      return totalSeats
    }

    return (
      totalSeats +
      String(user.seat_ids)
        .split(',')
        .filter((seatId) => seatId.trim() !== '').length
    )
  }, 0)

export function TripPerformanceUsersDrawer({ loading, onClose, trip, users }) {
  const totalRevenue = users.reduce((sum, user) => sum + calculateBookingTotal(user.seat_ids, user.price), 0)
  const totalBookedSeats = countBookedSeats(users)

  return (
    <div className="report-drawer" role="dialog" aria-modal="true">
      <button type="button" className="report-drawer__backdrop" aria-label="Close booked users drawer" onClick={onClose} />

      <aside className="report-drawer__panel">
        <header className="report-drawer__header">
          <div className="min-w-0">
            <span className="report-drawer__eyebrow">Booked users</span>
            <h2>{trip?.trip_name ?? 'Trip Users'}</h2>
            <p className="report-drawer__subtitle">
              Passenger-level bookings, seat assignments, and collected value for this trip.
            </p>
          </div>

          <button type="button" className="report-drawer__close" onClick={onClose}>
            <X size={16} />
            Close
          </button>
        </header>

        <div className="report-drawer__body">
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
                  <span>Booked seats</span>
                  <strong>{totalBookedSeats}</strong>
                </article>
                <article>
                  <span>Total booking value</span>
                  <strong>BDT {new Intl.NumberFormat('en-US').format(totalRevenue)}</strong>
                </article>
              </div>

              <section className="report-drawer__table-card">
                <div className="report-drawer__table-header">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Users2 size={16} className="text-blue-400" />
                    <span>Passenger Ledger</span>
                  </div>
                  <span className="text-xs font-semibold text-[#8fa0bd]">{users.length} rows</span>
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
              </section>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
