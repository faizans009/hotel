import React from 'react';
import {
    MdLocalFireDepartment,
    MdMeetingRoom,
    MdRestaurant,
    MdBusiness,
    MdSportsSoccer,
    MdSpa,
    MdChildCare,
    MdPets,
    MdHealthAndSafety,
    MdWifi,
    MdLocalTaxi,
    MdAccessible,
    MdCleaningServices,
    MdLocationCity,
    MdOutlineEvent,
    MdLanguage,
    MdLocalParking
} from 'react-icons/md';

// Map amenity group names to icons
const AMENITY_ICON_MAP = {
    'popular': MdLocalFireDepartment,
    'room': MdMeetingRoom,
    'meal': MdRestaurant,
    'business': MdBusiness,
    'sport': MdSportsSoccer,
    'fitness': MdSportsSoccer,
    'beauty': MdSpa,
    'wellness': MdSpa,
    'kid': MdChildCare,
    'pet': MdPets,
    'health': MdHealthAndSafety,
    'safety': MdHealthAndSafety,
    'internet': MdWifi,
    'wifi': MdWifi,
    'transfer': MdLocalTaxi,
    'taxi': MdLocalTaxi,
    'accessibility': MdAccessible,
    'service': MdCleaningServices,
    'amenities': MdCleaningServices,
    'general': MdLocationCity,
    'parking': MdLocalParking,
    'pool': MdWifi,
    'beach': MdWifi,
    'tourist': MdOutlineEvent,
    'language': MdLanguage
};

/**
 * Get icon component for amenity group
 * @param {string} groupName - Amenity group name
 * @returns {JSX.Element} Icon component
 */
export const getGroupIcon = (groupName) => {
    if (!groupName) return null;

    const nameLC = groupName.toLowerCase();
    const matchedKey = Object.keys(AMENITY_ICON_MAP).find(key =>
        nameLC.includes(key)
    );

    const IconComponent = matchedKey ? AMENITY_ICON_MAP[matchedKey] : null;

    if (!IconComponent) return null;

    return IconComponent ? React.createElement(IconComponent, { className: 'w-5 h-5' }) : null;
};
