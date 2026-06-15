// src/utils/addressValidation.js

export const validateAddress = (formData) => {
  const errors = {};

  // Contact validation
  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[1-9]\d{6,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Address validation
  if (!formData.street?.trim()) {
    errors.street = 'Street address is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State / Province is required';
  }

  if (!formData.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!/^\d{4,10}$/.test(formData.zipCode.replace(/[\s\-]/g, ''))) {
    errors.zipCode = 'Please enter a valid ZIP code';
  }

  if (!formData.country?.trim()) {
    errors.country = 'Country is required';
  }

  // Label validation
  if (!formData.label) {
    errors.label = 'Please select an address type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

export const ADDRESS_LABELS = [
  { value: 'home',      label: 'Home',      icon: 'ti-home' },
  { value: 'work',      label: 'Work',      icon: 'ti-briefcase' },
  { value: 'warehouse', label: 'Warehouse', icon: 'ti-building-warehouse' },
  { value: 'other',     label: 'Other',     icon: 'ti-map-pin' },
];

export const TIME_PREFERENCES = [
  { value: 'morning',   label: 'Morning',   time: '8am – 12pm',  icon: 'ti-sun' },
  { value: 'afternoon', label: 'Afternoon', time: '12pm – 5pm',  icon: 'ti-sun-high' },
  { value: 'evening',   label: 'Evening',   time: '5pm – 9pm',   icon: 'ti-moon' },
];