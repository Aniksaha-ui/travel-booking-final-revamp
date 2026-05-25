import dayjs from 'dayjs'
import {
  createEmptyHotelPrice,
  createEmptyHotelRoom,
  HOTEL_FORM_DEFAULT_VALUES,
  HOTELS_EMPTY_STATE,
} from '../constants/hotels.constants'

const integerFormatter = new Intl.NumberFormat('en-US')
const decimalFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

const formatDateLabel = (value) => {
  const parsedValue = dayjs(value)
  return parsedValue.isValid() ? parsedValue.format('DD MMM YYYY') : normalizeText(value, '-')
}

const splitList = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item, ''))
      .filter((item) => item && item !== '-')
  }

  if (typeof value === 'string') {
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const normalizePhoto = (item, index) => {
  const url =
    normalizeText(item?.url ?? item?.photo ?? item?.path ?? item, '')

  return {
    id: item?.id ?? `${url || 'hotel-photo'}-${index + 1}`,
    label: `Photo ${index + 1}`,
    url,
  }
}

const buildWebsiteHostLabel = (value) => {
  const normalizedValue = normalizeText(value, '')

  if (!normalizedValue) {
    return HOTELS_EMPTY_STATE.noWebsite
  }

  try {
    const url = new URL(normalizedValue.startsWith('http') ? normalizedValue : `https://${normalizedValue}`)
    return url.hostname.replace(/^www\./i, '')
  } catch {
    return normalizedValue
  }
}

const buildLocationLabel = (location, city, country) => {
  const parts = [location, city, country]
    .map((value) => normalizeText(value, ''))
    .filter((value) => value && value !== '-')

  return parts.length ? parts.join(', ') : '-'
}

const normalizeRoomPrice = (price = {}, index = 0) => {
  const seasonStartLabel = formatDateLabel(price.season_start ?? price.seasonStart)
  const seasonEndLabel = formatDateLabel(price.season_end ?? price.seasonEnd)
  const nightlyRate = toNumber(price.price_per_night ?? price.pricePerNight)
  const seasonLabel =
    seasonStartLabel === '-' && seasonEndLabel === '-'
      ? 'Open season'
      : `${seasonStartLabel} to ${seasonEndLabel}`

  return {
    hotelRoomId: normalizeText(price.hotel_room_id ?? price.hotelRoomId, ''),
    id: price.id ?? price.price_id ?? `${seasonLabel}-${index + 1}`,
    pricePerNight: normalizeText(price.price_per_night ?? price.pricePerNight, ''),
    pricePerNightLabel: nightlyRate ? integerFormatter.format(nightlyRate) : '-',
    seasonEnd: normalizeText(price.season_end ?? price.seasonEnd, ''),
    seasonLabel,
    seasonStart: normalizeText(price.season_start ?? price.seasonStart, ''),
    typeName: normalizeText(price.type_name ?? price.typeName, ''),
  }
}

const normalizeRoom = (room = {}, index = 0) => {
  const prices = Array.isArray(room.prices) ? room.prices : []
  const amenitiesList = splitList(room.amenities)
  const primaryPriceTypeName = normalizeText(prices[0]?.type_name ?? prices[0]?.typeName, '')
  const normalizedRoomTypeName = normalizeText(
    room.type_name ?? room.typeName ?? primaryPriceTypeName,
    `Room ${index + 1}`,
  )

  return {
    amenities: normalizeText(room.amenities, ''),
    amenitiesList,
    id: room.room_id ?? room.roomId ?? room.id ?? `${normalizedRoomTypeName}-${index + 1}`,
    maxOccupancy: normalizeText(room.max_occupancy ?? room.maxOccupancy, ''),
    maxOccupancyLabel: toNumber(room.max_occupancy ?? room.maxOccupancy)
      ? `${integerFormatter.format(toNumber(room.max_occupancy ?? room.maxOccupancy))} guests`
      : '-',
    priceCountLabel: `${prices.length} seasonal rate${prices.length === 1 ? '' : 's'}`,
    prices: prices.map(normalizeRoomPrice),
    roomId: normalizeText(room.room_id ?? room.roomId ?? room.id, ''),
    roomSize: normalizeText(room.room_size ?? room.roomSize, ''),
    roomSizeLabel: normalizeText(room.room_size ?? room.roomSize),
    totalRooms: normalizeText(room.total_rooms ?? room.totalRooms, ''),
    totalRoomsCount: toNumber(room.total_rooms ?? room.totalRooms),
    totalRoomsLabel: toNumber(room.total_rooms ?? room.totalRooms)
      ? `${integerFormatter.format(toNumber(room.total_rooms ?? room.totalRooms))} rooms`
      : '-',
    typeName: normalizedRoomTypeName,
  }
}

const getRooms = (item = {}) => (Array.isArray(item.rooms) ? item.rooms : [])

const getPhotos = (item = {}) => {
  const rawPhotos = Array.isArray(item.photos)
    ? item.photos
    : typeof item.photos === 'string'
      ? item.photos.split(',').map((photo) => photo.trim())
      : []

  return rawPhotos
    .map(normalizePhoto)
    .filter((photo) => photo.url)
}

export const normalizeHotel = (item = {}, index = 0, pagination = {}) => {
  const serial = (pagination.from || 0) + index + 1
  const rooms = getRooms(item)
  const facilitiesList = splitList(item.facilities)
  const starRatingValue = toNumber(item.star_rating ?? item.starRating)
  const totalRoomsCount =
    toNumber(item.total_rooms ?? item.totalRooms ?? item.rooms_count) ||
    rooms.reduce((sum, room) => sum + toNumber(room.total_rooms ?? room.totalRooms), 0)
  const photoCount = getPhotos(item).length

  return {
    city: normalizeText(item.city),
    country: normalizeText(item.country),
    description: normalizeText(item.description, HOTELS_EMPTY_STATE.noDescription),
    email: normalizeText(item.email, HOTELS_EMPTY_STATE.noEmail),
    facilitiesCount: facilitiesList.length,
    facilitiesList,
    facilitiesPreview: facilitiesList.slice(0, 3),
    id: item.id ?? `hotel-${serial}`,
    location: normalizeText(item.location),
    locationLabel: buildLocationLabel(item.location, item.city, item.country),
    name: normalizeText(item.name, `Hotel ${serial}`),
    photoCount,
    photoCountLabel: `${photoCount} photo${photoCount === 1 ? '' : 's'}`,
    roomTypesCount: toNumber(item.rooms_count ?? item.room_types_count) || rooms.length,
    roomTypesCountLabel: rooms.length || toNumber(item.rooms_count ?? item.room_types_count)
      ? `${integerFormatter.format(toNumber(item.rooms_count ?? item.room_types_count) || rooms.length)} types`
      : 'No room data',
    rooms,
    serial,
    starRatingLabel: starRatingValue ? `${decimalFormatter.format(starRatingValue)} Star` : '-',
    starRatingValue,
    totalRoomsCount,
    totalRoomsLabel: totalRoomsCount ? `${integerFormatter.format(totalRoomsCount)} rooms` : 'No room data',
    website: normalizeText(item.website, ''),
    websiteHostLabel: buildWebsiteHostLabel(item.website),
  }
}

export const normalizeHotelDetails = (item = {}) => {
  const base = normalizeHotel(item, 0, { from: 0 })
  const photos = getPhotos(item)
  const rooms = getRooms(item).map(normalizeRoom)

  return {
    ...base,
    description: normalizeText(item.description, HOTELS_EMPTY_STATE.noDescription),
    facilitiesList: base.facilitiesList,
    photos,
    photosLabel: `${photos.length} photo${photos.length === 1 ? '' : 's'}`,
    rooms,
    roomsLabel: `${rooms.length} room type${rooms.length === 1 ? '' : 's'}`,
  }
}

export const buildHotelMetrics = (rows = []) => {
  const totalRoomsCount = rows.reduce((sum, row) => sum + toNumber(row.totalRoomsCount), 0)
  const websiteCount = rows.filter((row) => Boolean(row.website)).length
  const countries = new Set(rows.map((row) => row.country).filter((country) => country && country !== '-'))
  const ratedHotels = rows.filter((row) => row.starRatingValue > 0)
  const averageStarValue = ratedHotels.length
    ? ratedHotels.reduce((sum, row) => sum + row.starRatingValue, 0) / ratedHotels.length
    : 0

  return {
    averageStarLabel: averageStarValue ? decimalFormatter.format(averageStarValue) : 'N/A',
    countryCount: countries.size,
    countryCountLabel: integerFormatter.format(countries.size),
    totalCount: rows.length,
    totalCountLabel: integerFormatter.format(rows.length),
    totalRoomsCount,
    totalRoomsLabel: integerFormatter.format(totalRoomsCount),
    websiteCount,
    websiteCountLabel: integerFormatter.format(websiteCount),
  }
}

export const buildHotelFormState = (hotel = {}) => ({
  ...HOTEL_FORM_DEFAULT_VALUES,
  city: hotel.city && hotel.city !== '-' ? hotel.city : '',
  country: hotel.country && hotel.country !== '-' ? hotel.country : '',
  description: hotel.description && hotel.description !== HOTELS_EMPTY_STATE.noDescription ? hotel.description : '',
  email: hotel.email && hotel.email !== HOTELS_EMPTY_STATE.noEmail ? hotel.email : '',
  facilities: Array.isArray(hotel.facilitiesList) ? hotel.facilitiesList.join(', ') : '',
  location: hotel.location && hotel.location !== '-' ? hotel.location : '',
  name: hotel.name && hotel.name !== '-' ? hotel.name : '',
  photos: Array.isArray(hotel.photos) ? hotel.photos.map((photo) => photo.url).filter(Boolean).join(', ') : '',
  rooms: hotel.rooms?.length
    ? hotel.rooms.map((room) => ({
        amenities: room.amenities && room.amenities !== '-' ? room.amenities : room.amenitiesList.join(', '),
        max_occupancy: room.maxOccupancy || '1',
        prices: room.prices.length
          ? room.prices.map((price) => ({
              hotel_room_id: price.hotelRoomId || room.roomId || '',
              id: price.id || '',
              price_per_night: price.pricePerNight || '',
              season_end: price.seasonEnd || '',
              season_start: price.seasonStart || '',
            }))
          : [createEmptyHotelPrice()],
        room_id: room.roomId || '',
        room_size: room.roomSize && room.roomSize !== '-' ? room.roomSize : '',
        total_rooms: room.totalRooms || '1',
        type_name: room.typeName || '',
      }))
    : [createEmptyHotelRoom()],
  star_rating: hotel.starRatingValue ? String(hotel.starRatingValue) : '',
  website: hotel.website || '',
})

export const buildHotelFormData = (formState) => {
  const payload = new FormData()
  const photoList = splitList(formState.photos)

  payload.append('name', normalizeText(formState.name, ''))
  payload.append('email', normalizeText(formState.email, ''))
  payload.append('city', normalizeText(formState.city, ''))
  payload.append('country', normalizeText(formState.country, ''))
  payload.append('website', normalizeText(formState.website, ''))
  payload.append('description', normalizeText(formState.description, ''))
  payload.append('location', normalizeText(formState.location, ''))
  payload.append('star_rating', normalizeText(formState.star_rating, '0'))
  payload.append('facilities', normalizeText(formState.facilities, ''))

  photoList.forEach((photo, index) => {
    payload.append(`photos[${index}]`, photo)
  })

  formState.rooms.forEach((room, roomIndex) => {
    if (room.room_id) {
      payload.append(`rooms[${roomIndex}][room_id]`, room.room_id)
    }

    payload.append(`rooms[${roomIndex}][type_name]`, normalizeText(room.type_name, ''))
    payload.append(`rooms[${roomIndex}][room_size]`, normalizeText(room.room_size, ''))
    payload.append(`rooms[${roomIndex}][max_occupancy]`, normalizeText(room.max_occupancy, '1'))
    payload.append(`rooms[${roomIndex}][total_rooms]`, normalizeText(room.total_rooms, '1'))
    payload.append(`rooms[${roomIndex}][amenities]`, normalizeText(room.amenities, ''))

    room.prices.forEach((price, priceIndex) => {
      if (price.id) {
        payload.append(`rooms[${roomIndex}][prices][${priceIndex}][id]`, price.id)
      }

      if (price.hotel_room_id || room.room_id) {
        payload.append(
          `rooms[${roomIndex}][prices][${priceIndex}][hotel_room_id]`,
          price.hotel_room_id || room.room_id,
        )
      }

      payload.append(
        `rooms[${roomIndex}][prices][${priceIndex}][season_start]`,
        normalizeText(price.season_start, ''),
      )
      payload.append(
        `rooms[${roomIndex}][prices][${priceIndex}][season_end]`,
        normalizeText(price.season_end, ''),
      )
      payload.append(
        `rooms[${roomIndex}][prices][${priceIndex}][price_per_night]`,
        normalizeText(price.price_per_night, '0'),
      )
    })
  })

  return payload
}

export const emptyHotelDetails = {
  city: '-',
  country: '-',
  description: HOTELS_EMPTY_STATE.noDescription,
  email: HOTELS_EMPTY_STATE.noEmail,
  facilitiesCount: 0,
  facilitiesList: [],
  id: '',
  location: '-',
  locationLabel: '-',
  name: '',
  photoCount: 0,
  photoCountLabel: '0 photos',
  photos: [],
  photosLabel: '0 photos',
  roomTypesCount: 0,
  roomTypesCountLabel: 'No room data',
  rooms: [],
  roomsLabel: '0 room types',
  serial: 0,
  starRatingLabel: '-',
  starRatingValue: 0,
  totalRoomsCount: 0,
  totalRoomsLabel: 'No room data',
  website: '',
  websiteHostLabel: HOTELS_EMPTY_STATE.noWebsite,
}
