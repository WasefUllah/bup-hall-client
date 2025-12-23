import React, { useState, useEffect } from "react";

const Home = () => {
    // --- SLIDESHOW LOGIC ---
    // We use React state to keep track of which image is showing
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        'https://bup.edu.bd/public/upload/slider/20250324_1742832735693.jpg',
        'https://bup.edu.bd/public/upload/slider/20250324_1742832599507.jpg',
        'https://bup.edu.bd/public/upload/slider/20250324_1742832629873.jpg',
        'https://bup.edu.bd/public/upload/slider/20250324_1742832654632.jpg'
    ];

    // This effect runs a timer to change the image every 4 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4000);

        // Cleanup the timer when the component closes
        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <main>
            {/* --- HERO SECTION --- */}
            <section id="home" className="page-section p-0">
                <div className="hero min-h-[calc(100vh-4rem)] relative overflow-hidden" id="hero-slideshow">
                    {/* The Slides Container */}
                    <div 
                        className="slides-container absolute top-0 left-0 h-full w-full flex transition-all duration-1000 ease-in-out"
                        style={{ marginLeft: `-${currentImageIndex * 100}%` }} 
                    >
                        {images.map((img, index) => (
                            <img 
                                key={index} 
                                src={img} 
                                className="slide-image min-w-full h-full object-cover" 
                                alt={`Slide ${index}`} 
                            />
                        ))}
                    </div>

                    {/* Dark Overlay */}
                    <div className="hero-overlay bg-black bg-opacity-60 absolute inset-0"></div>

                    {/* Text Content */}
                    <div className="hero-content text-neutral-content text-center relative z-10 flex flex-col items-center justify-center h-full">
                        <div className="max-w-md">
                            <h1 className="mb-5 text-5xl font-bold text-white">Welcome to BUP Hall</h1>
                            <p className="mb-5 text-gray-200">
                                Experience a comfortable and secure stay with our top-notch facilities and dedicated support. Your home away from home.
                            </p>
                            <a href="#admission" className="btn btn-primary">Get Started</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- HALL FACILITIES --- */}
            <section id="hall-facility" className="page-section py-16 bg-gray-50">
                <div className="container mx-auto p-4 md:p-8">
                    <header className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">Hall Facilities</h2>
                        <p className="mt-4 text-lg text-slate-600">Discover the benefits of living on campus.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10 lg:gap-y-12">
                        {/* Feature Item 1 */}
                        <div className="feature-item p-4 bg-white rounded-xl shadow-md hover:-translate-y-1 transition-transform flex items-start">
                            <div className="feature-icon-wrapper mr-4 bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                <i className="fas fa-brain text-xl"></i>
                            </div>
                            <div className="feature-content">
                                <h3 className="feature-title text-xl font-bold mb-1">Smart Living Scope</h3>
                                <p className="feature-description text-gray-600 text-sm">Stay closer to the library, faculty, and your peers.</p>
                            </div>
                        </div>
                        
                        {/* Feature Item 2 */}
                        <div className="feature-item p-4 bg-white rounded-xl shadow-md hover:-translate-y-1 transition-transform flex items-start">
                            <div className="feature-icon-wrapper mr-4 bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                <i className="fas fa-map-marker-alt text-xl"></i>
                            </div>
                            <div className="feature-content">
                                <h3 className="feature-title text-xl font-bold mb-1">Close to the Class</h3>
                                <p className="feature-description text-gray-600 text-sm">You're just minutes away from your classes.</p>
                            </div>
                        </div>

                         {/* Feature Item 3 */}
                         <div className="feature-item p-4 bg-white rounded-xl shadow-md hover:-translate-y-1 transition-transform flex items-start">
                            <div className="feature-icon-wrapper mr-4 bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                <i className="fas fa-shield-alt text-xl"></i>
                            </div>
                            <div className="feature-content">
                                <h3 className="feature-title text-xl font-bold mb-1">Safety & Security</h3>
                                <p className="feature-description text-gray-600 text-sm">24/7 security staff and CCTV surveillance.</p>
                            </div>
                        </div>

                         {/* Feature Item 4 */}
                         <div className="feature-item p-4 bg-white rounded-xl shadow-md hover:-translate-y-1 transition-transform flex items-start">
                            <div className="feature-icon-wrapper mr-4 bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                <i className="fas fa-wifi text-xl"></i>
                            </div>
                            <div className="feature-content">
                                <h3 className="feature-title text-xl font-bold mb-1">Wireless Connectivity</h3>
                                <p className="feature-description text-gray-600 text-sm">Seamless Wi-Fi access throughout the hall.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- IN-ROOM FACILITIES --- */}
            <section id="in-room-facility" className="page-section py-16">
                <div className="container mx-auto p-4 md:p-8">
                    <header className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">In-Room Facilities</h2>
                        <p className="mt-4 text-lg text-slate-600">Comfort and convenience, right in your room.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10">
                        <div className="amenity-category">
                            <h2 className="category-title text-xl font-semibold border-b-2 border-indigo-100 pb-2 mb-3">Furnishings</h2>
                            <ul className="amenity-list space-y-2">
                                <li className="flex items-center text-gray-600"><i className="fas fa-bed text-indigo-600 mr-3 w-5 text-center"></i>One Bed per Student</li>
                                <li className="flex items-center text-gray-600"><i className="fas fa-chair text-indigo-600 mr-3 w-5 text-center"></i>Study table & Chair</li>
                                <li className="flex items-center text-gray-600"><i className="fas fa-lightbulb text-indigo-600 mr-3 w-5 text-center"></i>Tube lights & Fan</li>
                            </ul>
                        </div>
                        <div className="amenity-category">
                            <h2 className="category-title text-xl font-semibold border-b-2 border-indigo-100 pb-2 mb-3">Utilities</h2>
                            <ul className="amenity-list space-y-2">
                                <li className="flex items-center text-gray-600"><i className="fas fa-bolt text-indigo-600 mr-3 w-5 text-center"></i>Electricity Facility</li>
                                <li className="flex items-center text-gray-600"><i className="fas fa-wifi text-indigo-600 mr-3 w-5 text-center"></i>Broadband and Wi-Fi</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ADMISSION --- */}
            <section id="admission" className="page-section py-16 bg-white">
                <div className="admission-container max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6 md:p-10 border border-gray-100">
                    <header className="text-center mb-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">Admissions</h2>
                        <p className="mt-4 text-lg text-slate-600">Your guide to joining the BUP Hall community.</p>
                    </header>
                    <div className="mb-8 pb-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-semibold text-slate-700">Apply for a seat</h2>
                        <a href="/login" className="btn btn-warning text-white font-bold">
                            BUP HALL PORTAL <i className="fas fa-external-link-alt ml-2"></i>
                        </a>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Admission Eligibility</h3>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600">
                            <li>Must be a regular student of BUP.</li>
                            <li>Minimum SGPA of 2.5 for readmission/existing students.</li>
                        </ul>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;