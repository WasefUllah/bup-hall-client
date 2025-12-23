import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

const Login = () => {
    const { signIn } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const email = form.email.value; // changed from studentId to email for Firebase
        const password = form.password.value;

        try {
            // REAL FIREBASE LOGIN
            await signIn(email, password);
            
            // Check for Admin (Hardcoded for now, or we can check DB later)
            if (email === "admin@bup.edu.bd") {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError("Invalid Email or Password");
            console.error(err);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        {/* CHANGED: type="text" to type="email", name="email" */}
                        <input name="email" type="email" required className="w-full border p-2 rounded" placeholder="admin@bup.edu.bd" />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input name="password" type="password" required className="w-full border p-2 rounded" placeholder="********" />
                    </div>
                    
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <button className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Sign In</button>
                </form>
                <div className="mt-4 text-center">
                    <p>Don't have an account? <Link to="/signup" className="text-blue-600">Register</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Login;