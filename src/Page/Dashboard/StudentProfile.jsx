import React from "react";

export default function StudentProfile() {
    // Mock data based on the requirements
    const studentData = {
        name: "Tanvir Ahmed",
        rollNo: "202414055",
        department: "Information & Communication Technology",
        year: "2nd Year, 1st Semester",
        gender: "Male",
        mobile: "017XX-XXXXXX",
        email: "tanvir.ict@bup.edu.bd",
        hallName: "Miran Hall",
        roomNo: "402-B",
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanvir", // Placeholder avatar
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Top Header/Cover Area */}
                <div className="h-32 bg-blue-700 w-full"></div>

                <div className="px-8 pb-10">
                    <div className="relative -mt-16 flex flex-col md:flex-row md:items-end gap-6 border-b border-gray-100 pb-8">
                        {/* Profile Picture */}
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md bg-white">
                                <img
                                    src={studentData.profilePic}
                                    alt="Student Profile"
                                />
                            </div>
                        </div>

                        {/* Basic Info Header */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {studentData.name}
                            </h1>
                            <p className="text-blue-600 font-semibold text-lg">
                                {studentData.department}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="badge badge-outline border-gray-400 font-medium px-3 py-3">
                                    Roll: {studentData.rollNo}
                                </span>
                                <span className="badge badge-outline border-gray-400 font-medium px-3 py-3">
                                    {studentData.year}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50 px-6">
                                Show Bill
                            </button>
                            <button className="btn btn-primary text-white shadow-lg px-6">
                                Pay Bill
                            </button>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        {/* LEFT COLUMN: Academic & Contact */}
                        <div className="space-y-6">
                            <h2 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-4">
                                Academic & Contact
                            </h2>

                            <div className="flex flex-col gap-1 border-l-4 border-blue-500 pl-4">
                                <span className="text-xs text-gray-500 font-bold">
                                    Email Address
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {studentData.email}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 border-l-4 border-blue-500 pl-4">
                                <span className="text-xs text-gray-500 font-bold">
                                    Mobile
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {studentData.mobile}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1 border-l-4 border-blue-500 pl-4">
                                <span className="text-xs text-gray-500 font-bold">
                                    Gender
                                </span>
                                <span className="text-gray-900 font-medium">
                                    {studentData.gender}
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Hall Allocation */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                            <h2 className="text-sm uppercase tracking-wider font-bold text-blue-400 mb-4">
                                Hall Allocation Details
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-blue-600 font-bold">
                                            Allocated Hall
                                        </span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {studentData.hallName}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-blue-100">
                                        🏢
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-blue-600 font-bold">
                                            Room Number
                                        </span>
                                        <span className="text-xl font-bold text-gray-900">
                                            {studentData.roomNo}
                                        </span>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-blue-100">
                                        🔑
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-blue-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Current Status:
                                        </span>
                                        <span className="text-green-600 font-bold italic">
                                            Active Resident
                                        </span>
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
