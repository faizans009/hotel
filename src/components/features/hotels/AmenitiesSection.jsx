import React from 'react';
import { getGroupIcon } from '../../../utils/iconMapper';

const AmenitiesSection = ({ amenityGroups }) => {
    if (!amenityGroups || amenityGroups.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Services and Amenities</h3>

            <div style={{ columnCount: '4', columnGap: '1rem' }} className="hidden md:block">
                {amenityGroups.map((group, groupIdx) => {
                    const amenities = group.amenities || [];
                    return (
                        <div
                            key={`amenity-group-${groupIdx}`}
                            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                            className="mb-4"
                        >
                            <div className="flex gap-2 mb-2">
                                <span className="text-2xl shrink-0 leading-6">
                                    {getGroupIcon(group.group_name)}
                                </span>
                                <h4 className="text-base font-extrabold text-gray-900 leading-6">
                                    {group.group_name}
                                </h4>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {amenities.map((amenity, amenityIdx) => (
                                    <span
                                        key={`${groupIdx}-${amenityIdx}`}
                                        className="text-sm text-gray-600 leading-tight"
                                    >
                                        • {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Layout - Single column */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {amenityGroups.map((group, groupIdx) => {
                    const amenities = group.amenities || [];
                    return (
                        <div key={`amenity-mobile-${groupIdx}`}>
                            <div className="flex gap-2 mb-2">
                                <span className="text-2xl shrink-0 leading-6">
                                    {getGroupIcon(group.group_name)}
                                </span>
                                <h4 className="text-base font-extrabold text-gray-900 leading-6">
                                    {group.group_name}
                                </h4>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {amenities.map((amenity, amenityIdx) => (
                                    <span
                                        key={`${groupIdx}-${amenityIdx}`}
                                        className="text-sm text-gray-600 leading-tight"
                                    >
                                        • {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AmenitiesSection;
