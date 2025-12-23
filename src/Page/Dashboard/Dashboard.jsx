import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SUB-COMPONENT: SEAT STATUS ---
const SeatStatus = () => {
    const navigate = useNavigate();
    // Simulating fetching seat status from database
    const [status, setStatus] = useState({ state: 'none', seatNumber: null }); 

    return (
        <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Seat Information</h2>
            
            {status.state === 'none' && (
                <div>
                    <p className="text-lg mb-4 text-gray-600">You have not been assigned a seat yet.</p>
                    {/* IMPROVEMENT: Navigates to the form instead of alerting */}
                    <button 
                        onClick={() => navigate('/hallSeatApplication')} 
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-transform hover:scale-105"
                    >
                        Request a Seat
                    </button>
                </div>
            )}

            {status.state === 'payment_pending' && (
                <div>
                    <p className="text-lg text-yellow-600 font-bold">Seat Assigned: {status.seatNumber}</p>
                    <p className="mb-4">Status: Payment Pending</p>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
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

// --- SUB-COMPONENT: MEAL MANAGER (RESTORED LOGIC) ---
const MealManager = () => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const next30Days = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            
            const savedMeals = JSON.parse(localStorage.getItem(dateString)) || {
                breakfast: false,
                lunch: false,
                dinner: false,
                done: false
            };

            next30Days.push({
                dateObject: date,
                dateString: dateString,
                ...savedMeals
            });
        }
        setDays(next30Days);
    }, []);

    const handleCheck = (index, mealType) => {
        const newDays = [...days];
        newDays[index][mealType] = !newDays[index][mealType];
        setDays(newDays);
    };

    const handleSave = (index) => {
        const day = days[index];
        const dataToSave = {
            breakfast: day.breakfast,
            lunch: day.lunch,
            dinner: day.dinner,
            done: true
        };
        localStorage.setItem(day.dateString, JSON.stringify(dataToSave));
        
        const newDays = [...days];
        newDays[index].done = true;
        setDays(newDays);
        alert(`Meals for ${day.dateObject.toDateString()} saved!`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Meal Manager</h2>
            <p className="text-sm text-gray-500 mb-6">Select meals for upcoming days. Past days are locked.</p>

            <div className="space-y-0 max-h-[500px] overflow-y-auto border rounded-lg">
                {days.map((day, index) => {
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const isPastOrToday = day.dateObject <= today;
                    const rowClass = isPastOrToday ? 'bg-gray-50 opacity-60' : 'bg-white hover:bg-blue-50';

                    return (
                        <div key={day.dateString} className={`flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100 ${rowClass}`}>
                            <div className="w-full sm:w-1/4 mb-2 sm:mb-0 text-center sm:text-left">
                                <p className="font-bold text-gray-800">
                                    {day.dateObject.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {day.dateObject.toLocaleDateString(undefined, { weekday: 'long' })}
                                </p>
                            </div>

                            <div className="w-full sm:w-1/2 flex justify-center space-x-4 mb-2 sm:mb-0">
                                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                    <label key={meal} className="flex items-center space-x-1 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="checkbox checkbox-xs checkbox-primary"
                                            checked={day[meal]}
                                            onChange={() => handleCheck(index, meal)}
                                            disabled={isPastOrToday}
                                        />
                                        <span className="capitalize text-sm">{meal.charAt(0).toUpperCase() + meal.slice(1)}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="w-full sm:w-1/4 text-center sm:text-right">
                                <button 
                                    onClick={() => handleSave(index)}
                                    disabled={isPastOrToday}
                                    className={`text-xs font-bold py-1 px-3 rounded ${
                                        day.done 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {day.done ? 'Saved' : 'Save'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: NOTICES ---
const Notices = () => {
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

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('status'); 
    const navigate = useNavigate(); // IMPROVEMENT: Using React Router hook

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="bg-white shadow-md rounded-lg p-4 mb-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
                    <div className="space-x-2">
                        {/* IMPROVEMENT: navigate instead of window.location.href */}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors" onClick={() => navigate('/studentProfile')}>Profile</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors" onClick={() => navigate('/login')}>Logout</button>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {['status', 'meals', 'notices', 'complaints'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`p-4 rounded-lg font-semibold shadow transition capitalize ${
                                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tab === 'status' ? 'Seat Status' : tab}
                        </button>
                    ))}
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