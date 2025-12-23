import React, { useState, useEffect } from 'react';

// --- SUB-COMPONENT: SEAT STATUS (ADMISSION) ---
const SeatStatus = () => {
    // Simulating fetching seat status from database
    const [status, setStatus] = useState({ state: 'none', seatNumber: null }); 

    const handleRequest = () => {
        // fetch('/api/student/request-seat', { method: 'POST' })
        setStatus({ state: 'payment_pending', seatNumber: 'A-101' }); // Simulated response
        alert("Seat Requested Successfully! Please pay to confirm.");
    };

    const handlePayment = () => {
        // fetch('/api/student/confirm-payment', { method: 'POST' })
        setStatus({ state: 'approved', seatNumber: 'A-101' });
        alert("Payment Successful! Seat Confirmed.");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Seat Information</h2>
            
            {status.state === 'none' && (
                <div>
                    <p className="text-lg mb-4">You have not been assigned a seat yet.</p>
                    <button onClick={handleRequest} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                        Request a Seat
                    </button>
                </div>
            )}

            {status.state === 'payment_pending' && (
                <div>
                    <p className="text-lg text-yellow-600 font-bold">Seat Assigned: {status.seatNumber}</p>
                    <p className="mb-4">Status: Payment Pending</p>
                    <button onClick={handlePayment} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
                        Pay Now to Confirm
                    </button>
                </div>
            )}

            {status.state === 'approved' && (
                <div>
                    <p className="text-xl text-green-600 font-bold">Your Confirmed Seat: {status.seatNumber}</p>
                    <p className="text-gray-500">Status: Active</p>
                </div>
            )}
        </div>
    );
};

// --- SUB-COMPONENT: NOTICES ---
const Notices = () => {
    // Static data for now (replace with fetch later)
    const notices = [
        { id: 1, title: "Hall Fest 2025", date: "2025-03-24", content: "The annual Hall Fest will be held next week!" },
        { id: 2, title: "Dining Maintenance", date: "2025-03-20", content: "Dining hall will be closed for maintenance on Friday." }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Hall Notices</h2>
            <div className="space-y-4">
                {notices.map(notice => (
                    <div key={notice.id} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="font-bold">{notice.title}</p>
                        <p className="text-sm text-gray-500">{notice.date}</p>
                        <p className="mt-2">{notice.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: COMPLAINTS ---
const Complaints = () => {
    const [complaintText, setComplaintText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!complaintText) return;
        // fetch('/api/student/complaints', ...)
        alert("Complaint Submitted: " + complaintText);
        setComplaintText("");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">File a Complaint</h2>
            <form onSubmit={handleSubmit}>
                <textarea 
                    rows="5" 
                    className="w-full p-2 border border-gray-300 rounded-md" 
                    placeholder="Describe your issue..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                ></textarea>
                <button type="submit" className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg">
                    Submit Complaint
                </button>
            </form>
        </div>
    );
};

// --- SUB-COMPONENT: MEAL MANAGER (Existing Logic) ---
const MealManager = () => {
    // ... (Paste your previous Meal Manager logic here, or keep it simple for now)
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Meal Manager</h2>
            <p>Meal planning functionality loaded here...</p> 
            {/* You can copy-paste the full meal logic from the previous step here if you want */}
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('status'); // Default tab

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => window.location.href='/login'}>Logout</button>
                </header>

                {/* Tab Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <button onClick={() => setActiveTab('status')} className={`p-4 rounded-lg font-semibold shadow transition ${activeTab === 'status' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                        Seat Status
                    </button>
                    <button onClick={() => setActiveTab('meals')} className={`p-4 rounded-lg font-semibold shadow transition ${activeTab === 'meals' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                        Meal Plan
                    </button>
                    <button onClick={() => setActiveTab('notices')} className={`p-4 rounded-lg font-semibold shadow transition ${activeTab === 'notices' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                        Notices
                    </button>
                    <button onClick={() => setActiveTab('complaints')} className={`p-4 rounded-lg font-semibold shadow transition ${activeTab === 'complaints' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
                        Complaints
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'status' && <SeatStatus />}
                    {activeTab === 'meals' && <MealManager />}
                    {activeTab === 'notices' && <Notices />}
                    {activeTab === 'complaints' && <Complaints />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;