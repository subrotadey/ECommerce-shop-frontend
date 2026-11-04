// src/utils/addressValidation.js

export const OTHER = '__other__';

export const COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Oman', 'Kuwait', 'Qatar', 'Bahrain', 'United States',
];

export const UAE_EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
];

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

// যে দেশের তালিকা আছে সেখানে dropdown; নেই সেখানে নিজে লিখবে
export const STATES_BY_COUNTRY = {
  'United Arab Emirates': UAE_EMIRATES,
  'United States': US_STATES,
};

export const validateAddress = (formData) => {
  const errors = {};

  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  // 05xxxxxxxx, +9715xxxxxxxx, 009715xxxxxxxx সব চলবে
  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?\d{7,15}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!formData.street?.trim()) errors.street = 'Street address is required';
  if (!formData.city?.trim()) errors.city = 'City is required';
  if (!formData.state?.trim()) errors.state = 'State / Emirate / Region is required';

  // ZIP ঐচ্ছিক (UAE-তে সাধারণত নেই)। দিলে সাধারণ গঠন দেখা হয়
  if (formData.zipCode?.trim() && !/^[A-Za-z0-9\s-]{3,10}$/.test(formData.zipCode.trim())) {
    errors.zipCode = 'Please enter a valid postal code or P.O. Box';
  }

  if (!formData.country?.trim()) errors.country = 'Country is required';
  if (!formData.label) errors.label = 'Please select an address type';

  return { isValid: Object.keys(errors).length === 0, errors };
};

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