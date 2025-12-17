import React, { useState, useRef, useEffect } from 'react';

const GuestInput = ({ onGuestsChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState([
        { id: 1, adults: 2, children: [] }
    ]);
    const selectRefs = useRef({});

    const getTotalGuests = () => {
        const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
        const totalChildren = rooms.reduce((sum, room) => sum + room.children.length, 0);
        return totalAdults + totalChildren;
    };

    useEffect(() => {
        if (onGuestsChange) {
            onGuestsChange({ rooms, totalGuests: getTotalGuests() });
        }
    }, []);


    const updateAdults = (roomId, change) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                const newAdults = Math.max(1, Math.min(6, room.adults + change));
                return { ...room, adults: newAdults };
            }
            return room;
        }));
    };

    const addChild = (roomId) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId && room.children.length < 4) {
                const newChildren = [...room.children, null];
                setTimeout(() => {
                    const selectKey = `${roomId}-${newChildren.length - 1}`;
                    if (selectRefs.current[selectKey]) {
                        selectRefs.current[selectKey].focus();
                        selectRefs.current[selectKey].click();
                    }
                }, 0);
                return { ...room, children: newChildren };
            }
            return room;
        }));
    };

    const removeChild = (roomId, childIndex) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                return {
                    ...room,
                    children: room.children.filter((_, index) => index !== childIndex)
                };
            }
            return room;
        }));
    };

    const updateChildAge = (roomId, childIndex, age) => {
        setRooms(rooms.map(room => {
            if (room.id === roomId) {
                const newChildren = [...room.children];
                newChildren[childIndex] = parseInt(age);
                return { ...room, children: newChildren };
            }
            return room;
        }));
    };

    const addRoom = () => {
        const newId = Math.max(...rooms.map(r => r.id)) + 1;
        setRooms([...rooms, { id: newId, adults: 2, children: [] }]);
    };

    const removeRoom = (roomId) => {
        if (rooms.length > 1) {
            setRooms(rooms.filter(room => room.id !== roomId));
        }
    };

    const handleDone = () => {
        setIsOpen(false);
        if (onGuestsChange) {
            onGuestsChange({ rooms, totalGuests: getTotalGuests() });
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:border-blue-600 flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
                style={{ color: '#1f2937' }}
            >
                <span style={{ color: '#1f2937' }}>
                    {rooms.length} room{rooms.length > 1 ? 's' : ''} for {getTotalGuests()} guest{getTotalGuests() > 1 ? 's' : ''}
                </span>
                <svg className="w-5 h-5" style={{ color: '#1f2937' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 p-4" style={{ border: '1px solid #e5e7eb', minWidth: '400px' }}>
                    {rooms.map((room, index) => (
                        <div key={room.id} className="mb-4 pb-4" style={{ borderBottom: rooms.length > 1 && index < rooms.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold" style={{ color: '#1f2937' }}>Room {index + 1}</h3>
                                {rooms.length > 1 && (
                                    <button
                                        onClick={() => removeRoom(room.id)}
                                        className="text-sm font-medium"
                                        style={{ color: '#dc2626' }}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Adults Section */}
                                <div>
                                    <div className="text-sm mb-2" style={{ color: '#6b7280' }}>Adults</div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateAdults(room.id, -1)}
                                            disabled={room.adults <= 1}
                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                            style={{ border: '1px solid #d1d5db', color: '#1f2937' }}
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium" style={{ color: '#1f2937' }}>{room.adults}</span>
                                        <button
                                            onClick={() => updateAdults(room.id, 1)}
                                            disabled={room.adults >= 6}
                                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                                            style={{ border: '1px solid #d1d5db', color: '#1f2937' }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Children Section */}
                                <div>
                                    <div className="text-sm mb-2" style={{ color: '#6b7280' }}>Children</div>
                                    {room.children.length === 0 ? (
                                        <button
                                            onClick={() => addChild(room.id)}
                                            className="w-full px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                                            style={{ border: '1px solid #d1d5db', color: '#6b7280' }}
                                        >
                                            Add a child
                                        </button>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {room.children.map((age, childIndex) => (
                                                <div key={childIndex} className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: '#f3f4f6' }}>
                                                    <select
                                                        ref={(el) => selectRefs.current[`${room.id}-${childIndex}`] = el}
                                                        value={age === null ? '' : age}
                                                        onChange={(e) => updateChildAge(room.id, childIndex, e.target.value)}
                                                        className="text-xs border-0 bg-transparent focus:outline-none"
                                                        style={{ color: '#1f2937', width: '70px' }}
                                                    >
                                                        <option value="" disabled style={{ color: '#9ca3af' }}>Select age</option>
                                                        {[...Array(13)].map((_, i) => {
                                                            const age = i + 1;
                                                            return (
                                                                <option key={i} value={age} style={{ color: '#1f2937' }}>
                                                                    {age === 1 ? '1 year' : `${age} years`}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    <button
                                                        onClick={() => removeChild(room.id, childIndex)}
                                                        className="hover:opacity-70"
                                                        style={{ color: '#dc2626', fontSize: '14px' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            {room.children.length < 4 && (
                                                <button
                                                    onClick={() => addChild(room.id)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50"
                                                    style={{ border: '1px solid #d1d5db', color: '#1f2937' }}
                                                >
                                                    +
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                        <button
                            onClick={addRoom}
                            className="text-sm font-medium"
                            style={{ color: '#2563eb' }}
                        >
                            + Add a room
                        </button>
                        <button
                            onClick={handleDone}
                            className="px-8 py-2 font-semibold rounded-lg"
                            style={{ backgroundColor: '#fbbf24', color: '#1f2937' }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuestInput;