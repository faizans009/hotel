import { useState } from 'react'
import countryList from "country-list";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import DestinationSearch from '../../common/DestinationSearch';
import GuestInput from './GuestInput';
const { RangePicker } = DatePicker;
import { hotelAPI } from '../../../services/api';


const SearchForm = ({ onSearchResult, setIsLoading }) => {
    const [selectedDestination, setSelectedDestination] = useState(null);
    const countries = countryList.getData();
    const [guestInfo, setGuestInfo] = useState(null);
    const [dateRange, setDateRange] = useState(null);
    const [residency, setResidency] = useState('');

    const handleSearch = () => {

        if (!selectedDestination) {
            alert('Please select a destination');
            return;
        }

        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            alert('Please select check-in and check-out dates');
            return;
        }

        if (!residency) {
            alert('Please select your residency');
            return;
        }

        if (!guestInfo || !guestInfo.rooms || guestInfo.rooms.length === 0) {
            alert('Please add guest information');
            return;
        }

        const formattedGuests = guestInfo.rooms.map(room => ({
            adults: room.adults,
            children: room.children
        }));

        const data = {
            region_id: selectedDestination.region_id,
            checkin: dateRange[0],
            checkout: dateRange[1],
            residency: residency,
            currency: 'USD',
            language: 'en',
            guests: formattedGuests
        }
        setIsLoading(true);
        console.log("data", data)

        hotelAPI.searchHotels(data)
            .then(response => {
                onSearchResult(response.data.hotels, data);
            })
            .catch(error => {
                console.error('Search Error:', error);
                console.error('Error Response:', error.response?.data);
                console.error('Error Status:', error.response?.status);
                alert(`Search failed: ${error.response?.data?.message || 'Server error. Please contact support.'}`);
            })
            .finally(() => {
                setIsLoading(false);
            });

    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-semibold mb-2">
                        Destination
                    </label>
                    <DestinationSearch
                        value={selectedDestination}
                        onSelect={(d) => setSelectedDestination(d)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-semibold mb-2">
                        Check-in / Check-out
                    </label>
                    <RangePicker
                        className="rounded-md w-full !h-11 !px-4  py-3 border border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder={['Check-in', 'Check-out']}
                        format="YYYY-MM-DD"
                        onChange={(dates, dateStrings) => {
                            setDateRange(dateStrings);
                        }}
                        disabledDate={(current) => {
                            return current && current < new Date().setHours(0, 0, 0, 0);
                        }}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-semibold mb-2">
                        Residency
                    </label>
                    <select
                        className="px-4 py-3 border border-gray-300 rounded-lg !text-gray-800 bg-white focus:outline-none focus:border-blue-600"
                        onChange={(e) => setResidency(e.target.value)}
                        value={residency}
                    >
                        <option value="" className="text-gray-800">Select residency</option>
                        {countries.map((c) => (
                            <option key={c.code} value={c.code} className="text-gray-800">
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-semibold mb-2">
                        Guests and Rooms
                    </label>
                    <GuestInput onGuestsChange={(data) => setGuestInfo(data)} />
                </div>
                <div className="flex flex-col">
                    <label className="text-gray-700 text-sm font-semibold mb-2 invisible">
                        Search
                    </label>
                    <button
                        onClick={handleSearch}
                        className="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchForm
