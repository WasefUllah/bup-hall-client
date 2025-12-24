import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { db } from "../../firebase/firebase.config";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // State to hold combined profile data
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;

            try {
                // 1. Fetch Personal Identity (from 'users' collection)
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);
                const userData = userSnapshot.exists() ? userSnapshot.data() : {};

                // 2. Fetch Accommodation & Guardian Info (from 'applications' collection)
                // We look for the most recent application
                const q = query(collection(db, "applications"), where("studentEmail", "==", user.email));
                const appSnapshot = await getDocs(q);
                
                let appData = {};
                let seatStatus = "Not Applied";
                
                if (!appSnapshot.empty) {
                    // Get the latest application
                    const docData = appSnapshot.docs[0].data();
                    appData = docData;
                    seatStatus = docData.status;
                }

                // 3. Combine Data
                setProfile({
                    ...userData,       // Name, ID, Dept, Batch...
                    ...appData,        // Guardian, Address, Approved Seat...
                    seatStatus         // pending, approved, or none
                });

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [user]);

    if (loading) return <div className="text-center mt-20 text-blue-600 font-bold">Loading Profile...</div>;
    if (!profile) return <div className="text-center mt-20 text-black">No profile found.</div>;

    // Helper to handle missing data gracefully
    const getVal = (val) => val || "N/A";

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex justify-center items-start text-black">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                
                {/* 1. Header Section */}
                <div className="h-40 bg-gradient-to-r from-blue-800 to-indigo-900 w-full relative">
                    <button onClick={() => navigate('/dashboard')} className="absolute top-4 left-4 text-white bg-black/30 px-4 py-2 rounded hover:bg-black/50">
                        ← Back to Dashboard
                    </button>
                </div>
                
                <div className="px-8 pb-10">
                    <div className="relative -mt-16 flex flex-col md:flex-row md:items-end gap-6 border-b border-gray-100 pb-8">
                        {/* Avatar */}
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || "User"}`} alt="Avatar" />
                            </div>
                        </div>
                        {/* Name & Badge */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{getVal(profile.name)}</h1>
                            <p className="text-blue-600 font-semibold text-lg">{getVal(profile.department)} ({getVal(profile.program)})</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="badge badge-lg bg-blue-100 text-blue-800 border-none font-medium">ID: {getVal(profile.studentId)}</span>
                                <span className="badge badge-lg bg-gray-100 text-gray-800 border-none font-medium">{getVal(profile.batch)}</span>
                                <span className="badge badge-lg bg-red-50 text-red-600 border-red-100 font-medium">🩸 {getVal(profile.bloodGroup)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Grid Layout for Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        
                        {/* LEFT: Personal & Guardian Info */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Personal Details */}
                            <section>
                                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-4 border-b pb-2">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                    <div><span className="block text-xs text-gray-500">Email</span><span className="font-medium">{getVal(profile.email)}</span></div>
                                    <div><span className="block text-xs text-gray-500">Religion</span><span className="font-medium">{getVal(profile.religion)}</span></div>
                                    <div className="md:col-span-2"><span className="block text-xs text-gray-500">Permanent Address</span><span className="font-medium">{getVal(profile.permanentAddress)}</span></div>
                                </div>
                            </section>

                            {/* Guardian Info */}
                            <section>
                                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-4 border-b pb-2">Emergency & Guardian</h3>
                                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div><span className="block text-xs text-red-500 font-bold">Local Guardian Name</span><span className="font-medium text-gray-800">{getVal(profile.fatherName)}</span></div>
                                        <div><span className="block text-xs text-red-500 font-bold">Contact Number</span><span className="font-medium text-gray-800">{getVal(profile.fatherMobile)}</span></div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT: Accommodation & Finance (Cards) */}
                        <div className="space-y-6">
                            
                            {/* Accommodation Card */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                                <h2 className="text-sm uppercase tracking-wider font-bold text-blue-600 mb-4 flex items-center gap-2">
                                    🏢 Accommodation
                                </h2>
                                
                                {profile.status === 'approved' ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                                            <span className="text-sm text-gray-600">Hall Name</span>
                                            <span className="font-bold text-gray-900">Miran Hall</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                                            <span className="text-sm text-gray-600">Seat Number</span>
                                            <span className="text-xl font-bold text-green-600">{profile.seatNumber}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm text-gray-600">Status</span>
                                            <span className="badge badge-success text-white">Resident</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500 mb-3">No active seat allocation.</p>
                                        <button onClick={() => navigate('/hallSeatApplication')} className="btn btn-sm btn-outline btn-primary">Apply Now</button>
                                    </div>
                                )}
                            </div>

                            {/* Financial Status Card */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h2 className="text-sm uppercase tracking-wider font-bold text-gray-600 mb-4">
                                    💳 Financial Status
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Seat Rent</span>
                                        <span className="badge badge-warning text-xs">Due</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Dining Bill</span>
                                        <span className="badge badge-success text-white text-xs">Paid</span>
                                    </div>
                                    <div className="mt-4 pt-3 border-t">
                                        <button className="btn btn-block btn-primary btn-sm">Pay Dues</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}