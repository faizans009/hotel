import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import parisImg from '../../../assets/paris.jpg';
import tokyoImg from '../../../assets/tokyo.jpg';
import newyorkImg from '../../../assets/newyork.jpg';
import dubaiImg from '../../../assets/dubai.jpg';
import londonImg from '../../../assets/london.jpg';
import bangkokImg from '../../../assets/bangkok.jpg';
import barcelonaImg from '../../../assets/barcelona.jpg';
import singaporeImg from '../../../assets/singapore.jpg';
import romeImg from '../../../assets/rome.jpg';
import sydneyImg from '../../../assets/sydney.jpg';
import amsterdamImg from '../../../assets/amsterdam.jpg';
import losangelesImg from '../../../assets/losangeles.jpg';

const PopularDestinations = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    const destinations = [
        {
            id: 1,
            name: 'New York',
            country: 'United States',
            accommodations: '52,340 accommodations',
            image: newyorkImg,
        },
        {
            id: 2,
            name: 'Paris',
            country: 'France',
            accommodations: '45,892 accommodations',
            image: parisImg,
        },
        {
            id: 3,
            name: 'Tokyo',
            country: 'Japan',
            accommodations: '38,567 accommodations',
            image: tokyoImg,
        },
        {
            id: 4,
            name: 'Dubai',
            country: 'United Arab Emirates',
            accommodations: '31,245 accommodations',
            image: dubaiImg,
        },
        {
            id: 5,
            name: 'London',
            country: 'United Kingdom',
            accommodations: '41,678 accommodations',
            image: londonImg,
        },
        {
            id: 6,
            name: 'Bangkok',
            country: 'Thailand',
            accommodations: '28,921 accommodations',
            image: bangkokImg,
        },
        {
            id: 7,
            name: 'Barcelona',
            country: 'Spain',
            accommodations: '35,634 accommodations',
            image: barcelonaImg,
        },
        {
            id: 8,
            name: 'Singapore',
            country: 'Singapore',
            accommodations: '19,234 accommodations',
            image: singaporeImg,
        },
        {
            id: 9,
            name: 'Rome',
            country: 'Italy',
            accommodations: '39,456 accommodations',
            image: romeImg,
        },
        {
            id: 10,
            name: 'Sydney',
            country: 'Australia',
            accommodations: '24,567 accommodations',
            image: sydneyImg,
        },
        {
            id: 11,
            name: 'Amsterdam',
            country: 'Netherlands',
            accommodations: '22,345 accommodations',
            image: amsterdamImg,
        },
        {
            id: 12,
            name: 'Los Angeles',
            country: 'United States',
            accommodations: '28,678 accommodations',
            image: losangelesImg,
        }
    ];

    const scroll = (direction) => {
        const container = document.getElementById('destinations-scroll');
        const scrollAmount = 320;

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            setScrollPosition(Math.max(0, scrollPosition - scrollAmount));
        } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            setScrollPosition(scrollPosition + scrollAmount);
        }
    };

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">Popular destinations</h2>
                <p className="text-gray-500 mb-8">Explore the most sought-after locations around the world</p>

                <div className="relative">
                    <div
                        id="destinations-scroll"
                        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {destinations.map((destination) => (
                            <div
                                key={destination.id}
                                className="flex-shrink-0 w-96 cursor-pointer group"
                            >
                                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="text-xl font-bold">{destination.name}</h3>
                                        <p className="text-sm text-gray-200">{destination.accommodations}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10 hidden md:flex items-center justify-center"
                    >
                        <ChevronLeft size={24} className="text-gray-700" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10 hidden md:flex items-center justify-center"
                    >
                        <ChevronRight size={24} className="text-gray-700" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopularDestinations;
