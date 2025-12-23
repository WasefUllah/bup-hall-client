import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase.config";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../providers/AuthProvider";

export default function HallSeatApplicationForm() {
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // SMART FEATURE: Auto-fill Name & Email from Database when form loads
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setValue("studentName", data.name);
                    setValue("studentId", data.studentId);
                    setValue("department", data.department);
                    setValue("program", data.program);
                }
            }
        };
        fetchUserData();
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            await addDoc(collection(db, "applications"), {
                ...data,
                status: "pending",
                studentEmail: user?.email,
                studentUid: user?.uid,
                submittedAt: new Date().toISOString(),
                // These will be filled by Admin later
                hallName: "",
                roomNo: "",
                seatNumber: ""
            });

            alert("Full Application Submitted Successfully!");
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting:", error);
            alert("Failed to submit application.");
        }
    };

    // Styles
    const sectionTitle = "text-xl font-bold text-blue-800 border-b-2 border-blue-100 pb-2 mb-4 mt-6";
    const labelStyle = "label-text font-bold text-gray-700 mb-1 block";
    const inputStyle = "input input-bordered w-full bg-white border-gray-300 focus:border-blue-600 focus:outline-none text-gray-900";
    const textareaStyle = "textarea textarea-bordered w-full bg-white border-gray-300 focus:border-blue-600 focus:outline-none text-gray-900";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-4xl">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-blue-900 p-8 text-center">
                        <h2 className="text-3xl font-bold text-white">Hall Seat Application</h2>
                        <p className="text-blue-200 mt-2 uppercase tracking-widest text-sm">Bangladesh University of Professionals</p>
                    </div>

                    <div className="p-8 md:p-10">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            
                            {/* 1. ACADEMIC INFO (Auto-Filled) */}
                            <h3 className={sectionTitle}>1. Academic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className={labelStyle}>Student Name (Auto)</label>
                                    <input className={`${inputStyle} bg-gray-100 cursor-not-allowed`} readOnly {...register("studentName")} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Student ID (Auto)</label>
                                    <input className={`${inputStyle} bg-gray-100 cursor-not-allowed`} readOnly {...register("studentId")} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Department</label>
                                    <input className={`${inputStyle} bg-gray-100 cursor-not-allowed`} readOnly {...register("department")} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Program</label>
                                    <input className={`${inputStyle} bg-gray-100 cursor-not-allowed`} readOnly {...register("program")} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Current Year/Semester</label>
                                    <input className={inputStyle} placeholder="e.g. 2nd Year, 1st Semester" {...register("yearSemester", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>CGPA (Last Semester)</label>
                                    <input className={inputStyle} placeholder="e.g. 3.50" {...register("cgpa", { required: true })} />
                                </div>
                            </div>

                            {/* 2. CONTACT INFO */}
                            <h3 className={sectionTitle}>2. Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className={labelStyle}>Personal Mobile Number</label>
                                    <input className={inputStyle} placeholder="017XX-XXXXXX" {...register("mobile", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Email Address</label>
                                    <input className={inputStyle} defaultValue={user?.email} readOnly />
                                </div>
                            </div>

                            {/* 3. PARENTS INFO */}
                            <h3 className={sectionTitle}>3. Parents Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className={labelStyle}>Father's Name</label>
                                    <input className={inputStyle} {...register("fatherName", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Father's Mobile</label>
                                    <input className={inputStyle} {...register("fatherMobile", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Mother's Name</label>
                                    <input className={inputStyle} {...register("motherName", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Mother's Mobile</label>
                                    <input className={inputStyle} {...register("motherMobile")} />
                                </div>
                            </div>

                            {/* 4. PERMANENT ADDRESS */}
                            <h3 className={sectionTitle}>4. Permanent Address</h3>
                            <div className="form-control">
                                <label className={labelStyle}>Full Address (Village/Road, District, Thana)</label>
                                <textarea className={textareaStyle} rows="3" placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka" {...register("permanentAddress", { required: true })}></textarea>
                            </div>

                            {/* 5. LOCAL GUARDIAN (CRITICAL) */}
                            <h3 className={sectionTitle}>5. Local Guardian (Dhaka)</h3>
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                                <p className="text-xs text-yellow-800">
                                    * Local Guardian must be someone living in Dhaka who can be contacted in case of emergency.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className={labelStyle}>Local Guardian Name</label>
                                    <input className={inputStyle} {...register("localGuardianName", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Relationship</label>
                                    <input className={inputStyle} placeholder="e.g. Uncle, Aunt, Brother" {...register("localGuardianRelation", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Guardian's Mobile</label>
                                    <input className={inputStyle} {...register("localGuardianMobile", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>Guardian's Address</label>
                                    <input className={inputStyle} placeholder="Area in Dhaka" {...register("localGuardianAddress", { required: true })} />
                                </div>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <div className="flex justify-end pt-8 gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-ghost btn-lg text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button className="btn btn-primary btn-lg px-12 text-white shadow-xl border-none hover:bg-blue-800">
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