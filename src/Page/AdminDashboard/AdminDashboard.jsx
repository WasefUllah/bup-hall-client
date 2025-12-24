import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.config";
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
} from "firebase/firestore";

// Component Imports
import StatCard from "./StatCard";
import ApplicationModal from "./ApplicationModal";
import ComplaintsList from "./ComplaintsList";
import AllocationsList from "./AllocationsList";
import MealOrders from "./MealOrders";
import SeatGrid from "./SeatGrid"; // Import SeatGrid for the map view

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("seats");
    const [requests, setRequests] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

    const [noticeTitle, setNoticeTitle] = useState("");
    const [noticeContent, setNoticeContent] = useState("");

    // TOTAL HALL CAPACITY (4 Floors x 10 Seats)
    const TOTAL_CAPACITY = 40; 
    const vacantSeats = TOTAL_CAPACITY - stats.approved;

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "applications"),
            (snapshot) => {
                const allDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setRequests(allDocs.filter((d) => d.status === "pending"));

                const currentAllocated = allDocs.filter(
                    (d) => d.status === "approved" && d.seatNumber
                );
                setAllocations(currentAllocated);
                setOccupiedSeats(currentAllocated.map((d) => d.seatNumber));

                setStats({
                    total: allDocs.length,
                    pending: allDocs.filter((d) => d.status === "pending").length,
                    approved: currentAllocated.length,
                });
            }
        );
        return () => unsubscribe();
    }, []);

    const handleApprove = async (id, seat) => {
        await updateDoc(doc(db, "applications", id), {
            status: "approved",
            seatNumber: seat,
        });
        setSelectedApp(null);
    };

    const handleReject = async (id) => {
        await updateDoc(doc(db, "applications", id), { status: "rejected" });
        setSelectedApp(null);
    };

    const handlePostNotice = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "notices"), {
            title: noticeTitle,
            content: noticeContent,
            date: new Date().toLocaleDateString(),
        });
        alert("Notice Posted!");
        setNoticeTitle("");
        setNoticeContent("");
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-black">
            <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold">
                        Admin
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Hall Management
                    </h1>
                </div>
                <button
                    onClick={() => navigate("/login")}
                    className="text-gray-500 hover:text-red-500 font-medium"
                >
                    Sign Out
                </button>
            </header>

            <main className="max-w-7xl mx-auto p-8">
                {/* STATS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Applicants"
                        value={stats.total}
                        color="bg-blue-50 text-blue-600"
                        icon="👥"
                    />
                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        color="bg-yellow-50 text-yellow-600"
                        icon="⏳"
                    />
                    <StatCard
                        title="Allocated"
                        value={stats.approved}
                        color="bg-green-50 text-green-600"
                        icon="✅"
                    />
                     {/* NEW VACANT SEATS CARD */}
                    <StatCard
                        title="Vacant Seats"
                        value={vacantSeats}
                        color="bg-purple-50 text-purple-600"
                        icon="🪑"
                    />
                </div>

                {/* TABS SECTION */}
                <div className="flex gap-6 mb-6 border-b border-gray-200 overflow-x-auto">
                    {["seats", "allocations", "seatMap", "notices", "complaints", "mealOrders"].map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 px-2 font-bold capitalize border-b-2 transition-all whitespace-nowrap ${
                                    activeTab === tab
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {tab === "seats" ? "New Requests" : tab === "seatMap" ? "Seat Map" : tab}
                            </button>
                        )
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                    
                    {/* 1. NEW REQUESTS TAB */}
                    {activeTab === "seats" && (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-bold text-gray-400 uppercase border-b">
                                    <th className="py-4">Candidate</th>
                                    <th>Dept</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((req) => (
                                    <tr key={req.id} className="border-b last:border-0">
                                        <td className="py-4 font-bold">{req.studentName}</td>
                                        <td>{req.department}</td>
                                        <td>
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs uppercase font-bold">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => setSelectedApp(req)}
                                                className="btn btn-sm btn-outline border-indigo-500 text-indigo-500"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr><td colSpan="4" className="py-8 text-center text-gray-400">No pending requests</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* 2. ALLOCATIONS LIST TAB */}
                    {activeTab === "allocations" && (
                        <AllocationsList allocations={allocations} />
                    )}

                    {/* 3. NEW SEAT MAP TAB */}
                    {activeTab === "seatMap" && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Live Seat Availability</h3>
                            <div className="max-w-3xl mx-auto">
                                <SeatGrid 
                                    occupiedSeats={occupiedSeats} 
                                    selectedSeat={null} 
                                    onSelect={() => {}} // Read-only: Do nothing on click
                                />
                                <div className="mt-6 flex justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                                        <span>Occupied</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. MEAL ORDERS TAB */}
                    {activeTab === "mealOrders" && <MealOrders />}

                    {/* 5. NOTICES TAB */}
                    {activeTab === "notices" && (
                        <form onSubmit={handlePostNotice} className="max-w-2xl mx-auto space-y-4">
                            <input
                                className="input input-bordered w-full bg-white text-black border-2 border-blue-100"
                                placeholder="Notice Title"
                                value={noticeTitle}
                                onChange={(e) => setNoticeTitle(e.target.value)}
                                required
                            />
                            <textarea
                                className="textarea textarea-bordered w-full h-32 bg-white text-black border-2 border-blue-100"
                                placeholder="Notice Content..."
                                value={noticeContent}
                                onChange={(e) => setNoticeContent(e.target.value)}
                                required
                            ></textarea>
                            <button className="btn btn-primary w-full">Post Notice</button>
                        </form>
                    )}

                    {/* 6. COMPLAINTS TAB */}
                    {activeTab === "complaints" && <ComplaintsList />}
                </div>
            </main>

            {/* MODAL FOR APPROVING REQUESTS */}
            {selectedApp && (
                <ApplicationModal
                    app={selectedApp}
                    occupiedSeats={occupiedSeats}
                    onClose={() => setSelectedApp(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default AdminDashboard;