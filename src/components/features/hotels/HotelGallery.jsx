import React from 'react';
import { getImageUrl } from '../../../utils/hotelHelpers';

const HotelGallery = ({ hotel }) => {
    const allImages = hotel?.images || [];

    if (allImages.length === 0) return null;

    const mainImage = allImages.find(img =>
        img.category_slug === 'exterior' || img.category_slug === 'lobby'
    ) || allImages[0];

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {mainImage && (
                    <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg h-96">
                        <img
                            src={getImageUrl(mainImage.url, 'main')}
                            alt={hotel?.hotelname}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {allImages.length > 1 && (
                        <div className="rounded-xl overflow-hidden shadow h-44 cursor-pointer hover:shadow-lg transition">
                            <img
                                src={getImageUrl(allImages[1].url, 'secondary')}
                                alt="Hotel view 2"
                                className="w-full h-full object-cover hover:scale-105 transition"
                            />
                        </div>
                    )}
                    {allImages.length > 2 && (
                        <div className="rounded-xl overflow-hidden shadow h-44 cursor-pointer hover:shadow-lg transition">
                            <img
                                src={getImageUrl(allImages[2].url, 'secondary')}
                                alt="Hotel view 3"
                                className="w-full h-full object-cover hover:scale-105 transition"
                            />
                        </div>
                    )}
                </div>
            </div>

            {allImages.length > 3 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {allImages.slice(3, 7).map((img, idx) => (
                        <div
                            key={`gallery-${idx}`}
                            className="rounded-lg overflow-hidden shadow h-32 cursor-pointer hover:shadow-lg transition group relative"
                        >
                            <img
                                src={getImageUrl(img.url, 'thumbnail')}
                                alt={`Hotel view ${idx + 4}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                        </div>
                    ))}
                    {allImages.length > 7 && (
                        <div className="rounded-lg overflow-hidden shadow h-32 bg-gray-800 flex items-center justify-center cursor-pointer hover:shadow-lg transition relative group">
                            <img
                                src={getImageUrl(allImages[7].url, 'thumbnail')}
                                alt="Hotel view 8"
                                className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">+{allImages.length - 8}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HotelGallery;
