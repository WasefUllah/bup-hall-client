import React from 'react';
import { Link } from 'react-router'; // We use Link for internal page navigation

const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            {/* Navbar Start - Mobile Dropdown & Logo */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[100] mt-3 w-52 p-2 shadow">
                        {/* We use href="#id" to scroll to sections on the Home page */}
                        <li><a href="/#home">Home</a></li>
                        <li tabIndex={0}>
                            <a>Facilities</a>
                            <ul className="p-2">
                                <li><a href="/#hall-facility">Hall Facilities</a></li>
                                <li><a href="/#in-room-facility">In-room Facilities</a></li>
                            </ul>
                        </li>
                        <li><a href="/#admission">Admission</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                
                <div className="flex items-center">
                    <a href="https://bup.edu.bd/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <img className="h-10 w-auto mr-2" src="https://bup.edu.bd/public/upload/logo/202306071686132726.svg" alt="BUP Logo" />
                    </a>
                    <Link to="/" className="btn btn-ghost text-xl normal-case">BUP Hall</Link>
                </div>
            </div>

            {/* Navbar Center - Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/#home">Home</a></li>
                    <li>
                        <details>
                            <summary>Facilities</summary>
                            <ul className="p-2 bg-base-100 rounded-t-none z-[100]">
                                <li><a href="/#hall-facility">Hall Facilities</a></li>
                                <li><a href="/#in-room-facility">In-room Facilities</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a href="/#admission">Admission</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>

            {/* Navbar End - Login Button */}
            <div className="navbar-end">
                {/* We point this to a Route that we will build later */}
                <Link to="/login" className="btn btn-primary">Hall Portal</Link>
            </div>
        </div>
    );
};

export default Navbar;