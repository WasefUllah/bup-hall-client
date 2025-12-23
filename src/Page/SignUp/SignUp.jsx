import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider'; // Import Context

const SignUp = () => {
    const navigate = useNavigate();
    const { createUser } = useContext(AuthContext); // Use the hook
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // REAL FIREBASE SIGN UP
            await createUser(email, password);
            alert("Registration Successful!");
            navigate('/dashboard'); // Go straight to dashboard
        } catch (err) {
            setError(err.message); // Show real error from Firebase
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
             {/* ... Keep your UI JSX exactly the same, just ensure inputs have name="email", name="password" ... */}
             <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-bold mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Add required inputs here matching the names above */}
                    <input name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" required />
                    <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" required />
                    <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full p-2 border rounded" required />
                    
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    
                    <button className="w-full bg-indigo-600 text-white py-2 rounded">Sign Up</button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                </p>
             </div>
        </div>
    );
};

export default SignUp;