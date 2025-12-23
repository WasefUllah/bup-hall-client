import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    // State to hold the list of days and their meal status
    const [days, setDays] = useState([]);

    // This runs once when the page loads to generate the next 30 days
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight

        const next30Days = [];

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            
            // Check local storage for saved data
            const savedMeals = JSON.parse(localStorage.getItem(dateString)) || {
                breakfast: false,
                lunch: false,
                dinner: false,
                done: false
            };

            next30Days.push({
                dateObject: date,
                dateString: dateString,
                ...savedMeals
            });
        }
        setDays(next30Days);
    }, []);

    // Function to handle checkbox changes
    const handleCheck = (index, mealType) => {
        const newDays = [...days];
        newDays[index][mealType] = !newDays[index][mealType];
        setDays(newDays);
    };

    // Function to save the row to Local Storage
    const handleSave = (index) => {
        const day = days[index];
        const dataToSave = {
            breakfast: day.breakfast,
            lunch: day.lunch,
            dinner: day.dinner,
            done: true
        };
        
        // Save to browser storage
        localStorage.setItem(day.dateString, JSON.stringify(dataToSave));

        // Update state to show "Saved" button
        const newDays = [...days];
        newDays[index].done = true;
        setDays(newDays);

        alert(`Meals for ${day.dateObject.toDateString()} saved!`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Student Dashboard</h1>
                        <p className="text-indigo-200">Welcome back, User</p>
                    </div>
                    <div className="bg-indigo-700 px-4 py-2 rounded-lg">
                        <span className="font-bold block text-sm">Balance</span>
                        <span className="text-xl">৳ 5,000</span>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Meal Manager</h2>
                    <p className="text-sm text-gray-500 mb-6">Select your meals for the upcoming days. You cannot change meals for today or past dates.</p>

                    <div id="meal-schedule-container" className="space-y-0">
                        {days.map((day, index) => {
                            // Logic to disable past/today rows
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const isPastOrToday = day.dateObject <= today;
                            const isDisabled = isPastOrToday;
                            const rowClass = isDisabled ? 'bg-gray-50 opacity-60 pointer-events-none' : 'bg-white hover:bg-blue-50';

                            return (
                                <div key={day.dateString} className={`flex flex-wrap items-center justify-between p-4 border-b border-gray-200 ${rowClass}`}>
                                    {/* Date Column */}
                                    <div className="w-full sm:w-1/4 mb-3 sm:mb-0">
                                        <p className="font-bold text-lg text-gray-800">
                                            {day.dateObject.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {day.dateObject.toLocaleDateString(undefined, { weekday: 'long' })}
                                        </p>
                                    </div>

                                    {/* Checkboxes Column */}
                                    <div className="w-full sm:w-1/2 flex items-center justify-around mb-4 sm:mb-0">
                                        {['breakfast', 'lunch', 'dinner'].map((meal) => (
                                            <label key={meal} className="flex items-center space-x-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="checkbox checkbox-primary h-5 w-5 rounded border-gray-300"
                                                    checked={day[meal]}
                                                    onChange={() => handleCheck(index, meal)}
                                                    disabled={isDisabled}
                                                />
                                                <span className="capitalize text-gray-700">{meal}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Save Button Column */}
                                    <div className="w-full sm:w-1/4 flex justify-center sm:justify-end">
                                        <button 
                                            onClick={() => handleSave(index)}
                                            disabled={isDisabled}
                                            className={`font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-300 ${
                                                day.done 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {day.done ? 'Saved' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;