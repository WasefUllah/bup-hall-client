import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const SeatStatus = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState({ state: 'loading', seatNumber: null, id: null });
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "applications"), where("studentEmail", "==", user.email));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setStatus({ 
                    state: data.status, 
                    seatNumber: data.seatNumber || null,
                    id: snapshot.docs[0].id
                });
            } else {
                setStatus({ state: 'none', seatNumber: null, id: null });
            }
        });
        return () => unsubscribe();
    }, [user]);

    const handleCancelRequest = async (e) => {
        e.preventDefault();
        if(!cancelReason) return alert("Please provide a reason.");

        try {
            await updateDoc(doc(db, "applications", status.id), {
                status: "cancellation_requested",
                cancellationReason: cancelReason,
                cancellationDate: new Date().toLocaleDateString()
            });
            setShowCancelModal(false);
            alert("Cancellation request submitted.");
        } catch (err) {
            console.error(err);
            alert("Failed to submit request.");
        }
    };

    if (status.state === 'loading') return <div className="animate-pulse h-40 bg-gray-200 rounded-xl"></div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center relative">
            
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Application Pending</h3>
                    <p className="text-gray-500 text-sm">Admin is reviewing your application.</p>
                </>
            )}

            {status.state === 'approved' && (
                <>
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 text-3xl">✅</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">Room {status.seatNumber}</h3>
                    <p className="text-green-600 font-bold mb-6">Allocated</p>
                    
                    <button 
                        onClick={() => setShowCancelModal(true)}
                        className="text-red-500 text-xs font-bold hover:text-red-700 underline"
                    >
                        Request Seat Cancellation
                    </button>
                </>
            )}

            {status.state === 'cancellation_requested' && (
                <>
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl">🚫</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Leaving Pending</h3>
                    <p className="text-gray-500 text-sm mb-4">You have requested to leave seat <b>{status.seatNumber}</b>.</p>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Processing</span>
                </>
            )}

            {/* MODAL */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Cancel Seat Allocation?</h3>
                        <p className="text-sm text-gray-500 mb-4">Please tell us why you are leaving the hall.</p>
                        
                        <form onSubmit={handleCancelRequest}>
                            <textarea 
                                className="textarea textarea-bordered w-full h-24 mb-4" 
                                placeholder="Reason (e.g. Graduated, Moving out...)"
                                value={cancelReason}
                                onChange={(e)=>setCancelReason(e.target.value)}
                                required
                            ></textarea>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setShowCancelModal(false)} className="btn btn-sm btn-ghost">Back</button>
                                <button type="submit" className="btn btn-sm btn-error text-white">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatStatus;