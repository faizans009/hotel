import { useState, useMemo, useCallback } from "react";
import { useCountries } from "../../hooks/useCountries";

export default function DestinationSearch({ onSelect }) {
    const { data: countries, isLoading, error } = useCountries();
    const [showDropdown, setShowDropdown] = useState(false);
    const [query, setQuery] = useState("");

    const destinations = useMemo(() => {
        if (!countries?.length) return [];
        return countries.flatMap(country =>
            (country.cities || []).map(city => ({
                label: `${city.name}, ${country.name}`,
                country: country.name,
                city: city.name,
                region_id: city.region_id || null,
            }))
        );
    }, [countries]);

    const filtered = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return destinations.filter(d =>
            d.label.toLowerCase().includes(lowerQuery)
        ).slice(0, 50);
    }, [destinations, query]);

    const handleInputChange = useCallback((e) => {
        const newValue = e.target.value;
        setQuery(newValue);
        setShowDropdown(true);
    }, []);

    const handleSelect = useCallback((destination) => {
        setQuery(destination.label);
        onSelect(destination);
        setShowDropdown(false);
    }, [onSelect]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="City, hotel, or destination"
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800! placeholder-gray-400 focus:outline-none focus:border-blue-600 w-full"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {showDropdown && query && (
                <ul className="absolute top-full left-0 bg-white border rounded-lg shadow-lg w-full mt-1 max-h-64 overflow-y-auto z-50">
                    {isLoading && (
                        <li className="px-4 py-2 text-gray-500">Loading destinations...</li>
                    )}
                    {error && (
                        <li className="px-4 py-2 text-red-500">Failed to load destinations</li>
                    )}
                    {!isLoading && !error && filtered.length === 0 && (
                        <li className="px-4 py-2 text-gray-500">No results found</li>
                    )}
                    {!isLoading && !error &&
                        filtered.map((d, index) => (
                            <li
                                key={`${d.city}-${d.country}-${index}`}
                                className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelect(d)}
                            >
                                {d.label}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}