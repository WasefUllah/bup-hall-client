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
    const [complaints, setComplaints] = useState([]); 
    const [selectedApp, setSelectedApp] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    // Notice Form State
    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");
    
    // Upload State
    const [selectedFile, setSelectedFile] = useState(null); // For Image
    const [pdfLink, setPdfLink] = useState(""); // For Drive/PDF Link
    const [uploading, setUploading] = useState(false);

    // --- PASTE YOUR IMGBB KEY HERE ---
    const IMGBB_API_KEY = "8da19b39cddb6533a5480c96521a12b2"; // Using the key you provided in the prompt

    const TOTAL_CAPACITY = 40; 
    const vacantSeats = TOTAL_CAPACITY - stats.approved;

    useEffect(() => {
        const unsubApp = onSnapshot(collection(db, "applications"), (snap) => {
            const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setRequests(all.filter(d => d.status === "pending"));
            setCancellations(all.filter(d => d.status === "cancellation_requested"));
            const approved = all.filter(d => d.status === "approved");
            setAllocations(approved);
            setOccupiedSeats(approved.map(d => d.seatNumber).filter(Boolean));
            setStats({ total: all.length, pending: all.filter(d => d.status === "pending").length, approved: approved.length });
        });
        
        // Safe fetch for other collections
        try {
            const unsubLeave = onSnapshot(query(collection(db, "leave_requests"), orderBy("timestamp", "desc")), (snap) => setLeaveRequests(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
            const unsubComplaints = onSnapshot(query(collection(db, "complaints"), orderBy("date", "desc")), (snap) => setComplaints(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
            return () => { unsubApp(); unsubLeave(); unsubComplaints(); };
        } catch(e) { return () => unsubApp(); }
    }, []);

    // Actions
    const handleApprove = async (id, seat) => { await updateDoc(doc(db, "applications", id), { status: "approved", seatNumber: seat }); setSelectedApp(null); };
    const handleReject = async (id) => { await updateDoc(doc(db, "applications", id), { status: "rejected" }); setSelectedApp(null); };
    const confirmCancellation = async (app) => { if(!confirm(`Cancel seat?`)) return; await updateDoc(doc(db, "applications", app.id), { status: "cancelled", seatNumber: null, cancelledAt: new Date().toISOString() }); };
    const rejectCancellation = async (id) => { await updateDoc(doc(db, "applications", id), { status: "approved" }); };
    const handleLeaveAction = async (id, status) => { await updateDoc(doc(db, "leave_requests", id), { status }); };

    // --- AUTOMATIC UPLOAD LOGIC ---
    const handlePostNotice = async (e) => { 
        e.preventDefault();
        setUploading(true);
        
        let finalAttachmentUrl = "";
        let finalType = "none";

        try {
            // Priority 1: Image Upload (ImgBB)
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
                const data = await response.json();
                
                if (data.success) {
                    finalAttachmentUrl = data.data.url;
                    finalType = 'image';
                } else {
                    alert("Image upload failed! Check API Key.");
                    setUploading(false);
                    return;
                }
            } 
            // Priority 2: PDF/Drive Link
            else if (pdfLink.trim()) {
                finalAttachmentUrl = pdfLink;
                finalType = 'pdf';
            }

            await addDoc(collection(db, "notices"), { 
                title: noticeTitle, 
                content: noticeContent, 
                attachmentUrl: finalAttachmentUrl, // Saved URL
                attachmentType: finalType,         // 'image', 'pdf', or 'none'
                date: new Date().toLocaleDateString(),
                timestamp: new Date()
            });
            
            alert("Notice Posted!"); 
            setNoticeTitle(""); setNoticeContent(""); setSelectedFile(null); setPdfLink("");
        } catch (err) {
            console.error(err);
            alert("Error posting notice.");
        } finally {
            setUploading(false);
        }
    };

    // Badges
    const pendingGate = leaveRequests.filter(r => r.status === 'pending').length;
    const openComplaints = complaints.filter(c => c.status === 'open').length;
    const pendingSeats = requests.length;
    const pendingCancel = cancellations.length;
    const renderBadge = (count) => count === 0 ? null : <span className="ml-2 bg-red-100 text-red-600 text-xs font-extrabold px-2 py-0.5 rounded-full">{count}</span>;

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-black">
            <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3"><div className="bg-indigo-600 text-white p-2 rounded-lg font-bold">Admin</div><h1 className="text-xl font-bold text-gray-800">Hall Management</h1></div>
                <button onClick={() => navigate("/login")} className="text-gray-500 hover:text-red-500 font-medium">Sign Out</button>
            </header>
            <main className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Applicants" value={stats.total} color="bg-blue-50 text-blue-600" icon="👥" />
                    <StatCard title="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-600" icon="⏳" />
                    <StatCard title="Allocated" value={stats.approved} color="bg-green-50 text-green-600" icon="✅" />
                    <StatCard title="Vacant Seats" value={vacantSeats} color="bg-purple-50 text-purple-600" icon="🪑" />
                </div>
                
                <div className="flex gap-6 mb-6 border-b border-gray-200 overflow-x-auto pb-2">
                    <button onClick={() => setActiveTab("seats")} className={`pb-3 px-2 font-bold capitalize border-b-2 whitespace-nowrap flex ${activeTab==="seats"?"border-indigo-600 text-indigo-600":"border-transparent text-gray-400 hover:text-gray-600"}`}>New Requests {renderBadge(pendingSeats)}</button>
                    <button onClick={() => setActiveTab("cancellations")} className={`pb-3 px-2 font-bold capitalize border-b-2 whitespace-nowrap flex ${activeTab==="cancellations"?"border-indigo-600 text-indigo-600":"border-transparent text-gray-400 hover:text-gray-600"}`}>Cancellations {renderBadge(pendingCancel)}</button>
                    <button onClick={() => setActiveTab("gate_approvals")} className={`pb-3 px-2 font-bold capitalize border-b-2 whitespace-nowrap flex ${activeTab==="gate_approvals"?"border-indigo-600 text-indigo-600":"border-transparent text-gray-400 hover:text-gray-600"}`}>Gate Pass {renderBadge(pendingGate)}</button>
                    <button onClick={() => setActiveTab("complaints")} className={`pb-3 px-2 font-bold capitalize border-b-2 whitespace-nowrap flex ${activeTab==="complaints"?"border-indigo-600 text-indigo-600":"border-transparent text-gray-400 hover:text-gray-600"}`}>Complaints {renderBadge(openComplaints)}</button>
                    {["allocations", "seatMap", "notices", "mealOrders"].map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-2 font-bold capitalize border-b-2 whitespace-nowrap ${activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>{tab === "seatMap" ? "Seat Map" : tab}</button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    {activeTab === "seats" && (
                        <table className="w-full text-left">
                            <thead><tr className="text-xs font-bold text-gray-400 uppercase border-b"><th className="py-4">Candidate</th><th>Dept</th><th>Status</th><th className="text-right">Action</th></tr></thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b last:border-0"><td className="py-4 font-bold">{req.studentName}</td><td>{req.department}</td><td><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs uppercase font-bold">Pending</span></td><td className="text-right"><button onClick={() => setSelectedApp(req)} className="btn btn-sm btn-outline border-indigo-500 text-indigo-500">Review</button></td></tr>
                                ))}
                                {requests.length === 0 && <tr><td colSpan="4" className="py-8 text-center text-gray-400">No pending requests</td></tr>}
                            </tbody>
                        </table>
                    )}
                    
                    {activeTab === "gate_approvals" && (
                        <div className="space-y-4">
                            {leaveRequests.map((req) => (
                                <div key={req.id} className="border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${req.type === 'late_entry' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>{req.type.replace('_', ' ')}</span><span className="font-bold text-gray-800">{req.studentEmail}</span></div>
                                        <p className="text-sm text-gray-600"><b>Date:</b> {req.date} {req.type==='night_stay' && `to ${req.returnDate}`}</p><p className="text-sm text-gray-600"><b>Reason:</b> "{req.reason}"</p>
                                    </div>
                                    <div className="flex items-center gap-2">{req.status === 'pending' ? (<><button onClick={() => handleLeaveAction(req.id, 'rejected')} className="btn btn-sm btn-ghost text-red-500">Reject</button><button onClick={() => handleLeaveAction(req.id, 'approved')} className="btn btn-sm btn-success text-white">Approve</button></>) : (<span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status==='approved'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{req.status}</span>)}</div>
                                </div>
                            ))}
                            {leaveRequests.length === 0 && <p className="text-center text-gray-400 py-10">No gate pass requests.</p>}
                        </div>
                    )}

                    {activeTab === "cancellations" && (
                        <div className="space-y-4">
                            {cancellations.map((app) => (
                                <div key={app.id} className="border border-red-100 bg-red-50 p-4 rounded-xl flex justify-between items-center">
                                    <div><h4 className="font-bold text-red-900">{app.studentName}</h4><p className="text-sm text-gray-700">Seat: <b>{app.seatNumber}</b></p><p className="text-xs text-gray-500">Reason: "{app.cancellationReason}"</p></div>
                                    <div className="flex gap-2"><button onClick={() => rejectCancellation(app.id)} className="btn btn-sm btn-ghost">Reject</button><button onClick={() => confirmCancellation(app)} className="btn btn-sm btn-error text-white">Approve & Vacate</button></div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {activeTab === "allocations" && <AllocationsList allocations={allocations} />}
                    {activeTab === "seatMap" && <div><h3 className="text-lg font-bold text-gray-800 mb-4">Live Seat Availability</h3><div className="max-w-3xl mx-auto"><SeatGrid occupiedSeats={occupiedSeats} selectedSeat={null} onSelect={() => {}} /></div></div>}
                    {activeTab === "mealOrders" && <MealOrders />}
                    
                    {/* SIMPLIFIED NOTICE UPLOAD (Auto-Detect) */}
                    {activeTab === "notices" && (
                        <form onSubmit={handlePostNotice} className="max-w-2xl mx-auto space-y-4">
                            <input className="input input-bordered w-full bg-white text-black border-2 border-blue-100" placeholder="Notice Title" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} required />
                            <textarea className="textarea textarea-bordered w-full h-32 bg-white text-black border-2 border-blue-100" placeholder="Notice Content..." value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)} required></textarea>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-gray-200 p-3 rounded-lg">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Option A: Upload Photo</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            setSelectedFile(e.target.files[0]);
                                            setPdfLink(""); // Clear the other option
                                        }} 
                                        className="file-input file-input-bordered file-input-sm w-full bg-white" 
                                        disabled={!!pdfLink}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Direct upload to ImgBB</p>
                                </div>

                                <div className="border border-gray-200 p-3 rounded-lg">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Option B: Paste Link</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://drive.google.com/..." 
                                        value={pdfLink} 
                                        onChange={(e) => {
                                            setPdfLink(e.target.value);
                                            setSelectedFile(null); // Clear the other option
                                        }} 
                                        className="input input-bordered input-sm w-full bg-white" 
                                        disabled={!!selectedFile}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">For PDFs or Google Drive</p>
                                </div>
                            </div>

                            <button disabled={uploading} className="btn btn-primary w-full">
                                {uploading ? "Uploading..." : "Post Notice"}
                            </button>
                        </form>
                    )}

                    {activeTab === "complaints" && <ComplaintsList />}
                </div>
            </main>
            {selectedApp && <ApplicationModal app={selectedApp} occupiedSeats={occupiedSeats} onClose={() => setSelectedApp(null)} onApprove={handleApprove} onReject={handleReject} />}
        </div>
    );
};

export default AdminDashboard;