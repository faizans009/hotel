import { getMealText, calculateStayInfo, getImageUrl } from '../../../utils/hotelHelpers';

const HotelCard = ({ hotel, searchData }) => {
    const room = hotel.rooms?.[0];

    if (!room) return null;

    const handleSeeAvailability = () => {
        const params = new URLSearchParams({
            hotelId: hotel.id,
            hid: hotel.hid || hotel.id,
            checkin: searchData.checkin,
            checkout: searchData.checkout,
            guests: JSON.stringify(searchData.guests),
            region_id: searchData.region_id,
            residency: searchData.residency || ''
        });
        
        window.open(`/hotel-details?${params.toString()}`, '_blank');
    };

    const { nights, adults } = calculateStayInfo(searchData);

    const imageUrl = (() => {
        if (!hotel.images || hotel.images.length === 0) {
            return 'https://via.placeholder.com/640x400?text=No+Image';
        }
        const exteriorImage = hotel.images.find(img => img.category_slug === 'exterior');
        const selectedImage = exteriorImage || hotel.images[0];

        return getImageUrl(selectedImage.url, 'secondary');
    })();

    return (
        <div className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border border-gray-200">
            <div className="flex gap-4 p-4">
                <img
                    className="w-64 h-48 rounded-lg object-cover shrink-0"
                    src={imageUrl}
                    alt={hotel.hotelname}
                />

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-xl text-blue-600 hover:underline cursor-pointer">
                                {hotel.hotelname ? hotel.hotelname : hotel.id}
                            </h3>
                            <span className="text-yellow-500">{'⭐'.repeat(hotel.rating)}</span>
                        </div>

                        <div className="mt-3 border-l-4 border-blue-500 pl-3 rounded-l-lg">
                            <h4 className="font-semibold text-base text-gray-800 mb-2">
                                {room.room_name}
                            </h4>

                            <p className="text-sm text-green-700 font-medium mb-2">
                                {getMealText(room.meal)}
                            </p>

                            {room.free_cancellation_before ? (
                                <p className="text-green-600 text-sm font-medium">
                                    ✓ Free cancellation before {room.free_cancellation_before}
                                </p>
                            ) : (
                                <p className="text-red-600 text-sm font-medium">
                                    Non-refundable
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between py-2 min-w-[200px]">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">
                            {nights} {nights === 1 ? 'night' : 'nights'}, {adults} {adults === 1 ? 'adult' : 'adults'}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            $ {room.totalRate?.toLocaleString() || '0'}
                        </p>
                    </div>
                    <button
                        onClick={handleSeeAvailability}
                        className="bg-blue-600 hover:bg-blue-700 text-white! font-semibold px-8 py-3 rounded-lg mt-4 transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        See availability →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HotelCard