import React from "react";

const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}
        >
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-xs uppercase font-bold">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

export default StatCard;
