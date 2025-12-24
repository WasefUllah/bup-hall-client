import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const MealOrders = () => {
    // Default to TOMORROW since that's what the admin cares about most
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [stats, setStats] = useState({ 
        breakfast: 0, 
        lunch: 0, 
        dinner: 0,
        totalMoney: 0 
    });

    useEffect(() => {
        // Query the 'meals' collection where date == selectedDate
        const q = query(collection(db, "meals"), where("date", "==", selectedDate));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let b = 0, l = 0, d = 0;
            
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.breakfast) b++;
                if (data.lunch) l++;
                if (data.dinner) d++;
            });

            // Calculate Total Cost: B=5, L=10, D=10
            const totalMoney = (b * 5) + (l * 10) + (d * 10);

            setStats({ breakfast: b, lunch: l, dinner: d, totalMoney });
        });

        return () => unsubscribe();
    }, [selectedDate]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daily Meal Report</h2>
                    <p className="text-sm text-gray-500">Summary for kitchen & accounts</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-600">Select Date:</span>
                    <input 
                        type="date" 
                        className="input input-bordered input-sm bg-gray-50"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Counts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Breakfast Card */}
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-4xl opacity-10">🍳</div>
                    <p className="text-orange-600 font-bold uppercase text-xs tracking-wider">Breakfast (5৳)</p>
                    <h1 className="text-5xl font-black text-orange-700 mt-2">{stats.breakfast}</h1>
                    <p className="text-xs text-orange-800 mt-2 opacity-60">Orders</p>
                </div>

                {/* Lunch Card */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-4xl opacity-10">🍚</div>
                    <p className="text-blue-600 font-bold uppercase text-xs tracking-wider">Lunch (10৳)</p>
                    <h1 className="text-5xl font-black text-blue-700 mt-2">{stats.lunch}</h1>
                    <p className="text-xs text-blue-800 mt-2 opacity-60">Orders</p>
                </div>

                {/* Dinner Card */}
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-4xl opacity-10">🍗</div>
                    <p className="text-purple-600 font-bold uppercase text-xs tracking-wider">Dinner (10৳)</p>
                    <h1 className="text-5xl font-black text-purple-700 mt-2">{stats.dinner}</h1>
                    <p className="text-xs text-purple-800 mt-2 opacity-60">Orders</p>
                </div>

                {/* Total Money Card */}
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center flex flex-col justify-center">
                    <p className="text-green-600 font-bold uppercase text-xs tracking-wider">Estimated Collection</p>
                    <h1 className="text-4xl font-black text-green-700 mt-2">৳ {stats.totalMoney}</h1>
                    <p className="text-xs text-green-800 mt-2 opacity-60">Total Value</p>
                </div>
            </div>
        </div>
    );
};

export default MealOrders;