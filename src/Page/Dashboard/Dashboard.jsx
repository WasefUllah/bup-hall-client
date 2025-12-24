import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';

// --- ICONS ---
const Icons = {
    Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Food: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Bell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    Chat: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    Gate: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

// ... (KEEP SeatStatus, MealManager, Notices, Complaints COMPONENTS AS THEY ARE) ...
import SeatStatus from './SeatStatus';
import MealManager from './MealManager';
import Notices from './Notices';
import Complaints from './Complaints';

// --- NEW COMPONENT: LEAVE APPLICATION ---
const LeaveApplication = () => {
    const { user } = useContext(AuthContext);
    const [type, setType] = useState('late_entry'); // 'late_entry' or 'night_stay'
    const [reason, setReason] = useState("");
    const [date, setDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [guardianPhone, setGuardianPhone] = useState("");
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "leave_requests"), where("studentEmail", "==", user.email), orderBy("timestamp", "desc"));
        const unsub = onSnapshot(q, (snap) => setHistory(snap.docs.map(d => ({id: d.id, ...d.data()}))));
        return () => unsub();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "leave_requests"), {
                studentEmail: user.email,
                type,
                reason,
                date,
                returnDate: type === 'night_stay' ? returnDate : date,
                guardianPhone: type === 'night_stay' ? guardianPhone : 'N/A',
                status: 'pending',
                timestamp: new Date()
            });
            alert("Request Submitted!");
            setReason(""); setDate(""); setReturnDate(""); setGuardianPhone("");
        } catch (err) {
            console.error(err);
            alert("Error submitting request.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Gate Pass Application</h2>
                <p className="text-sm text-gray-500 mb-6">Strict timing rules apply. Late entry after 10 PM requires approval.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Toggle Type */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                        <button 
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === 'late_entry' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setType('late_entry')}
                        >
                            Late Entry
                        </button>
                        <button 
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${type === 'night_stay' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setType('night_stay')}
                        >
                            Night Stay
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason</label>
                        <input className="input input-bordered w-full text-gray-500 bg-gray-50" placeholder="e.g. Family Emergency, Group Study" value={reason} onChange={e=>setReason(e.target.value)} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{type === 'night_stay' ? 'Leaving Date' : 'Date'}</label>
                            <input type="date" className="input input-bordered w-full text-gray-500 bg-gray-50" value={date} onChange={e=>setDate(e.target.value)} required />
                        </div>
                        {type === 'night_stay' && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Return Date</label>
                                <input type="date" className="input input-bordered w-full text-gray-500 bg-gray-50" value={returnDate} onChange={e=>setReturnDate(e.target.value)} required />
                            </div>
                        )}
                    </div>

                    {type === 'night_stay' && (
                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                            <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Guardian Contact (For Verification)</label>
                            <input type="tel" className="input input-bordered w-full input-sm" placeholder="017XXXXXXXX" value={guardianPhone} onChange={e=>setGuardianPhone(e.target.value)} required />
                        </div>
                    )}

                    <button className={`btn w-full text-white ${type === 'late_entry' ? 'btn-primary' : 'bg-purple-600 hover:bg-purple-700'}`}>
                        Submit {type === 'late_entry' ? 'Late Entry' : 'Night Stay'} Request
                    </button>
                </form>
            </div>

            {/* History */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Application History</h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {history.map(item => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.type === 'late_entry' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {item.type.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400">{item.date}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-800">{item.reason}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-center text-gray-400 py-10">No history found.</p>}
                </div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview'); 
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);

    const handleLogout = async () => { await logOut(); navigate('/login'); };
    const TabButton = ({ id, label, icon }) => (
        <button onClick={() => setActiveTab(id)} className={`w-full flex items-center space-x-3 px-6 py-4 border-r-4 ${activeTab === id ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
            {icon} <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 z-20 flex flex-col min-h-screen">
                <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                    <span className="text-lg font-bold text-gray-800">Student Portal</span>
                </div>
                <nav className="mt-6 flex-1">
                    <TabButton id="overview" label="Overview" icon={<Icons.Home />} />
                    <TabButton id="gate_pass" label="Gate Pass" icon={<Icons.Gate />} /> {/* NEW TAB */}
                    <TabButton id="meals" label="Meal Manager" icon={<Icons.Food />} />
                    <TabButton id="notices" label="Notices" icon={<Icons.Bell />} />
                    <TabButton id="complaints" label="Complaints" icon={<Icons.Chat />} />
                </nav>
                <div className="p-6 border-t border-gray-100">
                    <button onClick={() => navigate('/studentProfile')} className="flex items-center space-x-3 text-gray-600 mb-4 hover:text-blue-600 w-full font-medium"><Icons.User /> <span>My Profile</span></button>
                    <button onClick={handleLogout} className="flex items-center space-x-3 text-red-500 hover:text-red-700 w-full font-medium"><Icons.Logout /> <span>Sign Out</span></button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div><h1 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h1><p className="text-gray-500 text-sm">Here's what's happening today.</p></div>
                    <div onClick={() => navigate('/studentProfile')} className="h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden cursor-pointer hover:scale-105 transition-transform"><img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} alt="User" /></div>
                </header>
                <div className="max-w-6xl">
                    {activeTab === 'overview' && <div className="grid md:grid-cols-2 gap-6"><SeatStatus /><Notices /></div>}
                    {activeTab === 'gate_pass' && <LeaveApplication />} {/* NEW VIEW */}
                    {activeTab === 'meals' && <MealManager />}
                    {activeTab === 'notices' && <Notices />}
                    {activeTab === 'complaints' && <Complaints />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;