import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            await signIn(email, password);
            // Admin Check (Hardcoded for demo)
            if (email === "admin@bup.edu.bd") {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError("Invalid Email or Password. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white text-black">
            
            {/* LEFT SIDE: LOGIN FORM */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Please sign in to your BUP Hall account
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors" 
                                    placeholder="student@bup.edu.bd" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input 
                                    name="password" 
                                    type="password" 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors" 
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <span className="loading loading-spinner loading-sm"></span> 
                                ) : "Sign In"}
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mt-4">
                            <span className="text-gray-600">Don't have an account?</span>
                            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-500">
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE: IMAGE OVERLAY */}
            <div className="hidden md:block w-1/2 bg-cover bg-center relative" 
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-blue-800/40 flex flex-col justify-end p-12 text-white">
                    <h3 className="text-3xl font-bold mb-2">Excellence in Education</h3>
                    <p className="text-blue-100 text-lg">Bangladesh University of Professionals</p>
                </div>
            </div>

        </div>
    );
};

export default Login;