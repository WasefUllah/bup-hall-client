import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../firebase/firebase.config';
import { doc, getDoc, setDoc, collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { AuthContext } from '../../providers/AuthProvider';

const MealManager = () => {
    const { user } = useContext(AuthContext);
    const [hasSeat, setHasSeat] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Meal State
    const [tomorrowData, setTomorrowData] = useState({ breakfast: false, lunch: false, dinner: false });
    const [history, setHistory] = useState([]);
    const [isLocked, setIsLocked] = useState(false);

    // Dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    useEffect(() => {
        const init = async () => {
            if (!user) return;

            // 1. Check if user has an APPROVED SEAT
            // We check the 'applications' collection
            const q = query(
                collection(db, "applications"), 
                where("studentEmail", "==", user.email),
                where("status", "==", "approved")
            );
            const appSnap = await getDocs(q);
            
            if (appSnap.empty) {
                setHasSeat(false);
                setLoading(false);
                return; // Stop here if no seat
            }
            setHasSeat(true);

            // 2. Check 10 PM Lock
            const currentHour = new Date().getHours();
            if (currentHour >= 22) { // 22 = 10 PM
                setIsLocked(true);
            }

            // 3. Fetch Tomorrow's Order (if exists)
            const docRef = doc(db, "meals", `${tomorrowStr}_${user.email}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setTomorrowData(docSnap.data());
            }

            // 4. Fetch History (Last 5 days)
            const historyQ = query(
                collection(db, "meals"),
                where("studentEmail", "==", user.email),
                where("date", "<", tomorrowStr), // Past dates
                orderBy("date", "desc"),
                limit(5)
            );
            const historySnap = await getDocs(historyQ);
            setHistory(historySnap.docs.map(d => d.data()));
            
            setLoading(false);
        };

        init();
    }, [user, tomorrowStr]);

    const handleToggle = (meal) => {
        if (isLocked) return;
        setTomorrowData(prev => ({ ...prev, [meal]: !prev[meal] }));
    };

    const handleSave = async () => {
        if (isLocked) return alert("It is past 10 PM. Ordering is closed.");
        
        try {
            await setDoc(doc(db, "meals", `${tomorrowStr}_${user.email}`), {
                ...tomorrowData,
                studentEmail: user.email,
                date: tomorrowStr,
                timestamp: new Date()
            });
            alert("Meal order for tomorrow updated!");
        } catch (error) {
            console.error(error);
            alert("Failed to save.");
        }
    };

    // Calculation
    const calculateCost = (b, l, d) => (b ? 5 : 0) + (l ? 10 : 0) + (d ? 10 : 0);
    const totalCost = calculateCost(tomorrowData.breakfast, tomorrowData.lunch, tomorrowData.dinner);

    if (loading) return <div className="p-4 text-center">Checking seat allocation...</div>;

    if (!hasSeat) {
        return (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
                <p className="text-gray-600">You can only order meals after you have been allocated a seat in the hall.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ORDER CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Order for Tomorrow</h2>
                        <p className="text-sm text-gray-500">{tomorrow.toDateString()}</p>
                    </div>
                    {isLocked ? (
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Locked (Past 10 PM)</span>
                    ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Open</span>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Breakfast */}
                    <div 
                        onClick={() => handleToggle('breakfast')}
                        className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${tomorrowData.breakfast ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                        <span className="block text-2xl mb-1">🍳</span>
                        <span className="font-bold text-gray-700">Breakfast</span>
                        <span className="block text-xs text-gray-400">৳ 5.00</span>
                    </div>

                    {/* Lunch */}
                    <div 
                        onClick={() => handleToggle('lunch')}
                        className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${tomorrowData.lunch ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                        <span className="block text-2xl mb-1">🍚</span>
                        <span className="font-bold text-gray-700">Lunch</span>
                        <span className="block text-xs text-gray-400">৳ 10.00</span>
                    </div>

                    {/* Dinner */}
                    <div 
                        onClick={() => handleToggle('dinner')}
                        className={`cursor-pointer border-2 rounded-xl p-4 text-center transition-all ${tomorrowData.dinner ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
                    >
                        <span className="block text-2xl mb-1">🍗</span>
                        <span className="font-bold text-gray-700">Dinner</span>
                        <span className="block text-xs text-gray-400">৳ 10.00</span>
                    </div>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Total Payable</p>
                        <p className="text-2xl font-bold text-blue-600">৳ {totalCost}</p>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={isLocked}
                        className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'}`}
                    >
                        {isLocked ? "Time Over" : "Confirm Order"}
                    </button>
                </div>
            </div>

            {/* HISTORY CARD */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Recent History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-50">
                            <tr>
                                <th className="p-3 rounded-l-lg">Date</th>
                                <th className="p-3">Summary</th>
                                <th className="p-3 rounded-r-lg text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((day, idx) => (
                                <tr key={idx} className="border-b border-gray-50 last:border-0">
                                    <td className="p-3 font-medium text-gray-700">{day.date}</td>
                                    <td className="p-3">
                                        {day.breakfast && <span className="mr-2">🍳</span>}
                                        {day.lunch && <span className="mr-2">🍚</span>}
                                        {day.dinner && <span className="mr-2">🍗</span>}
                                        {!day.breakfast && !day.lunch && !day.dinner && <span className="text-gray-400">Skipped</span>}
                                    </td>
                                    <td className="p-3 text-right font-bold text-gray-600">
                                        ৳ {calculateCost(day.breakfast, day.lunch, day.dinner)}
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-400">No previous records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MealManager;