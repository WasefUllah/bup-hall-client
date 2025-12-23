import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            
            {/* 1. HERO SECTION */}
            <div 
                className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
                style={{ 
                    backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" 
                    // Note: You can replace this URL with a real photo of BUP Campus later
                }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                {/* Content */}
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                        Welcome to <span className="text-blue-400">BUP Hall</span> Management System
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Streamlining residential life for the students of Bangladesh University of Professionals. 
                        Apply for seats, manage meals, and pay bills — all in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                        >
                            Student Login
                        </button>
                        <button 
                            onClick={() => navigate('/signup')}
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full transition-all"
                        >
                            New Registration
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. FEATURES SECTION */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Use This Portal?</h2>
                    <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
                        We have digitized the entire manual process to make your hall life easier and more transparent.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 bg-blue-50 rounded-xl hover:shadow-xl transition-shadow border border-blue-100">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto">
                                🪑
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Seat Allocation</h3>
                            <p className="text-gray-600">
                                No more running to the office. Submit your seat application online and track your approval status in real-time.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 bg-green-50 rounded-xl hover:shadow-xl transition-shadow border border-green-100">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto">
                                🍲
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Meal Manager</h3>
                            <p className="text-gray-600">
                                Turn your meal plan on or off from your phone. Reduce food waste and save money on your dining bill.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 bg-purple-50 rounded-xl hover:shadow-xl transition-shadow border border-purple-100">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto">
                                📢
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Notice Board</h3>
                            <p className="text-gray-600">
                                Never miss an important announcement. Get instant updates on Hall Fests, Maintenance, and Holidays.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. STATS SECTION */}
            <section className="py-12 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold mb-1">2000+</p>
                            <p className="text-blue-200 text-sm uppercase tracking-wider">Residents</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold mb-1">4</p>
                            <p className="text-blue-200 text-sm uppercase tracking-wider">Halls</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold mb-1">100%</p>
                            <p className="text-blue-200 text-sm uppercase tracking-wider">Digitized</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold mb-1">24/7</p>
                            <p className="text-blue-200 text-sm uppercase tracking-wider">Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CONTACT & FOOTER SECTION */}
            

        </div>
    );
};

export default Home;