export const packageFieldRules = {
  adult_price: {
    min: {
      message: 'Adult price must be 0 or greater.',
      value: 0,
    },
    required: 'Adult price is required.',
    valueAsNumber: true,
  },
  child_price: {
    min: {
      message: 'Child price must be 0 or greater.',
      value: 0,
    },
    required: 'Child price is required.',
    valueAsNumber: true,
  },
  description: {
    minLength: {
      message: 'Description should be at least 20 characters.',
      value: 20,
    },
    required: 'Description is required.',
  },
  image: {
    required: 'Package image is required.',
  },
  inclusion: {
    required: 'Inclusion is required.',
  },
  exclusion: {
    required: 'Exclusion is required.',
  },
  name: {
    required: 'Package name is required.',
  },
  trip_id: {
    required: 'Trip is required.',
  },
}

