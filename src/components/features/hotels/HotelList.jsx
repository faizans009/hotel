import React from 'react'
import HotelCard from './HotelCard';

const HotelList = ({ hotels, isLoading, searchData }) => {
    if (isLoading) {
        return (
            <div className="flex-1">
                <p className="text-gray-600">Loading hotels...</p>
            </div>
        );
    }

    if (!hotels || hotels.length === 0) {
        return (
            <div className="flex-1">
                <p className="text-gray-600">No hotels found. Try searching for a destination.</p>
            </div>
        );
    }

    return (
        <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Available Hotels ({hotels.length})</h2>
            <div className="grid grid-cols-1 gap-4">
                {hotels.map((hotel) => (
                    <HotelCard
                        hotel={hotel}
                        key={hotel.id || hotel.hid}
                        searchData={searchData}
                    />
                ))}
            </div>
        </div>
    )
}

export default HotelList