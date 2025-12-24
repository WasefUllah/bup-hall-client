import React from 'react';

const SeatGrid = ({ occupiedSeats, selectedSeat, onSelect }) => {
    const floors = [1, 2, 3, 4];
    return (
        <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase">Select Room</h4>
            <div className="space-y-4">
                {floors.map(floor => (
                    <div key={floor} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400 w-12">Floor {floor}</span>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 10 }, (_, i) => {
                                const seatNum = `${floor}${i + 1 < 10 ? '0' + (i + 1) : i + 1}`;
                                const isOccupied = occupiedSeats.includes(seatNum);
                                return (
                                    <button 
                                        key={seatNum} 
                                        type="button"
                                        onClick={() => onSelect(seatNum)} 
                                        disabled={isOccupied} 
                                        className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${isOccupied ? 'bg-red-100 text-red-400 cursor-not-allowed' : selectedSeat === seatNum ? 'bg-blue-600 text-white' : 'bg-white border hover:border-blue-500'}`}
                                    >
                                        {seatNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeatGrid;