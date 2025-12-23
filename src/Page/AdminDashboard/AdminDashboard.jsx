import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SUB-COMPONENT: SEAT MANAGEMENT ---
const SeatManagement = () => {
    // Simulated Data
    const [requests, setRequests] = useState([
        { id: 1, studentId: "235490", status: "pending" },
        { id: 2, studentId: "235491", status: "pending" },
    ]);
    const [seatInput, setSeatInput] = useState("");

    const handleApprove = (id) => {
        if (!seatInput) return alert("Enter a seat number!");
        // Simulate API call
        alert(`Approved Student ${id} for Seat ${seatInput}`);
        setRequests(requests.filter(req => req.id !== id)); // Remove from list
        setSeatInput("");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Seat Requests</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td className="px-6 py-4">{req.studentId}</td>
                            <td className="px-6 py-4 text-yellow-600 font-bold">{req.status}</td>
                            <td className="px-6 py-4 flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Seat No (A-101)" 
                                    className="border rounded p-1 text-sm"
                                    onChange={(e) => setSeatInput(e.target.value)}
                                />
                                <button 
                                    onClick={() => handleApprove(req.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Approve
                                </button>
                            </td>
                        </tr>
                    ))}
                    {requests.length === 0 && <tr><td colSpan="3" className="text-center py-4">No pending requests.</td></tr>}
                </tbody>
            </table>
        </div>
    );
};

// --- SUB-COMPONENT: MEAL OVERVIEW ---
const MealOverview = () => {
    // Static stats for demo
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-700">Tomorrow's Meal Count</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow text-center border-b-4 border-blue-500">
                    <h3 className="text-gray-500">Breakfast</h3>
                    <p className="text-5xl font-bold text-blue-600 mt-2">120</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center border-b-4 border-green-500">
                    <h3 className="text-gray-500">Lunch</h3>
                    <p className="text-5xl font-bold text-green-600 mt-2">250</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow text-center border-b-4 border-red-500">
                    <h3 className="text-gray-500">Dinner</h3>
                    <p className="text-5xl font-bold text-red-600 mt-2">180</p>
                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: POST NOTICE ---
const PostNotice = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Notice Posted Successfully!");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Post a New Notice</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea rows="5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                    Post Notice
                </button>
            </form>
        </div>
    );
};

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('seats');
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
                </header>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setActiveTab('seats')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'seats' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Seat Management</button>
                    <button onClick={() => setActiveTab('meals')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'meals' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Meal Overview</button>
                    <button onClick={() => setActiveTab('notices')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'notices' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>Post Notice</button>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'seats' && <SeatManagement />}
                    {activeTab === 'meals' && <MealOverview />}
                    {activeTab === 'notices' && <PostNotice />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;