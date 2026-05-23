export function SeatLayout({ seats }) {
  const groups = seats.reduce((groupedSeats, seat) => {
    const key = seat.seat_class ?? 'uncategorized'
    groupedSeats[key] = groupedSeats[key] ?? []
    groupedSeats[key].push(seat)
    return groupedSeats
  }, {})

  if (!seats.length) {
    return <div className="trip-summary-empty">No seat layout is available.</div>
  }

  return (
    <div className="trip-seat-layout">
      {Object.entries(groups).map(([seatClass, groupSeats]) => (
        <section key={seatClass}>
          <h3>{seatClass.replaceAll('_', ' ')} Class</h3>
          <div className="trip-seat-layout__grid">
            {groupSeats.map((seat) => {
              const available = Number(seat.is_available) === 1

              return (
                <article key={seat.id ?? `${seat.seat_number}-${seat.seat_type}`} className={available ? 'is-available' : 'is-booked'}>
                  <strong>{seat.seat_number}</strong>
                  <span>{seat.seat_type}</span>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}