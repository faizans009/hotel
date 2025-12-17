import React from 'react';
import { MEAL_SELECT_OPTIONS, CANCELLATION_TYPES, PAYMENT_TYPES } from '../../../constants/hotelConstants';
import { getUniqueBedTypes } from '../../../utils/hotelHelpers';

const RoomFilters = ({ hotel, filters, onFilterChange }) => {
    const bedTypes = getUniqueBedTypes(hotel);

    const handleSelectChange = (filterName, value) => {
        onFilterChange({ ...filters, [filterName]: value });
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available rooms</h3>
            <p className="text-sm text-gray-600 mb-4">
                Filter by your preferences
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-yellow-50 p-3 rounded-lg">
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Beds</label>
                    <select
                        value={filters.beds}
                        onChange={(e) => handleSelectChange('beds', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white font-medium"
                    >
                        <option value="">All options</option>
                        {bedTypes.map((bed) => (
                            <option key={bed} value={bed}>{bed}</option>
                        ))}
                    </select>
                </div>

                {/* Meals Filter */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Meals</label>
                    <select
                        value={filters.meals}
                        onChange={(e) => handleSelectChange('meals', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    >
                        <option value="">All options</option>
                        {MEAL_SELECT_OPTIONS.map((meal) => (
                            <option key={meal.code} value={meal.code}>{meal.label}</option>
                        ))}
                    </select>
                </div>

                {/* Cancellation Filter */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Cancellation</label>
                    <select
                        value={filters.cancellation}
                        onChange={(e) => handleSelectChange('cancellation', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    >
                        {CANCELLATION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                {/* Payment Filter */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Payment</label>
                    <select
                        value={filters.payment}
                        onChange={(e) => handleSelectChange('payment', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-yellow-400 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                    >
                        {PAYMENT_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default RoomFilters;
