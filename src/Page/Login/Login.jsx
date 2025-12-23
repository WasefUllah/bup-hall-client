import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage('');

        if (!studentId || !password) {
            setMessage('Please enter both Student ID and Password.');
            return;
        }

        setIsLoading(true);
        setMessage('Attempting to log in...');

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            
            // Check if user is admin
            if (studentId === "admin" && password === "password") {
                setMessage('Login successful! Redirecting to Admin Panel...');
                navigate('/admin');
            } 
            // Check if user is student (demo logic)
            else if (studentId !== "" && password !== "") {
                setMessage('Login successful! Redirecting...');
                navigate('/dashboard');
            } else {
                setMessage('Invalid Student ID or Password.');
            }
        }, 1000);
    }; // <--- THIS WAS MISSING (Closes handleLogin)

    return (
        <section id="login" className="page-section">
            <div className="bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center min-h-screen p-4">
                <div className="login-container bg-white shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-md animate-[fadeInScaleUp_0.5s_ease-out_forwards]">
                    <header className="text-center mb-8">
                        <i className="fas fa-user-graduate text-5xl text-sky-600 mb-3"></i>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Portal Login</h1>
                        <p className="text-slate-500 mt-2">Access your student dashboard.</p>
                    </header>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="studentId" className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    id="studentId" 
                                    className="block w-full p-2.5 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                                    placeholder="Enter your student ID" 
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    id="password" 
                                    className="block w-full p-2.5 border border-slate-300 rounded-lg focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                                    placeholder="Enter your password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-slate-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
                            </div>
                            <div className="text-sm"><a href="#" className="font-medium text-sky-600 hover:text-sky-500">Forgot password?</a></div>
                        </div>
                        
                        {/* Login Button */}
                        <div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <i className="fas fa-sign-in-alt mr-2 mt-0.5"></i> 
                                {isLoading ? 'Logging in...' : 'Sign In'}
                            </button>
                        </div>

                        {/* Register Link */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Register here</Link>
                            </p>
                        </div>
                    </form>

                    {/* Message Display */}
                    {message && (
                        <p className={`mt-6 text-center text-sm font-medium ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Login;