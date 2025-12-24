import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.config";
import { collection, onSnapshot, doc, updateDoc, addDoc, query, orderBy } from "firebase/firestore";

import StatCard from "./StatCard";
import ApplicationModal from "./ApplicationModal";
import ComplaintsList from "./ComplaintsList";
import AllocationsList from "./AllocationsList";
import MealOrders from "./MealOrders";
import SeatGrid from "./SeatGrid";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("seats");
    
    // Data States
    const [requests, setRequests] = useState([]);
    const [cancellations, setCancellations] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [complaints, setComplaints] = useState([]); // NEW: To track complaint counts
    
    const [selectedApp, setSelectedApp] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");

    const TOTAL_CAPACITY = 40; 
    const vacantSeats = TOTAL_CAPACITY - stats.approved;

    // --- FETCH DATA ---
    useEffect(() => {
        // 1. Fetch Applications (Seats & Cancellations)
        const unsubApp = onSnapshot(collection(db, "applications"), (snapshot) => {
            const allDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setRequests(allDocs.filter((d) => d.status === "pending"));
            setCancellations(allDocs.filter((d) => d.status === "cancellation_requested"));
            
            const currentAllocated = allDocs.filter((d) => d.status === "approved");
            setAllocations(currentAllocated);
            setOccupiedSeats(currentAllocated.map((d) => d.seatNumber).filter(Boolean));
            
            setStats({ 
                total: allDocs.length, 
                pending: allDocs.filter((d) => d.status === "pending").length, 
                approved: currentAllocated.length 
            });
        });

        // 2. Fetch Leave Requests (Gate Pass)
        const leaveQ = query(collection(db, "leave_requests"), orderBy("timestamp", "desc"));
        const unsubLeave = onSnapshot(leaveQ, (snapshot) => {
            setLeaveRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        // 3. Fetch Complaints (NEW: For Counters)
        const complaintQ = query(collection(db, "complaints"), orderBy("date", "desc"));
        const unsubComplaints = onSnapshot(complaintQ, (snapshot) => {
            setComplaints(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => { unsubApp(); unsubLeave(); unsubComplaints(); };
    }, []);

    // --- ACTIONS ---
    const handleApprove = async (id, seat) => { await updateDoc(doc(db, "applications", id), { status: "approved", seatNumber: seat }); setSelectedApp(null); };
    const handleReject = async (id) => { await updateDoc(doc(db, "applications", id), { status: "rejected" }); setSelectedApp(null); };
    
    const confirmCancellation = async (app) => {
        if(!confirm(`Cancel seat for ${app.studentName}?`)) return;
        await updateDoc(doc(db, "applications", app.id), { status: "cancelled", seatNumber: null, previousSeat: app.seatNumber, cancelledAt: new Date().toISOString() });
    };
    const rejectCancellation = async (id) => { await updateDoc(doc(db, "applications", id), { status: "approved" }); };
    
    const handleLeaveAction = async (id, status) => { await updateDoc(doc(db, "leave_requests", id), { status }); };

    const handlePostNotice = async (e) => { e.preventDefault(); await addDoc(collection(db, "notices"), { title: noticeTitle, content: noticeContent, date: new Date().toLocaleDateString() }); alert("Notice Posted!"); setNoticeTitle(""); setNoticeContent(""); };

    // --- CALCULATE COUNTS ---
    const pendingGate = leaveRequests.filter(r => r.status === 'pending').length;
    const openComplaints = complaints.filter(c => c.status === 'open').length;
    const pendingSeats = requests.length;
    const pendingCancel = cancellations.length;

    // Helper to render badge
    const renderBadge = (count) => {
        if (count === 0) return null;
        return <span className="ml-2 bg-red-100 text-red-600 text-xs font-extrabold px-2 py-0.5 rounded-full">{count}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-black">
            <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3"><div className="bg-indigo-600 text-white p-2 rounded-lg font-bold">Admin</div><h1 className="text-xl font-bold text-gray-800">Hall Management</h1></div>
                <button onClick={() => navigate("/login")} className="text-gray-500 hover:text-red-500 font-medium">Sign Out</button>
            </header>
            <main className="max-w-7xl mx-auto p-8">
                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Applicants" value={stats.total} color="bg-blue-50 text-blue-600" icon="👥" />
                    <StatCard title="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-600" icon="⏳" />
                    <StatCard title="Allocated" value={stats.approved} color="bg-green-50 text-green-600" icon="✅" />
                    <StatCard title="Vacant Seats" value={vacantSeats} color="bg-purple-50 text-purple-600" icon="🪑" />
                </div>
                
                {/* TABS WITH BADGES */}
                <div className="flex gap-6 mb-6 border-b border-gray-200 overflow-x-auto pb-2">
                    <button onClick={() => setActiveTab("seats")} className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all whitespace-nowrap flex items-center ${activeTab === "seats" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                        New Requests {renderBadge(pendingSeats)}
                    </button>
                    
                    <button onClick={() => setActiveTab("cancellations")} className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all whitespace-nowrap flex items-center ${activeTab === "cancellations" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                        Cancellations {renderBadge(pendingCancel)}
                    </button>

                    <button onClick={() => setActiveTab("gate_approvals")} className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all whitespace-nowrap flex items-center ${activeTab === "gate_approvals" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                        Gate Pass {renderBadge(pendingGate)}
                    </button>

                    <button onClick={() => setActiveTab("complaints")} className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all whitespace-nowrap flex items-center ${activeTab === "complaints" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                        Complaints {renderBadge(openComplaints)}
                    </button>

                    {/* Other Tabs (No badges needed) */}
                    {["allocations", "seatMap", "notices", "mealOrders"].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                            {tab === "seatMap" ? "Seat Map" : tab.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    {activeTab === "seats" && (
                        <table className="w-full text-left">
                            <thead><tr className="text-xs font-bold text-gray-400 uppercase border-b"><th className="py-4">Candidate</th><th>Dept</th><th>Status</th><th className="text-right">Action</th></tr></thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b last:border-0">
                                        <td className="py-4 font-bold">{req.studentName}</td><td>{req.department}</td>
                                        <td><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs uppercase font-bold">Pending</span></td>
                                        <td className="text-right"><button onClick={() => setSelectedApp(req)} className="btn btn-sm btn-outline border-indigo-500 text-indigo-500">Review</button></td>
                                    </tr>
                                ))}
                                {requests.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-gray-400">No pending requests</td></tr>}
                            </tbody>
                        </table>
                    )}
                    
                    {/* GATE PASS APPROVALS */}
                    {activeTab === "gate_approvals" && (
                        <div className="space-y-4">
                            {leaveRequests.map((req) => (
                                <div key={req.id} className="border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${req.type === 'late_entry' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{req.type.replace('_', ' ')}</span>
                                            <span className="font-bold text-gray-800">{req.studentEmail}</span>
                                        </div>
                                        <p className="text-sm text-gray-600"><b>Date:</b> {req.date} {req.type==='night_stay' && `to ${req.returnDate}`}</p>
                                        <p className="text-sm text-gray-600"><b>Reason:</b> "{req.reason}"</p>
                                        {req.guardianPhone && <p className="text-sm text-purple-600"><b>Guardian:</b> {req.guardianPhone}</p>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {req.status === 'pending' ? (
                                            <>
                                                <button onClick={() => handleLeaveAction(req.id, 'rejected')} className="btn btn-sm btn-ghost text-red-500">Reject</button>
                                                <button onClick={() => handleLeaveAction(req.id, 'approved')} className="btn btn-sm btn-success text-white">Approve</button>
                                            </>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status==='approved'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{req.status}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {leaveRequests.length === 0 && <p className="text-center text-gray-400 py-10">No gate pass requests.</p>}
                        </div>
                    )}

                    {activeTab === "cancellations" && (
                        <div className="space-y-4">
                            {cancellations.map((app) => (
                                <div key={app.id} className="border border-red-100 bg-red-50 p-4 rounded-xl flex justify-between items-center">
                                    <div><h4 className="font-bold text-red-900">{app.studentName}</h4><p className="text-sm text-gray-700">Wants to leave Seat: <b>{app.seatNumber}</b></p><p className="text-xs text-gray-500">Reason: "{app.cancellationReason}"</p></div>
                                    <div className="flex gap-2"><button onClick={() => rejectCancellation(app.id)} className="btn btn-sm btn-ghost">Reject</button><button onClick={() => confirmCancellation(app)} className="btn btn-sm btn-error text-white">Approve & Vacate</button></div>
                                </div>
                            ))}
                            {cancellations.length === 0 && <p className="text-center text-gray-400 py-10">No cancellation requests.</p>}
                        </div>
                    )}
                    
                    {activeTab === "allocations" && <AllocationsList allocations={allocations} />}
                    {activeTab === "seatMap" && <div><h3 className="text-lg font-bold text-gray-800 mb-4">Live Seat Availability</h3><div className="max-w-3xl mx-auto"><SeatGrid occupiedSeats={occupiedSeats} selectedSeat={null} onSelect={() => {}} /></div></div>}
                    {activeTab === "mealOrders" && <MealOrders />}
                    {activeTab === "notices" && <form onSubmit={handlePostNotice} className="max-w-2xl mx-auto space-y-4"><input className="input input-bordered w-full bg-white text-black border-2 border-blue-100" placeholder="Notice Title" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} required /><textarea className="textarea textarea-bordered w-full h-32 bg-white text-black border-2 border-blue-100" placeholder="Notice Content..." value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} required></textarea><button className="btn btn-primary w-full">Post Notice</button></form>}
                    {activeTab === "complaints" && <ComplaintsList />}
                </div>
            </main>
            {selectedApp && <ApplicationModal app={selectedApp} occupiedSeats={occupiedSeats} onClose={() => setSelectedApp(null)} onApprove={handleApprove} onReject={handleReject} />}
        </div>
    );
};

export default AdminDashboard;