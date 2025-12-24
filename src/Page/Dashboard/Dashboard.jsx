import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

// Component Imports (Assuming these are in the same folder)
import SeatStatus from "./SeatStatus";
import MealManager from "./MealManager";
import Notices from "./Notices";
import Complaints from "./Complaints";

// --- 1. ICONS (Defined outside to prevent re-creation) ---
const Icons = {
    Home: () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        </svg>
    ),
    Food: () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
        </svg>
    ),
    Bell: () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
        </svg>
    ),
    Chat: () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
        </svg>
    ),
    User: () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
        </svg>
    ),
    Logout: () => (
        <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
        </svg>
    ),
};

// --- 2. TAB BUTTON (Defined outside to prevent render errors) ---
const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-6 py-4 border-r-4 transition-all duration-200 ${
            activeTab === id
                ? "bg-blue-50 border-blue-600 text-blue-700"
                : "border-transparent text-gray-500 hover:bg-gray-50"
        }`}
    >
        {icon} <span className="font-medium">{label}</span>
    </button>
);

// --- 3. MAIN DASHBOARD ---
const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const navigate = useNavigate();
    const { user, logOut } = useContext(AuthContext);

    const handleLogout = async () => {
        await logOut();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 z-20 flex flex-col min-h-screen">
                <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        B
                    </div>
                    <span className="text-lg font-bold text-gray-800">
                        Student Portal
                    </span>
                </div>

                <nav className="mt-6 flex-1">
                    <TabButton
                        id="overview"
                        label="Overview"
                        icon={<Icons.Home />}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <TabButton
                        id="meals"
                        label="Meal Manager"
                        icon={<Icons.Food />}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <TabButton
                        id="notices"
                        label="Notices"
                        icon={<Icons.Bell />}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    <TabButton
                        id="complaints"
                        label="Complaints"
                        icon={<Icons.Chat />}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => navigate("/studentProfile")}
                        className="flex items-center space-x-3 text-gray-600 mb-4 hover:text-blue-600 w-full font-medium"
                    >
                        <Icons.User /> <span>My Profile</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-500 hover:text-red-700 w-full font-medium"
                    >
                        <Icons.Logout /> <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome back! 👋
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Here's what's happening today.
                        </p>
                    </div>
                    <div
                        onClick={() => navigate("/studentProfile")}
                        className="h-12 w-12 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-sm"
                        title="Go to Profile"
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`}
                            alt="User"
                        />
                    </div>
                </header>

                <div className="max-w-6xl">
                    {activeTab === "overview" && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <SeatStatus />
                            <Notices />
                        </div>
                    )}
                    {activeTab === "meals" && <MealManager />}
                    {activeTab === "notices" && <Notices />}
                    {activeTab === "complaints" && <Complaints />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
