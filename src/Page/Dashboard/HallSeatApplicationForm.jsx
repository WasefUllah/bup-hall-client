import { useForm } from "react-hook-form";

export default function HallSeatApplicationForm() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    // Shared styles for visibility and consistency
    const labelStyle = "label-text font-bold text-gray-800 mb-1 block";
    const inputStyle =
        "input input-bordered w-full bg-white border-gray-400 focus:border-blue-600 focus:outline-none text-gray-900";
    const textareaStyle =
        "textarea textarea-bordered w-full bg-white border-gray-400 focus:border-blue-600 focus:outline-none text-gray-900";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="p-6 md:p-10">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold text-black">
                                Application for Hall Seat Allocation
                            </h2>
                            <span className="block text-md font-medium text-gray-600 mt-1 uppercase tracking-wider">
                                Bangladesh University of Professionals (BUP)
                            </span>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            {/* SECTION: Student Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-blue-700 border-b pb-1">
                                    Student Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Student Name
                                        </label>
                                        <input
                                            className={inputStyle}
                                            {...register("studentName")}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Year
                                        </label>
                                        <input
                                            className={inputStyle}
                                            {...register("year")}
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className={labelStyle}>
                                        Department
                                    </label>
                                    <input
                                        className={inputStyle}
                                        {...register("department")}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Roll No
                                        </label>
                                        <input
                                            className={inputStyle}
                                            {...register("rollNo")}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Gender
                                        </label>
                                        <div className="flex gap-8 items-center h-12">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="radio radio-primary border-gray-400"
                                                    value="Male"
                                                    {...register("gender")}
                                                />
                                                <span className="text-gray-800">
                                                    Male
                                                </span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="radio radio-primary border-gray-400"
                                                    value="Female"
                                                    {...register("gender")}
                                                />
                                                <span className="text-gray-800">
                                                    Female
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Mobile
                                        </label>
                                        <input
                                            className={inputStyle}
                                            {...register("mobile")}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className={inputStyle}
                                            {...register("email")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: Father Info */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-lg font-bold text-blue-700 border-b pb-1">
                                    Father's Information
                                </h3>
                                <div className="form-control">
                                    <label className={labelStyle}>
                                        Father's Name
                                    </label>
                                    <input
                                        className={inputStyle}
                                        {...register("fatherName")}
                                    />
                                </div>

                                <div className="form-control">
                                    <label className={labelStyle}>
                                        Designation & Office Address
                                    </label>
                                    <textarea
                                        rows="2"
                                        className={textareaStyle}
                                        {...register("fatherDesignation")}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Office Phone
                                        </label>
                                        <input
                                            className={inputStyle}
                                            {...register("fatherOfficePhone")}
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className={labelStyle}>
                                            Father's Mobile
                                        </label>
                                        <input
                                            className={inputStyle}
                                            {...register("fatherMobile")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="form-control">
                                    <label className={labelStyle}>
                                        Present Address
                                    </label>
                                    <textarea
                                        rows="3"
                                        className={textareaStyle}
                                        {...register("presentAddress")}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className={labelStyle}>
                                        Permanent Address
                                    </label>
                                    <textarea
                                        rows="3"
                                        className={textareaStyle}
                                        {...register("permanentAddress")}
                                    />
                                </div>
                            </div>

                            {/* SECTION: Recommendations */}
                            <div className="border-t border-gray-300 pt-8">
                                <h3 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
                                    Official Recommendations
                                </h3>

                                {[
                                    [
                                        "Section Officer / Assistant Director",
                                        "sectionOfficer",
                                    ],
                                    ["Batch Advisor", "batchAdvisor"],
                                    ["Head of Department", "hod"],
                                ].map(([title, key]) => (
                                    <div
                                        key={key}
                                        className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                        <label className="label-text font-bold text-gray-700 mb-2 block">
                                            {title}
                                        </label>
                                        <textarea
                                            className={`${textareaStyle} mb-4`}
                                            placeholder={`Comments/Recommendation from ${title}`}
                                            {...register(
                                                `${key}Recommendation`
                                            )}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <input
                                                    className={inputStyle}
                                                    placeholder="Signature & Seal"
                                                    {...register(
                                                        `${key}Signature`
                                                    )}
                                                />
                                            </div>
                                            <div className="form-control">
                                                <input
                                                    type="date"
                                                    className={inputStyle}
                                                    {...register(`${key}Date`)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Submit Button */}
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
