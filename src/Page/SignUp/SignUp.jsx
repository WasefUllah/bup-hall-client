import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { db } from '../../firebase/firebase.config';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
    const navigate = useNavigate();
    const { createUser } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;

        // Collect Personal Data
        const userData = {
            name: form.name.value,
            studentId: form.studentId.value,
            department: form.department.value,
            batch: form.batch.value,
            bloodGroup: form.bloodGroup.value,
            religion: form.religion.value,
            program: form.program.value,
            email: email,
            role: 'student',
            createdAt: new Date().toISOString()
        };

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const result = await createUser(email, password);
            await setDoc(doc(db, "users", result.user.uid), userData);
            alert("Account Created Successfully!");
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    // Style Helper
    const inputClass = "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:bg-white focus:outline-none transition-colors text-sm text-gray-900";
    const labelClass = "block text-xs font-bold text-gray-500 uppercase mb-1 ml-1";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Header */}
                <div className="bg-blue-900 px-8 py-6 text-center">
                    <h2 className="text-3xl font-extrabold text-white">Student Registration</h2>
                    <p className="mt-2 text-blue-200 text-sm">Join the BUP Hall Management System</p>
                </div>

                <form className="px-8 py-10 space-y-8" onSubmit={handleSubmit}>
                    
                    {/* Section 1: Academic Info */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Academic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input name="name" type="text" required className={inputClass} placeholder="e.g. Md. Shehab Uddin" />
                            </div>
                            <div>
                                <label className={labelClass}>Student ID</label>
                                <input name="studentId" type="text" required className={inputClass} placeholder="e.g. 235490xxxx" />
                            </div>
                            <div>
                                <label className={labelClass}>Department</label>
                                <select name="department" className={inputClass} required>
                                    <option value="">Select Dept</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ICT">ICT</option>
                                    <option value="BBA">BBA</option>
                                    <option value="IR">IR</option>
                                    <option value="English">English</option>
                                    <option value="Law">Law</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Batch</label>
                                <input name="batch" type="text" required className={inputClass} placeholder="e.g. Batch-2023" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Personal Details */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClass}>Program</label>
                                <select name="program" className={inputClass} required>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Masters">Masters</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Blood Group</label>
                                <select name="bloodGroup" className={inputClass} required>
                                    <option value="">Select Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Religion</label>
                                <select name="religion" className={inputClass} required>
                                    <option value="">Select Religion</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Buddhism">Buddhism</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Credentials */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Login Credentials</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input name="email" type="email" required className={inputClass} placeholder="your.name@student.bup.edu.bd" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Password</label>
                                    <input name="password" type="password" required className={inputClass} placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm Password</label>
                                    <input name="confirmPassword" type="password" required className={inputClass} placeholder="••••••••" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-600 bg-red-50 p-3 rounded text-center font-bold text-sm">{error}</p>}

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-blue-900 hover:bg-blue-800 transition-all transform hover:scale-[1.01]">
                            {loading ? 'Creating Profile...' : 'Complete Registration'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-500">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;