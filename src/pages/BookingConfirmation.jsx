import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import Header from '../components/layout/Header';
import { FaArrowLeft } from 'react-icons/fa';
import HotelHeader from '../components/features/hotels/HotelHeader';
import BookingHotelInfo from '../components/features/booking/BookingHotelInfo';
import BookingForm from '../components/features/booking/BookingForm';
import { hotelAPI, paymentAPI } from '../services/api';
import { searchDataAtom, selectedHotelAtom } from '../store/atoms/search';
import { userAtom } from '../store/atoms/auth';

const STATIC_HOTEL_DATA = {
    name: 'Hotel',
    address: 'Address',
    rating: 3,
    checkIn: 'TBD',
    checkOut: 'TBD',
    roomType: 'Room',
    guests: 'Guests',
    price: 0,
    nights: 0
};

const BookingConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchData, setLocalSearchData] = useState(null);
    const [jotaiSearchData] = useAtom(searchDataAtom);
    const [currentUser] = useAtom(userAtom);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [hotelData, setHotelData] = useState(null);
    const [preBookingData, setPreBookingData] = useState(null);
    const [bookingFormData, setBookingFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    const [formData, setFormData] = useState({
        citizenship: 'Pakistan',
        guests: [{ firstName: '', lastName: '' }],
        specialRequests: '',
        phone: '',
        paymentMethod: 'book-now-pay-later',
        clientPrice: '',
        commission: 0,
        commissionType: '%'
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const bookingSuccess = searchParams.get('booking_success');

        if (bookingSuccess === 'true') {
            console.log('✅ Booking was successful');
        }
    }, []);

    useEffect(() => {
        if (location.state?.selectedRoom) {
            setSelectedRoom(location.state.selectedRoom);
        }
        if (location.state?.hotelData) {
            setHotelData(location.state.hotelData);
        }
        if (jotaiSearchData) {
            setLocalSearchData(jotaiSearchData);
        }
    }, [location.state, jotaiSearchData]);

    useEffect(() => {
        if (jotaiSearchData?.guests && Array.isArray(jotaiSearchData.guests)) {
            const numRooms = jotaiSearchData.guests.length;
            setFormData(prev => ({
                ...prev,
                guests: Array.from({ length: numRooms }, () => ({
                    firstName: '',
                    lastName: '',
                    additionalGuests: [],
                    childGuests: []
                }))
            }));
        }
    }, [jotaiSearchData?.guests]);

    useEffect(() => {
        const fetchBookingData = async () => {
            if (!selectedRoom?.book_hash) {
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const prebookResponse = await hotelAPI.PreBooking({
                    hash: selectedRoom.book_hash
                });

                if (prebookResponse.data) {
                    setPreBookingData(prebookResponse.data);

                    const bookHash = prebookResponse.data?.hotels?.[0]?.rates?.[0]?.book_hash;

                    if (bookHash) {
                        try {
                            const bookingFormResponse = await hotelAPI.BookingForm({
                                book_hash: bookHash,
                                language: 'en'
                            });

                            const bookingData = bookingFormResponse.data?.data || bookingFormResponse.data;
                            setBookingFormData(bookingData);
                            console.log('Setting bookingFormData to:', bookingData);
                        } catch (err) {
                            console.error('BookingForm error:', err);
                        }
                    }
                }
            } catch (err) {
                console.error('PreBooking error:', err);
                setError('Failed to load room details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookingData();
    }, [selectedRoom?.book_hash]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleGuestChange = useCallback((index, field, value) => {
        setFormData(prev => ({
            ...prev,
            guests: prev.guests.map((guest, i) =>
                i === index ? { ...guest, [field]: value } : guest
            )
        }));
    }, []);

    const addGuest = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            guests: [...prev.guests, { firstName: '', lastName: '' }]
        }));
    }, []);

    const removeGuest = useCallback((index) => {
        if (formData.guests.length > 1) {
            setFormData(prev => ({
                ...prev,
                guests: prev.guests.filter((_, i) => i !== index)
            }));
        }
    }, [formData.guests.length]);

    const handlePaymentMethodChange = useCallback((method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!formData.guests[0].firstName || !formData.guests[0].lastName) {
                setError('Please enter guest information');
                return;
            }


            console.log('Form data:', formData);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const hotel = useMemo(() => {
        return preBookingData || hotelData || STATIC_HOTEL_DATA;
    }, [preBookingData, hotelData]);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {!showPayment && (
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        aria-label="Return to room selection"
                    >
                        <FaArrowLeft /> Return to room selection
                    </button>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                    <div className="lg:col-span-2">
                        <BookingForm
                            formData={formData}
                            onInputChange={handleInputChange}
                            onGuestChange={handleGuestChange}
                            onAddGuest={addGuest}
                            onRemoveGuest={removeGuest}
                            onPaymentMethodChange={handlePaymentMethodChange}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            hotel={hotel}
                            searchData={searchData}
                            bookingFormData={bookingFormData}
                            showPayment={showPayment}
                            setShowPayment={setShowPayment}
                        />
                    </div>

                    <div className="h-fit">
                        <BookingHotelInfo
                            preBookingData={preBookingData}
                            searchData={searchData}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
