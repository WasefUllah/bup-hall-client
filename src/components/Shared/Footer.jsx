import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-4 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Brand Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">BUP Hall</h2>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Bangladesh University of Professionals<br/>
                        Mirpur Cantonment, Dhaka-1216<br/>
                        Bangladesh
                    </p>
                </div>

                {/* Quick Links Section */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <button onClick={() => navigate('/login')} className="hover:text-blue-400 transition-colors">
                                Student Login
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/signup')} className="hover:text-blue-400 transition-colors">
                                Registration
                            </button>
                        </li>
                        <li>
                            <a href="https://bup.edu.bd" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                                BUP Website
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div>
                    <h3 className="text-lg font-bold text-white mb-4">Contact Authority</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2">
                            <span>📧</span> info@bup.edu.bd
                        </li>
                        <li className="flex items-center gap-2">
                            <span>📞</span> +880 9666790790
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} BUP Hall Management System. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;