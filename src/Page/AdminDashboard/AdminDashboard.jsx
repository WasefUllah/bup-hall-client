import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

// --- SUB-COMPONENT: SEAT MANAGEMENT ---
const SeatManagement = () => {
    const [requests, setRequests] = useState([]);
    const [seatInput, setSeatInput] = useState("");

    useEffect(() => {
        // 1. Create a query to get only 'pending' applications
        const q = query(collection(db, "applications"), where("status", "==", "pending"));

        // 2. Listen for real-time updates
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(apps);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (id) => {
        if (!seatInput) return alert("Enter a seat number!");

        try {
            // Update the document in Firestore
            const appRef = doc(db, "applications", id);
            await updateDoc(appRef, {
                status: "approved",
                seatNumber: seatInput
            });
            
            alert(`Approved Seat ${seatInput}!`);
            setSeatInput("");
        } catch (error) {
            console.error("Error approving:", error);
            alert("Error approving seat.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Pending Seat Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dept/Roll</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{req.studentName}</div>
                                    <div className="text-sm text-gray-500">{req.studentEmail}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{req.department}</div>
                                    <div className="text-sm text-gray-500">{req.rollNo}</div>
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <input 
                                        type="text" 
                                        placeholder="Seat No" 
                                        className="border rounded p-2 text-sm w-24"
                                        onChange={(e) => setSeatInput(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => handleApprove(req.id)}
                                        className="bg-green-600 text-white px-3 py-2 rounded text-xs font-bold hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan="3" className="text-center py-8 text-gray-500">No pending requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button onClick={() => navigate('/login')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </header>
                <SeatManagement />
            </div>
        </div>
    );
};

export default AdminDashboard;