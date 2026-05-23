import dayjs from 'dayjs'
import { APP_CONFIG } from '../../../services/config'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

const compactFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const toNumber = (value) => {
  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

const toBooleanFlag = (value) => {
  if (typeof value === 'boolean') {
    return value
  }

  return toNumber(value) === 1
}

const normalizeText = (value, fallback = '-') => {
  if (value === undefined || value === null) {
    return fallback
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || fallback
}

const normalizeTextList = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim()
      }

      if (item && typeof item === 'object') {
        return normalizeText(item.value ?? item.name ?? item.label, '')
      }

      return ''
    })
    .filter(Boolean)
}

const truncateText = (value, maxLength = 92) => {
  const normalizedValue = normalizeText(value, '')

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}...`
}

const buildAssetUrl = (value) => {
  if (!value) {
    return ''
  }

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  const baseUrl = APP_CONFIG.imageBaseUrl.replace(/\/+$/, '')
  const normalizedPath = String(value).replace(/^\/+/, '')
  return `${baseUrl}/${normalizedPath}`
}

const formatCurrency = (value) => `BDT ${currencyFormatter.format(toNumber(value))}`

const formatDateLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('MMM D, YYYY') : '-'
}

const formatDateTimeLabel = (value) => {
  const parsedDate = dayjs(value)
  return parsedDate.isValid() ? parsedDate.format('MMM D, YYYY h:mm A') : '-'
}

export const normalizePackageListItem = (item, index = 0, pagination = {}) => {
  const pricing = Array.isArray(item.pricing) ? item.pricing : []
  const serialSeed = pagination.from || 1
  const guideName = item.guide_name ?? item.guide?.name ?? item.trip?.guide_name ?? item.trip?.guideName

  return {
    createdAtLabel: formatDateTimeLabel(item.created_at),
    description: normalizeText(item.description, ''),
    descriptionPreview: truncateText(item.description, 110) || 'No description provided.',
    guideName: normalizeText(guideName, 'Unassigned'),
    id: item.id ?? item.package_id ?? `package-${index + 1}`,
    imageUrl: buildAssetUrl(item.image ?? item.thumbnail),
    includesBus: toBooleanFlag(item.includes_bus),
    includesHotel: toBooleanFlag(item.includes_hotel),
    includesMeal: toBooleanFlag(item.includes_meal),
    name: normalizeText(item.name ?? item.package_name, `Package ${index + 1}`),
    pricingCount: pricing.length || toNumber(item.pricing_count),
    pricingCountLabel: pricing.length || item.pricing_count ? `${pricing.length || item.pricing_count} tiers` : 'Not listed',
    serial: serialSeed + index,
    tripId: item.trip_id ?? item.trip?.id ?? '',
    tripName: normalizeText(item.trip_name ?? item.trip?.trip_name, 'No trip assigned'),
  }
}

export const normalizePackageDetails = (item = {}) => {
  const guideName = item.guide_name ?? item.guide?.name ?? item.trip?.guide_name ?? item.trip?.guideName

  return {
    description: normalizeText(item.description, 'No description available.'),
    exclusions: normalizeTextList(item.exclusions),
    guideName: normalizeText(guideName, 'Unassigned'),
    id: item.id ?? '',
    imageUrl: buildAssetUrl(item.image),
    includesBus: toBooleanFlag(item.includes_bus),
    includesHotel: toBooleanFlag(item.includes_hotel),
    includesMeal: toBooleanFlag(item.includes_meal),
    inclusions: normalizeTextList(item.inclusions),
    name: normalizeText(item.name, 'Untitled package'),
    pricing: Array.isArray(item.pricing)
      ? item.pricing.map((price, index) => ({
          adultPrice: toNumber(price.adult_price),
          adultPriceLabel: formatCurrency(price.adult_price),
          childPrice: toNumber(price.child_price),
          childPriceLabel: formatCurrency(price.child_price),
          id: `${item.id ?? 'package'}-price-${index + 1}`,
        }))
      : [],
    trip: {
      arrivalAt: normalizeText(item.trip?.arrival_at, '-'),
      arrivalDateLabel: formatDateLabel(item.trip?.arrival_time),
      departureAt: normalizeText(item.trip?.departure_at, '-'),
      departureDateLabel: formatDateLabel(item.trip?.departure_time),
      guideName: normalizeText(guideName, 'Unassigned'),
      routeName: normalizeText(item.trip?.route_name, '-'),
      tripName: normalizeText(item.trip?.trip_name ?? item.trip_name, '-'),
    },
  }
}

export const buildPackageMetrics = (packages = []) => {
  const totalPackages = packages.length
  const withMeal = packages.filter((item) => item.includesMeal).length
  const withHotel = packages.filter((item) => item.includesHotel).length
  const withVehicle = packages.filter((item) => item.includesBus).length
  const uniqueTrips = new Set(
    packages
      .map((item) => item.tripName)
      .filter((tripName) => tripName && tripName !== 'No trip assigned'),
  ).size
  const guidedPackages = packages.filter((item) => item.guideName && item.guideName !== 'Unassigned').length

  const serviceMix = [
    {
      accentClassName: 'bg-amber-400',
      count: withMeal,
      label: 'Meal included',
      ratio: totalPackages ? (withMeal / totalPackages) * 100 : 0,
    },
    {
      accentClassName: 'bg-blue-400',
      count: withHotel,
      label: 'Hotel included',
      ratio: totalPackages ? (withHotel / totalPackages) * 100 : 0,
    },
    {
      accentClassName: 'bg-emerald-400',
      count: withVehicle,
      label: 'Vehicle included',
      ratio: totalPackages ? (withVehicle / totalPackages) * 100 : 0,
    },
  ]

  return {
    guidedPackages,
    guidedPackagesLabel: compactFormatter.format(guidedPackages),
    serviceMix,
    totalPackages,
    totalPackagesLabel: compactFormatter.format(totalPackages),
    uniqueTrips,
    uniqueTripsLabel: compactFormatter.format(uniqueTrips),
    withHotel,
    withHotelLabel: compactFormatter.format(withHotel),
    withMeal,
    withMealLabel: compactFormatter.format(withMeal),
    withVehicle,
    withVehicleLabel: compactFormatter.format(withVehicle),
  }
}

const getSelectedFile = (value) => {
  if (typeof File !== 'undefined' && value instanceof File) {
    return value
  }

  const fileCandidate = value?.[0]

  if (typeof File !== 'undefined' && fileCandidate instanceof File) {
    return fileCandidate
  }

  if (fileCandidate && typeof fileCandidate === 'object' && typeof fileCandidate.name === 'string') {
    return fileCandidate
  }

  return null
}

export const toPackageFormData = (values) => {
  const formData = new FormData()
  const selectedFile = getSelectedFile(values.image)
  const appendScalar = (key, value) => {
    formData.append(key, value ?? '')
  }

  appendScalar('name', normalizeText(values.name, '').trim())
  appendScalar('description', normalizeText(values.description, '').trim())
  appendScalar('trip_id', values.trip_id)
  appendScalar('guide_id', values.guide_id ?? '')
  appendScalar('includes_bus', values.includes_bus ? 1 : 0)
  appendScalar('includes_hotel', values.includes_hotel ? 1 : 0)
  appendScalar('includes_meal', values.includes_meal ? 1 : 0)

  normalizeTextList(values.inclusions?.map((item) => item.value)).forEach((value, index) => {
    formData.append(`inclusions[${index}]`, value)
  })

  normalizeTextList(values.exclusions?.map((item) => item.value)).forEach((value, index) => {
    formData.append(`exclusions[${index}]`, value)
  })

  ;(Array.isArray(values.pricing) ? values.pricing : []).forEach((item, index) => {
    appendScalar(`pricing[${index}][adult_price]`, item.adult_price)
    appendScalar(`pricing[${index}][child_price]`, item.child_price)
  })

  if (selectedFile) {
    formData.append('image', selectedFile, selectedFile.name ?? 'package-image')
  }

  return formData
}
