import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';

const HotelHeader = ({ hotel }) => {
    const StarIcon = () => (
        <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );

    return (
        <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel?.hotelname || 'Hotel'}</h1>

            <div className="flex items-start gap-2 text-gray-700 mb-2">
                <IoLocationSharp className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-sm">{hotel?.address || 'No address'}</p>
                <div className="flex gap-0">
                    {Array.from({ length: hotel?.rating || 0 }).map((_, idx) => (
                        <StarIcon key={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HotelHeader;
