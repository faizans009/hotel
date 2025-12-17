import { MEAL_OPTIONS, DEFAULT_NIGHTS, DEFAULT_ADULTS, IMAGE_SIZES } from '../constants/hotelConstants';

/**
 * Get meal display text based on meal code
 * @param {string} meal - Meal code
 * @returns {string} Formatted meal text
 */
export const getMealText = (meal) => {
    return MEAL_OPTIONS[meal] || `${meal} included`;
};

/**
 * Format date for policy display
 * @param {string} dateString - Date to format
 * @returns {string} Formatted date
 */
export const formatPolicyDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

/**
 * Calculate stay information from search data
 * @param {object} searchData - Search data object
 * @returns {object} Object with nights, adults, checkin, checkout
 */
export const calculateStayInfo = (searchData) => {
    if (!searchData) return {
        nights: DEFAULT_NIGHTS,
        adults: DEFAULT_ADULTS
    };

    const checkin = new Date(searchData.checkin);
    const checkout = new Date(searchData.checkout);
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const totalAdults = searchData.guests?.reduce((sum, room) => sum + room.adults, 0) || DEFAULT_ADULTS;

    return { nights, adults: totalAdults, checkin, checkout };
};

/**
 * Get cancellation policy details
 * @param {object} room - Room object
 * @returns {object} Policy object with type and text
 */
export const getCancellationPolicy = (room) => {
    const now = new Date();

    if (!room.free_cancellation_before) {
        return { type: 'no', text: 'NO' };
    }

    if (!Array.isArray(room.cancellation) || room.cancellation.length === 0) {
        return { type: 'na', text: 'N/A' };
    }

    const policy = room.cancellation.find(p => {
        const start = p.start_at ? new Date(p.start_at) : null;
        const end = p.end_at ? new Date(p.end_at) : null;

        if (start && end) {
            return now >= start && now < end;
        } else if (start && !end) {
            return now >= start;
        } else if (!start && end) {
            return now < end;
        }
        return true;
    });

    if (!policy) {
        return { type: 'na', text: 'N/A' };
    }

    if (policy.end_at) {
        return {
            type: 'yes',
            text: `$${policy.amount_show} until ${formatPolicyDate(policy.end_at)}`
        };
    } else if (policy.start_at) {
        return {
            type: 'yes',
            text: `$${policy.amount_show} after ${formatPolicyDate(policy.start_at)}`
        };
    }

    return {
        type: 'yes',
        text: `$${policy.amount_show}`
    };
};

/**
 * Get unique bed types from hotel rooms
 * @param {object} hotel - Hotel object
 * @returns {array} Array of unique bed types
 */
export const getUniqueBedTypes = (hotel) => {
    if (!hotel?.rooms) return [];
    const beds = new Set();
    hotel.rooms.forEach(room => {
        if (room.bed_type) beds.add(room.bed_type);
    });
    return Array.from(beds);
};

/**
 * Replace image size placeholder
 * @param {string} url - Image URL with {size} placeholder
 * @param {string} size - Size key from IMAGE_SIZES
 * @returns {string} URL with size replaced
 */
export const getImageUrl = (url, size = 'main') => {
    const sizeValue = IMAGE_SIZES[size] || size;
    return url.replace('{size}', sizeValue);
};

/**
 * Filter rooms based on criteria
 * @param {array} rooms - Array of rooms
 * @param {object} filters - Filter criteria
 * @returns {array} Filtered rooms
 */
export const filterRooms = (rooms, filters) => {
    if (!Array.isArray(rooms)) return [];

    return rooms.filter(room => {
        if (filters.beds && room.bed_type !== filters.beds) return false;
        if (filters.meals && room.meal !== filters.meals) return false;
        if (filters.cancellation === 'free' && !room.free_cancellation_before) return false;
        return true;
    });
};
