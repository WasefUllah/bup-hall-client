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
    User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

// --- SUB-COMPONENT: SEAT STATUS ---
const SeatStatus = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState({ state: 'loading', seatNumber: null }); 

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "applications"), where("studentEmail", "==", user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setStatus({ state: data.status, seatNumber: data.seatNumber || null });
            } else {
                setStatus({ state: 'none', seatNumber: null });
            }
        });
        return () => unsubscribe();
    }, [user]);

    if (status.state === 'loading') return <div className="animate-pulse h-40 bg-gray-200 rounded-xl"></div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
            {status.state === 'none' && (
                <>
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">🪑</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Seat Assigned</h3>
                    <button onClick={() => navigate('/hallSeatApplication')} className="btn btn-primary px-8 rounded-full shadow-lg">Apply Now</button>
                </>
            )}
            {status.state === 'pending' && (
                <>
                    <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-4 text-2xl">⏳</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pending Review</h3>
                    <p className="text-gray-500 text-sm">Admin is reviewing your application.</p>
                </>
            )}
            {status.state === 'approved' && (
                <>
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 text-3xl">✅</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Room {status.seatNumber}</h3>
                    <p className="text-green-600 font-bold">Allocated</p>
                </>
            )}
        </div>
    );
};

// --- SUB-COMPONENT: MEAL MANAGER ---
const MealManager = () => {
    const [days, setDays] = useState([]);
    useEffect(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const next7Days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today); date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            const savedMeals = JSON.parse(localStorage.getItem(dateString)) || { breakfast: false, lunch: false, dinner: false, done: false };
            next7Days.push({ dateObject: date, dateString: dateString, ...savedMeals });
        }
        setDays(next7Days);
    }, []);
    const handleCheck = (index, meal) => { const newDays = [...days]; newDays[index][meal] = !newDays[index][meal]; setDays(newDays); };
    const handleSave = (index) => { const day = days[index]; localStorage.setItem(day.dateString, JSON.stringify(day)); const newDays = [...days]; newDays[index].done = true; setDays(newDays); };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Meal Plan</h2>
            <div className="space-y-3">
                {days.map((day, index) => (
                    <div key={day.dateString} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-bold text-gray-500 w-12">{day.dateObject.toLocaleDateString(undefined, {weekday:'short'})}</span>
                        <div className="flex space-x-2">
                            {['breakfast', 'lunch', 'dinner'].map(m => (
                                <input key={m} type="checkbox" className="checkbox checkbox-xs checkbox-primary" checked={day[m]} onChange={()=>handleCheck(index, m)} disabled={day.done} />
                            ))}
                        </div>
                        <button onClick={()=>handleSave(index)} disabled={day.done} className="btn btn-xs btn-outline">Save</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: NOTICES ---
const Notices = () => {
    const [notices, setNotices] = useState([]);
    useEffect(() => {
        const q = query(collection(db, "notices"), orderBy("date", "desc"));
        const unsub = onSnapshot(q, snap => setNotices(snap.docs.map(d => ({id:d.id, ...d.data()}))));
        return () => unsub();
    }, []);
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notices</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {notices.map(n => (
                    <div key={n.id} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-xs text-gray-400">{n.date}</p>
                        <h4 className="font-bold">{n.title}</h4>
                        <p className="text-sm text-gray-600">{n.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: COMPLAINTS ---
const Complaints = () => {
    const { user } = useContext(AuthContext);
    const [complaintText, setComplaintText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [myComplaints, setMyComplaints] = useState([]);

    // --- PASTE YOUR IMGBB API KEY HERE ---
    const IMGBB_API_KEY = "8da19b39cddb6533a5480c96521a12b2"; // <--- REMEMBER TO PASTE KEY HERE

    useEffect(() => {
        if(!user) return;
        const q = query(collection(db, "complaints"), where("studentEmail", "==", user.email));
        const unsub = onSnapshot(q, snap => setMyComplaints(snap.docs.map(d => ({id:d.id, ...d.data()}))));
        return () => unsub();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!complaintText.trim()) return;
        setUploading(true);
        let imageUrl = "";

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
                const data = await response.json();
                if (data.success) imageUrl = data.data.url;
            } catch (err) { alert("Image upload failed"); }
        }

        try {
            await addDoc(collection(db, "complaints"), {
                text: complaintText, image: imageUrl, studentEmail: user.email,
                date: new Date().toLocaleDateString(), status: 'open', timestamp: new Date()
            });
            setComplaintText(""); setSelectedFile(null); alert("Submitted!");
        } catch (error) { console.error(error); } finally { setUploading(false); }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">File a Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea className="textarea textarea-bordered w-full h-32 bg-gray-50 focus:bg-white" placeholder="Describe issue..." value={complaintText} onChange={(e) => setComplaintText(e.target.value)} required></textarea>
                    <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="file-input file-input-bordered file-input-sm w-full" />
                    <button disabled={uploading} className="btn btn-error w-full text-white">{uploading ? "Uploading..." : "Submit"}</button>
                </form>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">History</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {myComplaints.map(item => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">{item.date}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.status==='open'?'text-red-600 bg-red-100':'text-green-600 bg-green-100'}`}>{item.status}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{item.text}</p>
                            {item.image && <img src={item.image} alt="Proof" className="w-full h-32 object-cover rounded-lg border" />}
                        </div>
                    ))}
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
            
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 z-20 flex flex-col min-h-screen">
                <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                    <span className="text-lg font-bold text-gray-800">Student Portal</span>
                </div>
                <nav className="mt-6 flex-1">
                    <TabButton id="overview" label="Overview" icon={<Icons.Home />} />
                    <TabButton id="meals" label="Meal Manager" icon={<Icons.Food />} />
                    <TabButton id="notices" label="Notices" icon={<Icons.Bell />} />
                    <TabButton id="complaints" label="Complaints" icon={<Icons.Chat />} />
                </nav>
                <div className="p-6 border-t border-gray-100">
                    {/* SIDEBAR PROFILE BUTTON */}
                    <button onClick={() => navigate('/studentProfile')} className="flex items-center space-x-3 text-gray-600 mb-4 hover:text-blue-600 w-full font-medium">
                        <Icons.User /> <span>My Profile</span>
                    </button>
                    <button onClick={handleLogout} className="flex items-center space-x-3 text-red-500 hover:text-red-700 w-full font-medium">
                        <Icons.Logout /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h1>
                        <p className="text-gray-500 text-sm">Here's what's happening today.</p>
                    </div>
                    {/* TOP RIGHT PROFILE LINK */}
                    <div 
                        onClick={() => navigate('/studentProfile')} 
                        className="h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-sm"
                        title="Go to Profile"
                    >
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} alt="User" />
                    </div>
                </header>

                <div className="max-w-6xl">
                    {activeTab === 'overview' && <div className="grid md:grid-cols-2 gap-6"><SeatStatus /><Notices /></div>}
                    {activeTab === 'meals' && <MealManager />}
                    {activeTab === 'notices' && <Notices />}
                    {activeTab === 'complaints' && <Complaints />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;