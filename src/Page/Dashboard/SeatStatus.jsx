import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const SeatStatus = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState({ state: 'loading', seatNumber: null });

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "applications"), where("studentEmail", "==", user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setStatus({ state: data.status, seatNumber: data.seatNumber || null });
            } else {
                setStatus({ state: 'none', seatNumber: null });
            }
        });
        return () => unsubscribe();
    }, [user]);

    if (status.state === 'loading') return <div className="animate-pulse h-40 bg-gray-200 rounded-xl"></div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
            {status.state === 'none' && (
                <>
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">🪑</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Seat Assigned</h3>
                    <button onClick={() => navigate('/hallSeatApplication')} className="btn btn-primary px-8 rounded-full shadow-lg">Apply Now</button>
                </>
            )}
            {status.state === 'pending' && (
                <>
                    <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-4 text-2xl">⏳</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pending Review</h3>
                    <p className="text-gray-500 text-sm">Admin is reviewing your application.</p>
                </>
            )}
            {status.state === 'approved' && (
                <>
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 text-3xl">✅</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Room {status.seatNumber}</h3>
                    <p className="text-green-600 font-bold">Allocated</p>
                </>
            )}
        </div>
    );
};

export default SeatStatus;