import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase.config';
import { collection, query, onSnapshot, doc, updateDoc, orderBy, addDoc, deleteField } from 'firebase/firestore';

// --- COMPONENT 1: STAT CARD ---
const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>{icon}</div>
        <div>
            <p className="text-gray-500 text-xs uppercase font-bold">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

// --- COMPONENT 2: SEAT GRID ---
const SeatGrid = ({ occupiedSeats, selectedSeat, onSelect }) => {
    const floors = [1, 2, 3, 4];
    return (
        <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-4 text-sm uppercase">Select Room</h4>
            <div className="space-y-4">
                {floors.map(floor => (
                    <div key={floor} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-400 w-12">Floor {floor}</span>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 10 }, (_, i) => {
                                const seatNum = `${floor}${i + 1 < 10 ? '0' + (i + 1) : i + 1}`;
                                const isOccupied = occupiedSeats.includes(seatNum);
                                return (
                                    <button 
                                        key={seatNum} 
                                        type="button"
                                        onClick={() => onSelect(seatNum)} 
                                        disabled={isOccupied} 
                                        className={`w-10 h-10 rounded-lg text-xs font-bold transition-all ${isOccupied ? 'bg-red-100 text-red-400 cursor-not-allowed' : selectedSeat === seatNum ? 'bg-blue-600 text-white' : 'bg-white border hover:border-blue-500'}`}
                                    >
                                        {seatNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENT 3: APPLICATION MODAL ---
const ApplicationModal = ({ app, onClose, occupiedSeats, onApprove, onReject }) => {
    const [seat, setSeat] = useState(null);
    const [mode, setMode] = useState('view');
    if (!app) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="bg-blue-900 p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold">{app.studentName}</h2>
                    <button onClick={onClose} className="text-white font-bold text-xl">✕</button>
                </div>
                <div className="p-8 space-y-8 flex-1">
                    {mode === 'view' ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Academic Details</h4>
                                <p className="font-medium">Roll: {app.rollNo}</p>
                                <p className="font-medium">Dept: {app.department}</p>
                                <p className="font-medium text-blue-600">Mobile: {app.mobile}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Address</h4>
                                <p className="text-sm text-gray-700">{app.permanentAddress}</p>
                            </div>
                        </div>
                    ) : (
                        <SeatGrid occupiedSeats={occupiedSeats} selectedSeat={seat} onSelect={setSeat} />
                    )}
                </div>
                <div className="p-6 border-t flex justify-end gap-3">
                    {mode === 'view' ? (
                        <>
                            <button onClick={() => onReject(app.id)} className="btn btn-error btn-outline">Reject</button>
                            <button onClick={() => setMode('assign')} className="btn btn-primary">Approve & Assign Room</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setMode('view')} className="btn btn-ghost">Back</button>
                            <button onClick={() => onApprove(app.id, seat)} disabled={!seat} className="btn btn-success text-white">Confirm Allocation</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT 4: COMPLAINTS LIST (Your Original Version) ---
const ComplaintsList = () => {
    const [complaints, setComplaints] = useState([]);
    useEffect(() => {
        const q = query(collection(db, "complaints"), orderBy("date", "desc"));
        const unsub = onSnapshot(q, snap => setComplaints(snap.docs.map(d => ({id:d.id, ...d.data()}))));
        return () => unsub();
    }, []);

    const handleResolve = async (id) => {
        await updateDoc(doc(db, "complaints", id), { status: "resolved" });
    };

    return (
        <div className="space-y-4">
            {complaints.map(c => (
                <div key={c.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
                    {c.image && (
                        <div className="w-full md:w-48 h-32 flex-shrink-0">
                            <a href={c.image} target="_blank" rel="noreferrer">
                                <img src={c.image} alt="Evidence" className="w-full h-full object-cover rounded-lg border hover:opacity-90 cursor-zoom-in" />
                            </a>
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-800">{c.studentEmail}</h4>
                                <span className="text-xs text-gray-500">{c.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status==='open'?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}`}>
                                {c.status}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm">{c.text}</p>
                        {c.status === 'open' && (
                            <button onClick={() => handleResolve(c.id)} className="mt-3 btn btn-xs btn-outline btn-success">
                                Mark as Resolved
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {complaints.length === 0 && <p className="text-center text-gray-400 py-10">No complaints found.</p>}
        </div>
    );
};

// --- NEW COMPONENT: ALLOCATIONS LIST ---
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

// --- MAIN ADMIN DASHBOARD ---
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('seats');
    const [requests, setRequests] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "applications"), (snapshot) => {
            const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            setRequests(allDocs.filter(d => d.status === 'pending'));
            
            const currentAllocated = allDocs.filter(d => d.status === 'approved' && d.seatNumber);
            setAllocations(currentAllocated);
            setOccupiedSeats(currentAllocated.map(d => d.seatNumber));
            
            setStats({
                total: allDocs.length,
                pending: allDocs.filter(d => d.status === 'pending').length,
                approved: currentAllocated.length
            });
        });
        return () => unsubscribe();
    }, []);

    const handleApprove = async (id, seat) => { await updateDoc(doc(db, "applications", id), { status: "approved", seatNumber: seat }); setSelectedApp(null); };
    const handleReject = async (id) => { await updateDoc(doc(db, "applications", id), { status: "rejected" }); setSelectedApp(null); };
    const handlePostNotice = async (e) => { e.preventDefault(); await addDoc(collection(db, "notices"), { title: noticeTitle, content: noticeContent, date: new Date().toLocaleDateString() }); alert("Notice Posted!"); setNoticeTitle(""); setNoticeContent(""); };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-black">
            <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3"><div className="bg-indigo-600 text-white p-2 rounded-lg font-bold">Admin</div><h1 className="text-xl font-bold text-gray-800">Hall Management</h1></div>
                <button onClick={() => navigate('/login')} className="text-gray-500 hover:text-red-500 font-medium">Sign Out</button>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Applicants" value={stats.total} color="bg-blue-50 text-blue-600" icon="👥" />
                    <StatCard title="Pending" value={stats.pending} color="bg-yellow-50 text-yellow-600" icon="⏳" />
                    <StatCard title="Allocated" value={stats.approved} color="bg-green-50 text-green-600" icon="✅" />
                </div>

                {/* Tabs including 'allocations' */}
                <div className="flex gap-6 mb-6 border-b border-gray-200">
                    {['seats', 'allocations', 'notices', 'complaints'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}>
                            {tab === 'seats' ? 'New Requests' : tab}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    {activeTab === 'seats' && (
                        <table className="w-full text-left">
                            <thead><tr className="text-xs font-bold text-gray-400 uppercase border-b"><th className="py-4">Candidate</th><th>Dept</th><th>Status</th><th className="text-right">Action</th></tr></thead>
                            <tbody>{requests.map(req => (<tr key={req.id} className="border-b last:border-0"><td className="py-4 font-bold">{req.studentName}</td><td>{req.department}</td><td><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs uppercase font-bold">Pending</span></td><td className="text-right"><button onClick={() => setSelectedApp(req)} className="btn btn-sm btn-outline border-indigo-500 text-indigo-500">Review</button></td></tr>))}</tbody>
                        </table>
                    )}
                    
                    {activeTab === 'allocations' && <AllocationsList allocations={allocations} />}
                    
                    {activeTab === 'notices' && (
                        <form onSubmit={handlePostNotice} className="max-w-2xl mx-auto space-y-4">
                            <input className="input input-bordered w-full bg-white text-black border-2 border-blue-100" placeholder="Notice Title" value={noticeTitle} onChange={e=>setNoticeTitle(e.target.value)} required />
                            <textarea className="textarea textarea-bordered w-full h-32 bg-white text-black border-2 border-blue-100" placeholder="Notice Content..." value={noticeContent} onChange={e=>setNoticeContent(e.target.value)} required></textarea>
                            <button className="btn btn-primary w-full">Post Notice</button>
                        </form>
                    )}
                    
                    {activeTab === 'complaints' && <ComplaintsList />}
                </div>
            </main>

            {selectedApp && <ApplicationModal app={selectedApp} occupiedSeats={occupiedSeats} onClose={() => setSelectedApp(null)} onApprove={handleApprove} onReject={handleReject} />}
        </div>
    );
};

export default AdminDashboard;