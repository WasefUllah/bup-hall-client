import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const MealOrders = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [counts, setCounts] = useState({ breakfast: 0, lunch: 0, dinner: 0 });

    useEffect(() => {
        const q = query(collection(db, "meals"), where("date", "==", selectedDate));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let b = 0, l = 0, d = 0;
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.breakfast) b++;
                if (data.lunch) l++;
                if (data.dinner) d++;
            });
            setCounts({ breakfast: b, lunch: l, dinner: d });
        });

        return () => unsubscribe();
    }, [selectedDate]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold">Meal Requirement Summary</h2>
                <input 
                    type="date" 
                    className="input input-bordered bg-white text-black"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-center">
                    <p className="text-orange-600 font-bold uppercase text-xs">Breakfast</p>
                    <h1 className="text-4xl font-black text-orange-700">{counts.breakfast}</h1>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
                    <p className="text-blue-600 font-bold uppercase text-xs">Lunch</p>
                    <h1 className="text-4xl font-black text-blue-700">{counts.lunch}</h1>
                </div>
                <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                    <p className="text-green-600 font-bold uppercase text-xs">Dinner</p>
                    <h1 className="text-4xl font-black text-green-700">{counts.dinner}</h1>
                </div>
            </div>
        </div>
    );
};

export default MealOrders;