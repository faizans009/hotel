// Meal type mappings
export const MEAL_OPTIONS = {
    'nomeal': 'Meal not included',
    'breakfast': 'Breakfast included',
    'half_board': 'Breakfast + Lunch or Dinner',
    'full_board': 'Breakfast, Lunch & Dinner',
    'all_inclusive': 'All Inclusive'
};

export const MEAL_SELECT_OPTIONS = Object.keys(MEAL_OPTIONS).map(key => ({
    code: key,
    label: MEAL_OPTIONS[key]
}));

// Cancellation policy types
export const CANCELLATION_TYPES = [
    { value: 'all', label: 'All options' },
    { value: 'free', label: 'With free cancellation' }
];

// Payment types
export const PAYMENT_TYPES = [
    { value: 'all', label: 'All options' },
    { value: 'pay_now', label: 'Pay now' },
    { value: 'pay_hotel', label: 'Pay at the hotel' }
];

// Image sizes for optimization
export const IMAGE_SIZES = {
    main: '1200x616',
    secondary: '750x400',
    thumbnail: '370x'
};

// Default values
export const DEFAULT_NIGHTS = 1;
export const DEFAULT_ADULTS = 2;
