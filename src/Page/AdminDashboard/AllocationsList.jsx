import React from 'react';
import { db } from '../../firebase/firebase.config';
import { doc, updateDoc, deleteField } from 'firebase/firestore';

const AllocationsList = ({ allocations }) => {
    const handleVacate = async (id) => {
        if(window.confirm("Are you sure you want to vacate this seat?")) {
            await updateDoc(doc(db, "applications", id), { 
                status: "vacated", 
                seatNumber: deleteField() 
            });
        }
    };

    return (
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
                    {allocations.map(item => (
                        <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                            <td className="py-4"><span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg">{item.seatNumber}</span></td>
                            <td className="font-bold">{item.studentName}</td>
                            <td>{item.rollNo}</td>
                            <td>{item.department}</td>
                            <td className="text-right">
                                <button onClick={() => handleVacate(item.id)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50">Vacate</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {allocations.length === 0 && <p className="text-center text-gray-400 py-10">No rooms currently allocated.</p>}
        </div>
    );
};

export default AllocationsList;