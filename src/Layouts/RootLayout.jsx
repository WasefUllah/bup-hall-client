import React from "react";
import { Outlet } from "react-router-dom"; // Use 'react-router-dom' if that's what is installed, but your file used 'react-router'
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const RootLayout = () => {
    return (
        <div>
            {/* The Navbar sits at the top */}
            <Navbar />

            {/* Outlet is where the middle content (Home, Login, etc.) will change */}
            <div className="min-h-screen">
                <Outlet />
            </div>

            {/* The Footer sits at the bottom */}
            <Footer />
        </div>
    );
};

export default RootLayout;