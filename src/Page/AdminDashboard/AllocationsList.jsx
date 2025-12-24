import React, { useState } from 'react';
import { db } from '../../firebase/firebase.config';
import { doc, updateDoc, deleteField } from 'firebase/firestore';

const AllocationsList = ({ allocations }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleVacate = async (id) => {
        if(window.confirm("Are you sure you want to vacate this seat?")) {
            await updateDoc(doc(db, "applications", id), { 
                status: "vacated", 
                seatNumber: deleteField() 
            });
        }
    };

    // Filter logic: Checks if Roll No or Name includes the search term
    const filteredAllocations = allocations.filter(item => 
        item.rollNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.seatNumber?.includes(searchTerm)
    );

    return (
        <div className="space-y-4">
            {/* Search Bar Section */}
            <div className="relative max-w-md mb-6">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    🔍
                </span>
                <input 
                    type="text" 
                    placeholder="Search by Roll No, Name, or Room..." 
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-100 rounded-xl focus:border-indigo-500 focus:outline-none transition-all bg-gray-50 text-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs font-bold text-gray-400 uppercase border-b">
                            <th className="py-4">Room</th>
                            <th>Student Name</th>
                            <th>Roll No</th>
                            <th>Department</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAllocations.map(item => (
                            <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="py-4">
                                    <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg">
                                        {item.seatNumber}
                                    </span>
                                </td>
                                <td className="font-bold text-gray-800">{item.studentName}</td>
                                <td className="text-gray-600 font-mono text-sm">{item.rollNo}</td>
                                <td className="text-gray-600">{item.department}</td>
                                <td className="text-right">
                                    <button 
                                        onClick={() => handleVacate(item.id)} 
                                        className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50 font-bold"
                                    >
                                        Vacate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredAllocations.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed">
                        <p className="text-gray-400 font-medium">No students found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllocationsList;