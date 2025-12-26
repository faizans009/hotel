import React from 'react';
import { FiMapPin, FiCalendar } from 'react-icons/fi';

const BookingHotelInfo = ({ preBookingData, searchData, isLoading }) => {
    if (isLoading) {
        return (
            <div className="animate-pulse bg-white rounded-lg shadow-md p-4">
                <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-20 bg-gray-200 rounded mt-4"></div>
                </div>
            </div>
        );
    }

    const hotelData = preBookingData?.hotels?.[0];
    const rateData = hotelData?.rates?.[0];
    const paymentOption = rateData?.payment_options?.payment_types?.[0];

    if (!hotelData || !rateData) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-gray-600">Loading room details...</p>
            </div>
        );
    }

    const hotelName = hotelData.hotelname || 'Hotel';
    const hotelAddress = hotelData.address || '';
    const hotelRating = hotelData.rating || 3;
    const checkInTime = hotelData.check_in_time?.split(':').slice(0, 2).join(':') || '14:00';
    const checkOutTime = hotelData.check_out_time?.split(':').slice(0, 2).join(':') || '12:00';

    const totalRooms = searchData?.guests?.length || 1;
    const totalAdults = searchData?.guests?.reduce((sum, guest) => sum + (guest.adults || 0), 0) || 0;
    const totalChildren = searchData?.guests?.reduce((sum, guest) => sum + (Array.isArray(guest.children) ? guest.children.length : 0), 0) || 0;
    const totalGuests = totalAdults + totalChildren;

    const guestDisplay = `${totalRooms} room${totalRooms > 1 ? 's' : ''}, ${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;

    const dailyPrices = rateData.daily_prices || [];
    const nights = dailyPrices.length || 1;
    const totalPrice = parseFloat(paymentOption?.show_amount || 0);
    const nightlyPrice = dailyPrices.length > 0 ? parseFloat(dailyPrices[0]) : 0;

    const image = hotelData.images?.[0]?.url?.replace('{size}', '200x200') || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop';

    return (
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <div className="flex gap-3">
                <div className="w-24 h-24 flex-shrink-0">
                    <img
                        src={image}
                        alt={hotelName}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop'; }}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex gap-0.5">
                        <h3 className="font-bold text-gray-900 text-sm">{hotelName}</h3>
                        {[...Array(hotelRating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">★</span>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <FiMapPin className="w-3 h-3" />
                        {hotelAddress}
                    </p>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-0">
                    <div className="flex items-start gap-2 pr-3 pb-3 border-r border-gray-200">
                        <FiCalendar className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Check-in</p>
                            <p className="text-xs font-bold text-gray-900">
                                {searchData?.checkin ? new Date(searchData.checkin).toLocaleDateString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric'
                                }) : 'TBD'}
                                {checkInTime && <span className="text-gray-600 ml-1">{checkInTime}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 pl-3 pb-3">
                        <FiCalendar className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 font-semibold">Check-out</p>
                            <p className="text-xs font-bold text-gray-900">
                                {searchData?.checkout ? new Date(searchData.checkout).toLocaleDateString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric'
                                }) : 'TBD'}
                                {checkOutTime && <span className="text-gray-600 ml-1">{checkOutTime}</span>}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <div className="pt-1">
                    <p className="text-xs font-semibold text-gray-900 mb-1">Rooms and Guests</p>
                    <p className="text-xs text-gray-600">{guestDisplay}</p>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-gray-900">Price details:</p>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{nights} night{nights > 1 ? 's' : ''} × ${nightlyPrice.toFixed(2)}</span>
                        <span className="text-gray-900 font-semibold">${(nightlyPrice * nights).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <p className="text-sm font-bold text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default BookingHotelInfo;
