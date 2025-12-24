import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

const Notices = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "notices"), orderBy("date", "desc"));
        const unsub = onSnapshot(q, snap => setNotices(snap.docs.map(d => ({id:d.id, ...d.data()}))));
        return () => unsub();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full text-black">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notices</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {notices.map(n => (
                    <div key={n.id} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-xs text-gray-400">{n.date}</p>
                        <h4 className="font-bold">{n.title}</h4>
                        <p className="text-sm text-gray-600">{n.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notices;