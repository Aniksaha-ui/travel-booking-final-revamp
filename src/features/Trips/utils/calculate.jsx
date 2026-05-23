

export const calculateBookingTotal = (seatIds, price) => {
  if (!seatIds) {
    return 0
  }

  const seatCount = String(seatIds)
    .split(',')
    .filter((seatId) => seatId.trim() !== '').length

  return seatCount * (Number(price) || 0)
}
