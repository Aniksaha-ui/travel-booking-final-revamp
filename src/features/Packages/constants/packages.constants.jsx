export const PACKAGES_PAGE_COPY = {
  newButtonLabel: 'New Package',
  searchPlaceholder: 'Search by package, trip, or description',
  subtitle:
    'Create curated travel packages, assign trips and guides, and review package inclusions before selling them to customers.',
  title: 'Package Management',
}

export const PACKAGE_FORM_DEFAULT_VALUES = {
  description: '',
  exclusions: [{ value: '' }],
  guide_id: '',
  image: null,
  includes_bus: false,
  includes_hotel: false,
  includes_meal: false,
  inclusions: [{ value: '' }],
  name: '',
  pricing: [{ adult_price: '', child_price: '' }],
  trip_id: '',
}

export const EMPTY_PACKAGE_DETAILS = {
  description: '',
  exclusions: [],
  guideName: 'Unassigned',
  id: '',
  imageUrl: '',
  includesBus: false,
  includesHotel: false,
  includesMeal: false,
  inclusions: [],
  name: '',
  pricing: [],
  trip: {
    arrivalAt: '-',
    arrivalDateLabel: '-',
    departureAt: '-',
    departureDateLabel: '-',
    routeName: '-',
    tripName: '-',
  },
}

