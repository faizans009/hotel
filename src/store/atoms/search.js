import { atom } from 'jotai'

/**
 * Search Data Atom - Stores search parameters from the search form
 * Persists across page navigation without props drilling
 * 
 * Data structure:
 * {
 *   hotelId: string,
 *   checkin: string (YYYY-MM-DD),
 *   checkout: string (YYYY-MM-DD),
 *   guests: Array<{adults: number, children: array}>,
 *   region_id: string,
 *   residency: string (country code)
 * }
 */
export const searchDataAtom = atom(null)

/**
 * Selected Hotel Atom - Stores the currently selected hotel data
 * Includes full hotel details, rates, and amenities
 */
export const selectedHotelAtom = atom(null)
