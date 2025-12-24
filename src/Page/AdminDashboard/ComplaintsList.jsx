import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';

const ComplaintsList = () => {
    const [complaints, setComplaints] = useState([]);
    useEffect(() => {
        const q = query(collection(db, "complaints"), orderBy("date", "desc"));
        const unsub = onSnapshot(q, snap => setComplaints(snap.docs.map(d => ({id:d.id, ...d.data()}))));
        return () => unsub();
    }, []);

    const handleResolve = async (id) => {
        await updateDoc(doc(db, "complaints", id), { status: "resolved" });
    };

    return (
        <div className="space-y-4">
            {complaints.map(c => (
                <div key={c.id} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
                    {c.image && (
                        <div className="w-full md:w-48 h-32 flex-shrink-0">
                            <a href={c.image} target="_blank" rel="noreferrer">
                                <img src={c.image} alt="Evidence" className="w-full h-full object-cover rounded-lg border hover:opacity-90 cursor-zoom-in" />
                            </a>
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-gray-800">{c.studentEmail}</h4>
                                <span className="text-xs text-gray-500">{c.date}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${c.status==='open'?'bg-red-100 text-red-600':'bg-green-100 text-green-600'}`}>
                                {c.status}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm">{c.text}</p>
                        {c.status === 'open' && (
                            <button onClick={() => handleResolve(c.id)} className="mt-3 btn btn-xs btn-outline btn-success">
                                Mark as Resolved
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {complaints.length === 0 && <p className="text-center text-gray-400 py-10">No complaints found.</p>}
        </div>
    );
};

export default ComplaintsList;