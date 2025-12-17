import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import "antd/dist/reset.css";
import SearchForm from '../components/features/searchForm/SearchForm';
import HotelList from '../components/features/hotels/HotelList';
import { useState } from 'react';
import HotelFilters from '../components/features/hotels/HotelFilters';
import { Spin } from 'antd';
import PropertyTypes from '../components/features/home/PropertyTypes';
import PopularDestinations from '../components/features/home/PopularDestinations';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [searchData, setSearchData] = useState(null);

    const handleSearchResult = (hotelData, searchData) => {
        setHotels(hotelData);
        setFilteredHotels(hotelData);
        setSearchData(searchData);
    };

    const handleFilterChange = (filteredData) => {
        setFilteredHotels(filteredData);
    };

    return (
        <>
            <Header />
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-2">Find your next stay</h2>
                    <p className="text-xl mb-8">Search deals on hotels, homes, and much more...</p>
                    <div>
                        <SearchForm
                            onSearchResult={handleSearchResult}
                            setIsLoading={setIsLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Show static content when no search results, show hotel list when search results exist */}
            {isLoading ? (
                <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-96">
                    <Spin size="large" />
                </div>
            ) : hotels.length === 0 ? (
                // Static Design: Property Types and Popular Destinations
                <div>
                    <PropertyTypes />
                    <PopularDestinations />
                </div>
            ) : (
                // Hotel Results with Filters
                <div className="container mx-auto px-4 py-8 flex gap-6">
                    <HotelFilters
                        hotels={hotels}
                        onFilterChange={handleFilterChange}
                        searchData={searchData}
                    />
                    <HotelList
                        hotels={filteredHotels}
                        isLoading={isLoading}
                        searchData={searchData}
                    />
                </div>
            )}
            {/* </div> */}
            <Footer />
        </>
    )
}

export default Home