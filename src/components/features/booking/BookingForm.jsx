import React, { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import StripePaymentWrapper from './StripePaymentWrapper';
import { hotelAPI, paymentAPI } from '../../../services/api';
import { userAtom } from '../../../store/atoms/auth';
import { FaArrowLeft } from 'react-icons/fa';

const BookingForm = ({
    formData,
    onInputChange,
    onGuestChange,
    onSubmit,
    isLoading,
    hotel,
    bookingFormData,
    searchData,
    showPayment,
    setShowPayment
}) => {
    const navigate = useNavigate();
    const [expandedRooms, setExpandedRooms] = useState({});
    const [isCompletingBooking, setIsCompletingBooking] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const currentUser = useAtomValue(userAtom);

    const paymentAmount = useMemo(() => {
        const dataObj = bookingFormData?.data || bookingFormData;

        if (dataObj?.payment_types && Array.isArray(dataObj.payment_types)) {
            const nowPayment = dataObj.payment_types.find(
                pt => pt.type === 'now' && pt.currency_code === 'USD'
            );
            if (nowPayment) {
                return parseFloat(nowPayment.amount);
            }
        }
        return 0;
    }, [bookingFormData]);

    const handlePaymentSuccess = async (paymentIntent) => {
        setBookingError(null);
        setIsCompletingBooking(true);

        try {
            const paymentStatusResponse = await paymentAPI.checkPaymentStatus(paymentIntent?.id);

            if (!paymentStatusResponse.data?.success && !paymentStatusResponse.data?.isSuccessful) {
                throw new Error('Payment not confirmed by backend');
            }

            const pendingPayload = sessionStorage.getItem('pendingBookingPayload');

            if (!pendingPayload) {
                throw new Error('Booking data not found. Please try again.');
            }

            const bookingPayload = JSON.parse(pendingPayload);


            const response = await hotelAPI.CompleteBooking(bookingPayload);

            sessionStorage.removeItem('pendingBookingPayload');

            setIsCompletingBooking(false);
            setShowPayment(false);

            setTimeout(() => {
                alert('✅ Hotel booked successfully!');
                navigate('/');
            }, 300);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to complete booking';
            setBookingError(errorMessage);
            setIsCompletingBooking(false);
        }
    };

    const handlePaymentError = (error) => {
        setBookingError(error?.message || 'Payment failed. Please try again.');
        setIsCompletingBooking(false);
    };

    const totalGuests = useMemo(() => {
        if (searchData?.guests && Array.isArray(searchData.guests)) {
            const totalAdults = searchData.guests.reduce((sum, guest) => sum + (guest.adults || 0), 0);
            const totalChildren = searchData.guests.reduce((sum, guest) => {
                return sum + (Array.isArray(guest.children) ? guest.children.length : 0);
            }, 0);
            const total = totalAdults + totalChildren;
            return total;
        }
        return formData.guests.length;
    }, [searchData, formData.guests.length]);

    const formatDateRange = useMemo(() => {
        if (searchData?.checkin && searchData?.checkout) {
            const checkInDate = new Date(searchData.checkin).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            const checkOutDate = new Date(searchData.checkout).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            return `${checkInDate} - ${checkOutDate}`;
        }
        return 'N/A';
    }, [searchData]);

    return (
        <>
            {showPayment ? (
                <div className="space-y-6">
                    <div className="pb-8 border-b border-gray-200">
                        <button
                            onClick={() => setShowPayment(false)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            <FaArrowLeft /> Back to Guest Details
                        </button>
                    </div>

                    {isCompletingBooking && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                                Completing your booking...
                            </div>
                        </div>
                    )}

                    {bookingError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            <p className="font-semibold">Booking Error</p>
                            <p className="text-sm">{bookingError}</p>
                        </div>
                    )}

                    {!isCompletingBooking && (
                        <StripePaymentWrapper
                            amount={paymentAmount}
                            hotelId={hotel.id}
                            bookingData={{
                                guestName: formData.guests[0]?.firstName + ' ' + formData.guests[0]?.lastName,
                                email: '',
                                bookingPayload: (() => {
                                    const dataObj = bookingFormData?.data || bookingFormData;
                                    const depositPayment = dataObj?.payment_types?.find(
                                        pt => pt.type === 'deposit' && pt.currency_code === 'USD'
                                    );

                                    const rooms = formData.guests.map(guest => {
                                        const guestsList = [];

                                        guestsList.push({
                                            first_name: guest.firstName || '',
                                            last_name: guest.lastName || ''
                                        });

                                        if (guest.additionalGuests && Array.isArray(guest.additionalGuests)) {
                                            guest.additionalGuests.forEach(additionalGuest => {
                                                if (additionalGuest?.firstName || additionalGuest?.lastName) {
                                                    guestsList.push({
                                                        first_name: additionalGuest.firstName || '',
                                                        last_name: additionalGuest.lastName || ''
                                                    });
                                                }
                                            });
                                        }

                                        if (guest.childGuests && Array.isArray(guest.childGuests)) {
                                            guest.childGuests.forEach(childGuest => {
                                                if (childGuest?.firstName || childGuest?.lastName) {
                                                    guestsList.push({
                                                        first_name: childGuest.firstName || '',
                                                        last_name: childGuest.lastName || ''
                                                    });
                                                }
                                            });
                                        }

                                        return {
                                            guests: guestsList
                                        };
                                    });

                                    return {
                                        order_id: dataObj?.order_id,
                                        partner: {
                                            partner_order_id: dataObj?.partner_order_id,
                                        },
                                        item_id: dataObj?.item_id,
                                        language: 'en',
                                        user: {
                                            email: currentUser?.email,
                                            phone: formData.phone,
                                            ...(formData.specialRequests && { comment: formData.specialRequests }),
                                        },
                                        payment_type: depositPayment && {
                                            amount: depositPayment.amount,
                                            currency_code: depositPayment.currency_code,
                                            type: depositPayment.type,
                                        },
                                        rooms: rooms,
                                    };
                                })()
                            }}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                        />
                    )}
                </div>
            ) : (
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Booking details</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Dates</p>
                                <p className="text-sm text-gray-900 font-medium">
                                    {formatDateRange}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Guests</p>
                                <p className="text-sm text-gray-900 font-medium">
                                    {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Guest Info</h2>
                        <p className="text-sm text-gray-600 mb-6">Guest names must match the valid ID which will be used at check-in.</p>

                        <div className="space-y-8">
                            {searchData?.guests && Array.isArray(searchData.guests) ? (
                                searchData.guests.map((room, roomIndex) => {
                                    const roomAdults = room.adults || 0;
                                    const roomChildren = Array.isArray(room.children) ? room.children : [];
                                    const totalRoomGuests = roomAdults + roomChildren.length;

                                    return (
                                        <div key={roomIndex} className="border border-gray-200 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-6">

                                                <span className="text-sm text-gray-500 font-medium">Room {roomIndex + 1}</span>
                                            </div>

                                            <div className="mb-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-red-600 mb-2">
                                                            Guest's name<span className="text-red-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="First name"
                                                            value={formData.guests[roomIndex]?.firstName || ''}
                                                            onChange={(e) => onGuestChange(roomIndex, 'firstName', e.target.value)}
                                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-red-600 mb-2">
                                                            Guest's last name<span className="text-red-600">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Last name"
                                                            value={formData.guests[roomIndex]?.lastName || ''}
                                                            onChange={(e) => onGuestChange(roomIndex, 'lastName', e.target.value)}
                                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {totalRoomGuests > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedRooms(prev => ({ ...prev, [roomIndex]: !prev[roomIndex] }))}
                                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm mb-6 transition-colors"
                                                >
                                                    <span className="text-lg">👥</span>
                                                    {expandedRooms[roomIndex] ? 'Remove names of other guests' : 'Add names of other guests'}
                                                </button>
                                            )}

                                            {expandedRooms[roomIndex] && totalRoomGuests > 1 && (
                                                <div className="space-y-4 pt-4 border-t border-gray-200">
                                                    {Array.from({ length: roomAdults - 1 }).map((_, guestIndex) => (
                                                        <div key={`adult-${guestIndex}`}>
                                                            <div className="inline-block  text-gray-900 text-xs font-bold px-3 py-1 rounded mb-3">
                                                                Guest {guestIndex + 2}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Guest's name"
                                                                    value={formData.guests[roomIndex]?.additionalGuests?.[guestIndex]?.firstName || ''}
                                                                    onChange={(e) => {
                                                                        setFormData(prev => {
                                                                            const updatedGuests = [...prev.guests];
                                                                            if (!updatedGuests[roomIndex].additionalGuests) {
                                                                                updatedGuests[roomIndex].additionalGuests = [];
                                                                            }
                                                                            if (!updatedGuests[roomIndex].additionalGuests[guestIndex]) {
                                                                                updatedGuests[roomIndex].additionalGuests[guestIndex] = { firstName: '', lastName: '' };
                                                                            }
                                                                            updatedGuests[roomIndex].additionalGuests[guestIndex].firstName = e.target.value;
                                                                            return { ...prev, guests: updatedGuests };
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Guest's last name"
                                                                    value={formData.guests[roomIndex]?.additionalGuests?.[guestIndex]?.lastName || ''}
                                                                    onChange={(e) => {
                                                                        setFormData(prev => {
                                                                            const updatedGuests = [...prev.guests];
                                                                            if (!updatedGuests[roomIndex].additionalGuests) {
                                                                                updatedGuests[roomIndex].additionalGuests = [];
                                                                            }
                                                                            if (!updatedGuests[roomIndex].additionalGuests[guestIndex]) {
                                                                                updatedGuests[roomIndex].additionalGuests[guestIndex] = { firstName: '', lastName: '' };
                                                                            }
                                                                            updatedGuests[roomIndex].additionalGuests[guestIndex].lastName = e.target.value;
                                                                            return { ...prev, guests: updatedGuests };
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {roomChildren.map((child, childIndex) => (
                                                        <div key={`child-${childIndex}`}>
                                                            <div className="inline-block  text-gray-900 text-xs font-bold px-3 py-1 rounded mb-3">
                                                                Child
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Name of the child"
                                                                    value={formData.guests[roomIndex]?.childGuests?.[childIndex]?.firstName || ''}
                                                                    onChange={(e) => {
                                                                        setFormData(prev => {
                                                                            const updatedGuests = [...prev.guests];
                                                                            if (!updatedGuests[roomIndex].childGuests) {
                                                                                updatedGuests[roomIndex].childGuests = [];
                                                                            }
                                                                            if (!updatedGuests[roomIndex].childGuests[childIndex]) {
                                                                                updatedGuests[roomIndex].childGuests[childIndex] = { firstName: '', lastName: '' };
                                                                            }
                                                                            updatedGuests[roomIndex].childGuests[childIndex].firstName = e.target.value;
                                                                            return { ...prev, guests: updatedGuests };
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Surname of the child"
                                                                    value={formData.guests[roomIndex]?.childGuests?.[childIndex]?.lastName || ''}
                                                                    onChange={(e) => {
                                                                        setFormData(prev => {
                                                                            const updatedGuests = [...prev.guests];
                                                                            if (!updatedGuests[roomIndex].childGuests) {
                                                                                updatedGuests[roomIndex].childGuests = [];
                                                                            }
                                                                            if (!updatedGuests[roomIndex].childGuests[childIndex]) {
                                                                                updatedGuests[roomIndex].childGuests[childIndex] = { firstName: '', lastName: '' };
                                                                            }
                                                                            updatedGuests[roomIndex].childGuests[childIndex].lastName = e.target.value;
                                                                            return { ...prev, guests: updatedGuests };
                                                                        });
                                                                    }}
                                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-bold text-gray-900">Guest 1</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label htmlFor="firstName-0" className="block text-sm font-medium text-gray-900 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                id="firstName-0"
                                                type="text"
                                                value={formData.guests[0]?.firstName || ''}
                                                onChange={(e) => onGuestChange(0, 'firstName', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                placeholder="First Name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName-0" className="block text-sm font-medium text-gray-900 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                id="lastName-0"
                                                type="text"
                                                value={formData.guests[0]?.lastName || ''}
                                                onChange={(e) => onGuestChange(0, 'lastName', e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                                placeholder="Last Name"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Phone Number</h2>
                        <p className="text-sm text-gray-500 mb-6">We'll use this to confirm your booking</p>

                        <div className="max-w-md">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Phone Number<span className="text-red-600">*</span></label>
                            <PhoneInput
                                country={'pk'}
                                value={formData.phone || ''}
                                onChange={(phone) => onInputChange({ target: { name: 'phone', value: phone } })}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    autoFocus: false,
                                    placeholder: 'Enter phone number'
                                }}
                                containerClass="w-full"
                                inputClass="w-full px-3 py-2.5 border border-gray-300 rounded-r-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                                buttonClass="px-3 py-2.5 border border-gray-300 border-r-0 rounded-l-lg hover:bg-gray-50 transition-colors bg-white cursor-pointer text-lg"
                                dropdownClass="rounded-lg shadow-lg text-sm"
                                enableAreaCodes={false}
                                preferredCountries={['pk', 'us', 'gb', 'ae', 'sa', 'in']}
                                searchPlaceholder="Search..."
                                disableDropdown={false}
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Special Requests <span className="text-sm font-normal text-gray-600">(optional)</span>
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">The property will do its best, but cannot guarantee to fulfil all requests</p>
                        <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={onInputChange}
                            placeholder="Let the property know if there's anything they can assist you with."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-gray-900 placeholder-gray-400 min-h-32"
                        />
                    </div>


                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setShowPayment(true)}
                            disabled={isLoading}
                            style={{ backgroundColor: '#0057FF' }}
                            className="hover:opacity-90 !text-white font-semibold py-3 px-8 rounded-lg transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            )}
        </>
    );
};

export default BookingForm;



