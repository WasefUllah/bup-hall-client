import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.config"; // Import Database
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

export default function HallSeatApplicationForm() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            // 1. Create a reference to the 'applications' collection
            const appsCollection = collection(db, "applications");
            
            // 2. Add the new document
            await addDoc(appsCollection, {
                ...data,
                status: "pending",
                studentEmail: user?.email, // Tag the application with the user's email
                submittedAt: new Date().toISOString()
            });

            alert("Application Submitted Successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting:", error);
            alert("Failed to submit application. Check console for details.");
        }
    };

    // Shared styles
    const labelStyle = "label-text font-bold text-gray-800 mb-1 block";
    const inputStyle = "input input-bordered w-full bg-white border-gray-400 focus:border-blue-600 focus:outline-none text-gray-900";
    const textareaStyle = "textarea textarea-bordered w-full bg-white border-gray-400 focus:border-blue-600 focus:outline-none text-gray-900";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 md:p-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-black">Hall Seat Application</h2>
                            <span className="block text-md font-medium text-gray-600 mt-1 uppercase tracking-wider">
                                Bangladesh University of Professionals
                            </span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-blue-700 border-b pb-1">Student Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className={labelStyle}>Student Name</label>
                                        <input className={inputStyle} {...register("studentName", { required: true })} />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>Department</label>
                                        <input className={inputStyle} {...register("department", { required: true })} />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>Roll No</label>
                                        <input className={inputStyle} {...register("rollNo", { required: true })} />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>Phone Number</label>
                                        <input className={inputStyle} {...register("mobile", { required: true })} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button className="btn btn-primary btn-lg px-12 text-white shadow-lg border-none hover:bg-blue-700">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}