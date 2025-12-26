import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import Header from '../components/layout/Header'
import HotelGallery from '../components/features/hotels/HotelGallery'
import HotelHeader from '../components/features/hotels/HotelHeader'
import RoomFilters from '../components/features/hotels/RoomFilters'
import RoomsTable from '../components/features/hotels/RoomsTable'
import AmenitiesSection from '../components/features/hotels/AmenitiesSection'
import { filterRooms } from '../utils/hotelHelpers'
import { hotelAPI } from '../services/api'
import { searchDataAtom, selectedHotelAtom } from '../store/atoms/search'
import { Spin } from 'antd'

const HotelDetails = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [, setSearchData] = useAtom(searchDataAtom)
    const [, setSelectedHotel] = useAtom(selectedHotelAtom)
    const [hotel, setHotel] = useState(null)
    const [localSearchData, setLocalSearchData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filters, setFilters] = useState({
        beds: '',
        meals: '',
        cancellation: '',
        payment: ''
    })

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const hotelId = searchParams.get('hotelId')
                const hid = searchParams.get('hid')
                const checkin = searchParams.get('checkin')
                const checkout = searchParams.get('checkout')
                const guests = searchParams.get('guests')
                const region_id = searchParams.get('region_id')
                const residency = searchParams.get('residency')

                if (!hotelId || !checkin || !checkout) {
                    setError('Missing required parameters')
                    setIsLoading(false)
                    return
                }

                let parsedGuests = []
                try {
                    parsedGuests = JSON.parse(guests)
                } catch (e) {
                    parsedGuests = []
                }

                const searchDataFromParams = {
                    hotelId,
                    checkin,
                    checkout,
                    guests: parsedGuests,
                    region_id,
                    residency
                }
                setLocalSearchData(searchDataFromParams)
                // Store in Jotai for access across the app
                setSearchData(searchDataFromParams)

                const requestBody = {
                    checkin,
                    checkout,
                    residency: (residency || 'pk').toLowerCase(),
                    language: 'en',
                    guests: parsedGuests,
                    hid: parseInt(hid || hotelId) || hid || hotelId,
                    currency: 'USD'
                }

                const response = await hotelAPI.Hotel(requestBody)


                if (response.data && response.data.hotels && response.data.hotels.length > 0) {
                    const hotelData = response.data.hotels[0]
                    setHotel(hotelData)
                    // Store in Jotai for access across the app
                    setSelectedHotel(hotelData)
                } else {
                    setError('No hotel data received')
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load hotel details')
            } finally {
                setIsLoading(false)
            }
        }

        fetchHotelData()
    }, [searchParams])

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-96">
                    <Spin size="large" />
                </div>
            </div>
        )
    }

    if (error || !hotel) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-red-600">{error || 'No hotel data available'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8 text-center">
                    <p>Loading hotel details...</p>
                </div>
            </div>
        )
    }

    if (!hotel) {
        return (
            <div>
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <p className="text-red-600">No hotel data available</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        )
    }

    const filteredRooms = filterRooms(hotel.rooms, filters)

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <div className="max-w-5xl mx-auto px-6 pb-2 pt-4 mt-4">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <HotelHeader hotel={hotel} searchData={localSearchData} />
                    <HotelGallery hotel={hotel} />
                </div>
                {localSearchData && (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 px-6 mt-6 mb-4 flex items-center justify-between">
                        <div className="flex gap-16">
                            <div>
                                <p className="text-gray-600 text-sm font-semibold">Check-in</p>
                                <p className="text-blue-600 font-semibold text-sm mt-1">
                                    {new Date(localSearchData.checkin).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                    {hotel?.check_in_time && <span className="ml-2 text-gray-500">After {hotel.check_in_time}</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm font-semibold">Check-out</p>
                                <p className="text-blue-600 font-semibold text-sm mt-1">
                                    {new Date(localSearchData.checkout).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                    {hotel?.check_out_time && <span className="ml-2 text-gray-500">Before {hotel.check_out_time}</span>}
                                </p>
                            </div>
                        </div>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded transition">
                            Change
                        </button>
                    </div>
                )}

                {hotel?.rooms && hotel.rooms.length > 0 && (
                    <div className="mb-8 bg-white p-3 rounded-lg shadow-lg">
                        <RoomFilters
                            hotel={hotel}
                            filters={filters}
                            onFilterChange={setFilters}
                        />

                        <RoomsTable rooms={filteredRooms} />
                    </div>
                )}

                <AmenitiesSection amenityGroups={hotel?.amenity_groups} />
            </div>
        </div>
    )
}

export default HotelDetails
