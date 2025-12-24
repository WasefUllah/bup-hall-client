import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../providers/AuthProvider';

const MealManager = () => {
    const { user } = useContext(AuthContext);
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeals = async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const next7Days = [];

            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                
                // Check Firebase instead of LocalStorage
                const mealRef = doc(db, "meals", `${dateStr}_${user.email}`);
                const mealSnap = await getDoc(mealRef);
                
                const mealData = mealSnap.exists() ? mealSnap.data() : { breakfast: false, lunch: false, dinner: false };
                
                // 10 PM LOCK LOGIC
                const now = new Date();
                const isLate = now.getHours() >= 22; // 22 is 10 PM
                const isTargetToday = i === 0;
                const isLocked = isTargetToday && isLate;

                next7Days.push({ 
                    dateObject: date, 
                    dateString: dateStr, 
                    isLocked, 
                    ...mealData 
                });
            }
            setDays(next7Days);
            setLoading(false);
        };
        if (user) fetchMeals();
    }, [user]);

    const handleCheck = (index, meal) => {
        if (days[index].isLocked) return;
        const newDays = [...days];
        newDays[index][meal] = !newDays[index][meal];
        setDays(newDays);
    };

    const handleSave = async (index) => {
        const day = days[index];
        const mealRef = doc(db, "meals", `${day.dateString}_${user.email}`);
        try {
            await setDoc(mealRef, {
                breakfast: day.breakfast,
                lunch: day.lunch,
                dinner: day.dinner,
                studentEmail: user.email,
                date: day.dateString
            });
            alert("Meal plan updated!");
        } catch (e) {
            alert("Error saving meal", e);
        }
    };

    if (loading) return <div>Loading meal schedule...</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Meal Plan</h2>
                <span className="text-xs text-red-500 font-bold uppercase">Locks daily at 10:00 PM</span>
            </div>
            <div className="space-y-3">
                {days.map((day, index) => (
                    <div key={day.dateString} className={`flex justify-between items-center p-3 border rounded-lg ${day.isLocked ? 'bg-gray-50 opacity-75' : ''}`}>
                        <div>
                            <span className="font-bold text-gray-700 block">{day.dateObject.toLocaleDateString(undefined, {weekday:'short'})}</span>
                            <span className="text-[10px] text-gray-400">{day.dateString}</span>
                        </div>
                        <div className="flex space-x-4">
                            {['breakfast', 'lunch', 'dinner'].map(m => (
                                <label key={m} className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] uppercase font-bold text-gray-400">{m[0]}</span>
                                    <input 
                                        type="checkbox" 
                                        className="checkbox checkbox-sm checkbox-primary" 
                                        checked={day[m]} 
                                        onChange={()=>handleCheck(index, m)} 
                                        disabled={day.isLocked} 
                                    />
                                </label>
                            ))}
                        </div>
                        <button 
                            onClick={()=>handleSave(index)} 
                            disabled={day.isLocked} 
                            className={`btn btn-xs ${day.isLocked ? 'btn-disabled' : 'btn-primary text-white'}`}
                        >
                            {day.isLocked ? "Locked" : "Update"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MealManager;