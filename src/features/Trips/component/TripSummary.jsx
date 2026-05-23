export function TripSummaryTable({ rows }) {
  return (
    <table className="trip-summary-table">
      <thead>
        <tr>
          <th>Route Name</th>
          <th>Total Seat</th>
          <th>Available Seat</th>
          <th>Booked Seat</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row, index) => (
            <tr key={`${row.route_name}-${index}`}>
              <td>{row.route_name}</td>
              <td>{row.total_seats}</td>
              <td>{row.available_seats}</td>
              <td>{row.booked_seats}</td>
              <td>BDT {row.revenue ?? 0}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>No trip summary is available.</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}