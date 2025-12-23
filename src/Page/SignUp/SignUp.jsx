import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentId: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Simulate API Signup
        try {
            // In a real app, you would use: await fetch('/api/signup', ...)
            console.log("Registering:", formData);
            alert("Registration Successful! Please Login.");
            navigate('/login');
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Student Registration</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Create your BUP Hall account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="studentId" className="sr-only">Student ID</label>
                            <input name="studentId" type="text" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Student ID" onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dob" className="sr-only">Date of Birth</label>
                            <input name="dob" type="date" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">BUP Mail</label>
                            <input name="email" type="email" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="BUP Mail Address" onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input name="password" type="password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password" onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input name="confirmPassword" type="password" required className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Confirm Password" onChange={handleChange} />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Sign up
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Already have an account? Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;