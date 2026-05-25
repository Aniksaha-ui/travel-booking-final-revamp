export const HOTELS_PAGE_COPY = {
  newButtonLabel: 'Add Hotel',
  title: 'Hotel Information',
  subtitle:
    'Review supplier hotels, contact details, location coverage, facilities, and room inventory from one admin workspace.',
  searchPlaceholder: 'Search by hotel name, email, website, city, country, location, or facilities',
}

export const HOTELS_EMPTY_STATE = {
  noDescription: 'No description provided.',
  noEmail: 'No email provided.',
  noFacilities: 'No facilities listed.',
  noHotels: 'No hotels found.',
  noPhotos: 'No photo links available.',
  noRooms: 'No room inventory available.',
  noWebsite: 'No website listed.',
}

export const createEmptyHotelPrice = () => ({
  hotel_room_id: '',
  id: '',
  price_per_night: '',
  season_end: '',
  season_start: '',
})

export const createEmptyHotelRoom = () => ({
  amenities: '',
  max_occupancy: '1',
  prices: [createEmptyHotelPrice()],
  room_id: '',
  room_size: '',
  total_rooms: '1',
  type_name: '',
})

export const HOTEL_FORM_DEFAULT_VALUES = {
  city: '',
  country: '',
  description: '',
  email: '',
  facilities: '',
  location: '',
  name: '',
  photos: '',
  rooms: [createEmptyHotelRoom()],
  star_rating: '',
  website: '',
}
