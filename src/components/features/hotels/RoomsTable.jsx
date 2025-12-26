import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBed } from 'react-icons/md';
import { getMealText, getCancellationPolicy } from '../../../utils/hotelHelpers';

const RoomsTable = ({ rooms, hotelData }) => {
    const navigate = useNavigate();

    const groupedRooms = rooms.reduce((acc, room) => {
        const roomType = room.room_data_trans.main_room_type || room.room_data_trans.main_name || room.room_name || 'Other';
        if (!acc[roomType]) {
            acc[roomType] = [];
        }
        acc[roomType].push(room);
        return acc;
    }, {});

    const handleChooseRoom = useCallback((room) => {
        navigate('/booking-confirmation', {
            state: {
                selectedRoom: room,
                hotelData: hotelData
            }
        });
    }, [navigate, hotelData]);

    return (
        <div className="space-y-6">
            {Object.entries(groupedRooms).map(([roomType, roomList]) => {
                const beddingType = roomList[0]?.room_data_trans?.bedding_type || roomList[0]?.bedding_type || 'full double bed';
                return (
                    <div key={roomType} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-white border-b border-gray-200 p-4">
                            <h3 className="text-lg font-bold text-gray-900">{roomType}</h3>
                            <p className="text-sm text-gray-600 mt-1">{beddingType}</p>
                        </div>

                        <table className="w-full border-collapse">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-700">Room</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-700">Meals</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-700">Cancellation</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-700">NET Price</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold border border-gray-700">Payment Type</th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold border border-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomList.map((room, index) => {
                                    const policy = getCancellationPolicy(room);
                                    return (
                                        <tr key={`room-${room.roomId || index}`} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 border border-gray-200">
                                                <div className="flex items-start gap-2">
                                                    <MdBed className="w-6 h-6 text-gray-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-gray-500 text-sm">{room.main_room_type || room.main_name || room.room_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 border border-gray-200">
                                                <p className="text-green-600 font-medium text-sm">{getMealText(room.meal)}</p>
                                            </td>
                                            <td className="px-4 py-4 border border-gray-200">
                                                <p className={`font-medium text-sm ${policy.type === 'yes' ? 'text-green-600' :
                                                    policy.type === 'no' ? 'text-red-600' :
                                                        'text-gray-600'
                                                    }`}>
                                                    {policy.text}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4 border border-gray-200">
                                                <p className="text-blue-600 font-bold text-lg">${room.totalRate?.toLocaleString() || '0'}</p>
                                            </td>
                                            <td className="px-4 py-4 border border-gray-200">
                                                <p className="text-blue-500 font-medium text-sm">By card</p>
                                            </td>
                                            <td className="px-4 py-4 border border-gray-200 text-center">
                                                <button
                                                    onClick={() => handleChooseRoom(room)}
                                                    style={{ backgroundColor: '#42A8C3' }}
                                                    className="!text-white font-medium text-sm px-6 py-2 rounded transition duration-200 shadow-sm hover:shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                                                    aria-label={`Choose ${roomType} room`}
                                                >
                                                    Choose
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default RoomsTable;
