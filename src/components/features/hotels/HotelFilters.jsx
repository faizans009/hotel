import { useState, useMemo } from 'react';

const ALLOWED_HOTEL_TYPES = [
    "Hotel",
    "Boutique hotels",
    "Resort",
    "Apartment hotels"
];

const PROPERTY_TYPE_GROUPS = {
    'Boutique hotels': ['Boutique hotels', 'Boutique_and_Design'],
    'Apartment hotels': ['Apartment hotels', 'Aparthotel', 'Apart-hotel']
};

const MEAL_OPTIONS = [
    { value: 'no_meals', label: 'No meals included' },
    { value: 'breakfast', label: 'Breakfast included' },
    { value: 'breakfast_lunch', label: 'Breakfast + lunch or dinner included' },
    { value: 'all_meals', label: 'Breakfast, lunch and dinner included' },
    { value: 'all_inclusive', label: 'All-inclusive' }
];

const CANCELLATION_OPTIONS = [
    { value: 'free', label: 'Free cancellation' },
    { value: 'paid', label: 'Paid cancellation' },
    { value: 'partial', label: 'Partial refund' }
];

const HotelFilters = ({ hotels, onFilterChange, searchData }) => {
    const [hotelNameSearch, setHotelNameSearch] = useState('');
    const [priceRange, setPriceRange] = useState([0, 30000]);
    const [selectedFilters, setSelectedFilters] = useState({
        stars: [],
        propertyType: [],
        meals: [],
        rating: [],
        cancellationPolicy: [],
        cancellation: false,
        breakfast: false
    });

    // Extract filter options from hotels data
    const filterOptions = useMemo(() => {
        if (!hotels || hotels.length === 0) {
            return {
                priceRange: [0, 30000],
                stars: [],
                propertyType: [],
                ratings: [],
                cancellationCount: 0,
                totalHotels: 0
            };
        }

        // Extract price range
        let minPrice = Infinity;
        let maxPrice = 0;
        const starsSet = new Set();
        const ratingsSet = new Set();
        const propertyTypeMap = {};
        let cancellationCount = 0;

        hotels.forEach(hotel => {
            // Price range
            const room = hotel.rooms?.[0];
            if (room?.totalRate) {
                minPrice = Math.min(minPrice, room.totalRate);
                maxPrice = Math.max(maxPrice, room.totalRate);
            }

            // Star ratings
            if (hotel.rating) {
                starsSet.add(hotel.rating);
            }

            // Guest ratings - round to nearest integer
            if (hotel.guest_rating) {
                const ratingVal = Math.round(hotel.guest_rating);
                ratingsSet.add(ratingVal);
            }

            // Property Type - check multiple possible field names
            const propType = hotel.kind || hotel.property_type || hotel.type || hotel.hotelType;
            if (propType) {
                propertyTypeMap[propType] = (propertyTypeMap[propType] || 0) + 1;
            } else {
                // Count hotels without a property type
                propertyTypeMap['Other'] = (propertyTypeMap['Other'] || 0) + 1;
            }

            // Cancellation
            if (room?.free_cancellation_before) {
                cancellationCount++;
            }
        });

        return {
            priceRange: [minPrice === Infinity ? 0 : minPrice, maxPrice || 30000],
            stars: Array.from(starsSet).sort((a, b) => b - a).map(star => ({
                label: `${'⭐'.repeat(star)}`,
                count: hotels.filter(h => h.rating === star).length,
                value: star
            })),
            propertyType: ALLOWED_HOTEL_TYPES.map(type => {
                let count = 0;
                const matchTypes = PROPERTY_TYPE_GROUPS[type] || [type];
                count = hotels.filter(hotel => {
                    const hotelType = hotel.kind || hotel.property_type || hotel.type || hotel.hotelType || '';
                    return matchTypes.some(t => hotelType.toLowerCase() === t.toLowerCase());
                }).length;
                return {
                    label: type,
                    count: count,
                    value: type
                };
            }).sort((a, b) => b.count - a.count),
            ratings: Array.from(ratingsSet).sort((a, b) => b - a).map(rating => ({
                label: `${rating}+ stars`,
                count: hotels.filter(h => Math.round(h.guest_rating) === rating).length,
                value: rating
            })),
            cancellationCount,
            totalHotels: hotels.length
        };
    }, [hotels]);

    const applyFilters = (hotelName, priceVal, filters) => {
        let filtered = hotels.filter(hotel => {
            const room = hotel.rooms?.[0];
            const rate = room?.totalRate || 0;

            if (hotelName.trim()) {
                const hotelNameToSearch = (hotel.hotelname || hotel.id || '').toLowerCase();
                if (!hotelNameToSearch.includes(hotelName.toLowerCase())) {
                    return false;
                }
            }

            if (rate > priceVal) return false;

            if (filters.stars.length > 0 && !filters.stars.includes(hotel.rating)) {
                return false;
            }

            if (filters.propertyType.length > 0) {
                const hotelType = hotel.kind || hotel.property_type || hotel.type || hotel.hotelType || '';
                const matchesType = filters.propertyType.some(selectedType => {
                    const matchTypes = PROPERTY_TYPE_GROUPS[selectedType] || [selectedType];
                    return matchTypes.some(t => hotelType.toLowerCase() === t.toLowerCase());
                });
                if (!matchesType) return false;
            }

            // Rating filter
            if (filters.rating.length > 0) {
                const hotelRating = Math.round(hotel.guest_rating);
                const matchesRating = filters.rating.includes(hotelRating);
                if (!matchesRating) return false;
            }

            // Meals filter
            if (filters.meals.length > 0) {
                const mealType = (room?.meal || '').toLowerCase();
                const hasMatchingMeal = filters.meals.some(selectedMeal => {
                    if (selectedMeal === 'no_meals') return !mealType || mealType === 'none';
                    if (selectedMeal === 'breakfast') return mealType.includes('breakfast') && mealType.split('+').length === 1;
                    if (selectedMeal === 'breakfast_lunch') return mealType.includes('breakfast') && mealType.includes('lunch');
                    if (selectedMeal === 'breakfast_lunch') return mealType.includes('breakfast') && mealType.includes('dinner');
                    if (selectedMeal === 'all_meals') return mealType.includes('breakfast') && mealType.includes('lunch') && mealType.includes('dinner');
                    if (selectedMeal === 'all_inclusive') return mealType.includes('all-inclusive') || mealType.includes('inclusive');
                    return false;
                });
                if (!hasMatchingMeal) return false;
            }

            // Cancellation Policy filter
            if (filters.cancellationPolicy.length > 0) {
                const hasFreeCancel = room?.free_cancellation_before ? true : false;
                const hasPartialRefund = room?.refund_percentage ? true : false;
                
                const matchesPolicy = filters.cancellationPolicy.some(policy => {
                    if (policy === 'free') return hasFreeCancel;
                    if (policy === 'paid') return !hasFreeCancel && !hasPartialRefund;
                    if (policy === 'partial') return hasPartialRefund;
                    return false;
                });
                if (!matchesPolicy) return false;
            }

            // Cancellation filter (old one - can keep for backward compatibility)
            if (filters.cancellation && !room?.free_cancellation_before) {
                return false;
            }

            // Breakfast filter
            if (filters.breakfast && !room?.meal?.includes('breakfast')) {
                return false;
            }

            return true;
        });

        onFilterChange(filtered);
    };

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        setPriceRange([0, value]);
        applyFilters(hotelNameSearch, value, selectedFilters);
    };

    const handleHotelNameChange = (e) => {
        const value = e.target.value;
        setHotelNameSearch(value);
        applyFilters(value, priceRange[1], selectedFilters);
    };

    const handleCheckboxChange = (category, value) => {
        const newFilters = {
            ...selectedFilters,
            [category]: selectedFilters[category].includes(value)
                ? selectedFilters[category].filter(item => item !== value)
                : [...selectedFilters[category], value]
        };
        setSelectedFilters(newFilters);
        applyFilters(hotelNameSearch, priceRange[1], newFilters);
    };

 

    return (
        <div className="w-80 bg-white rounded-lg shadow-md border border-gray-200 sticky top-4 self-start max-h-[calc(100vh-32px)] flex flex-col">
            <div className="p-4 border-b border-gray-200 shrink-0">
                {searchData && (
                    <div className="mb-0 border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                            {typeof searchData.region_id === 'string' ? searchData.region_id : 'Destination'}
                        </p>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p>
                                {searchData.checkin && searchData.checkout
                                    ? `${searchData.checkin} — ${searchData.checkout}`
                                    : 'Date range'
                                }
                            </p>
                            <p>
                                {searchData.guests && Array.isArray(searchData.guests)
                                    ? `${searchData.guests.length} room${searchData.guests.length > 1 ? 's' : ''} for ${searchData.guests.reduce((total, room) => total + room.adults + (room.children ? room.children.length : 0), 0)} guest${searchData.guests.reduce((total, room) => total + room.adults + (room.children ? room.children.length : 0), 0) > 1 ? 's' : ''}`
                                    : 'Guests'
                                }
                            </p>
                            {searchData.residency && (
                                <p>citizenship: {searchData.residency}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
                <label className="block text-base font-semibold text-gray-900 mb-2">Hotel name</label>
                <input
                    type="text"
                    placeholder="For example, Hilton"
                    value={hotelNameSearch}
                    onChange={handleHotelNameChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
             {/* Price Range */}
            <div className="p-4 border-b border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-2">Your budget (per night)</h4>
                <p className="text-sm text-gray-700 mb-4">
                    ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}+
                </p>
                <div className="relative pt-1">
                    <input
                        type="range"
                        min={filterOptions.priceRange[0]}
                        max={filterOptions.priceRange[1]}
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        style={{
                            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((priceRange[1] - filterOptions.priceRange[0]) / (filterOptions.priceRange[1] - filterOptions.priceRange[0])) * 100}%, #e5e7eb ${((priceRange[1] - filterOptions.priceRange[0]) / (filterOptions.priceRange[1] - filterOptions.priceRange[0])) * 100}%, #e5e7eb 100%)`
                        }}
                    />
                </div>
            </div>

            {/* Cancellation Policy */}
            <div className="p-4">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Cancellation Policy</h4>
                <div className="space-y-2">
                    {CANCELLATION_OPTIONS.map((option, index) => {
                        const policyCount = hotels.filter(hotel => {
                            const room = hotel.rooms?.[0];
                            const hasFreeCancel = room?.free_cancellation_before ? true : false;
                            const hasPartialRefund = room?.refund_percentage ? true : false;
                            
                            if (option.value === 'free') return hasFreeCancel;
                            if (option.value === 'paid') return !hasFreeCancel && !hasPartialRefund;
                            if (option.value === 'partial') return hasPartialRefund;
                            return false;
                        }).length;

                        return (
                            <div key={index} className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.cancellationPolicy.includes(option.value)}
                                        onChange={() => handleCheckboxChange('cancellationPolicy', option.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">
                                        {option.label}
                                    </span>
                                </label>
                                <span className="text-sm text-gray-500">{policyCount}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Meals */}
            <div className="p-4 border-b border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Meals</h4>
                <div className="space-y-2">
                    {MEAL_OPTIONS.map((meal, index) => {
                        const mealCount = hotels.filter(hotel => {
                            const mealType = (hotel.rooms?.[0]?.meal || '').toLowerCase();
                            if (meal.value === 'no_meals') return !mealType || mealType === 'none';
                            if (meal.value === 'breakfast') return mealType.includes('breakfast');
                            if (meal.value === 'breakfast_lunch') return mealType.includes('breakfast') && (mealType.includes('lunch') || mealType.includes('dinner'));
                            if (meal.value === 'all_meals') return mealType.includes('breakfast') && mealType.includes('lunch') && mealType.includes('dinner');
                            if (meal.value === 'all_inclusive') return mealType.includes('all-inclusive') || mealType.includes('inclusive');
                            return false;
                        }).length;

                        return (
                            <div key={index} className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.meals.includes(meal.value)}
                                        onChange={() => handleCheckboxChange('meals', meal.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">
                                        {meal.label}
                                    </span>
                                </label>
                                <span className="text-sm text-gray-500">{mealCount}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Star Ratings */}
            {filterOptions.stars.length > 0 && (
                <div className="p-4 border-b border-gray-200">
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Star Rating</h4>
                    <div className="space-y-2">
                        {filterOptions.stars.map((filter, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group flex-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.stars.includes(filter.value)}
                                        onChange={() => handleCheckboxChange('stars', filter.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">
                                        {filter.label}
                                    </span>
                                </label>
                                <span className="text-sm text-gray-500">{filter.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Property Type */}
            <div className="p-4 border-b border-gray-200">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Property Type</h4>
                <div className="space-y-2">
                    {filterOptions.propertyType.map((propType, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group flex-1">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters.propertyType.includes(propType.value)}
                                    onChange={() => handleCheckboxChange('propertyType', propType.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600">
                                    {propType.label}
                                </span>
                            </label>
                            <span className="text-sm text-gray-500">{propType.count}</span>
                        </div>
                    ))}
                </div>
            </div>
            </div>
           
        </div>
    );
};

export default HotelFilters;