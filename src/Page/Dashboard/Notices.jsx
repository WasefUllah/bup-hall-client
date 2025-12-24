import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // Query notices, ordered by newest first
        const q = query(collection(db, "notices"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNotices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    // Helper to safely find the image/pdf link
    const getAttachment = (notice) => {
        if (notice.attachmentUrl) return { url: notice.attachmentUrl, type: notice.attachmentType };
        // Fallback for older notices
        if (notice.imageUrl) return { url: notice.imageUrl, type: 'image' };
        if (notice.pdfLink) return { url: notice.pdfLink, type: 'pdf' };
        return { url: null, type: 'none' };
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full text-black">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notice Board</h2>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notices.map(notice => {
                    const { url, type } = getAttachment(notice);
                    
                    return (
                        <div key={notice.id} className="relative pl-6 border-l-2 border-blue-500 pb-6 last:pb-0">
                            {/* Blue Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-50 border-2 border-blue-500"></div>
                            
                            {/* Date & Title */}
                            <div className="text-xs text-gray-400 mb-1">{notice.date}</div>
                            <h4 className="text-md font-bold text-gray-800 mb-2">{notice.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg mb-3">
                                {notice.content}
                            </p>
                            
                            {/* --- THIS IS THE PART THAT WAS MISSING --- */}
                            {url && (
                                <div className="mt-2 animate-fade-in">
                                    {type === 'image' ? (
                                        <button 
                                            onClick={() => setSelectedImage(url)}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                                        >
                                            📷 View Photo
                                        </button>
                                    ) : (
                                        <a 
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors border border-red-100 w-fit"
                                        >
                                            📄 Open Attachment
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {notices.length === 0 && <p className="text-center text-gray-400 py-10">No notices found.</p>}
            </div>

            {/* POPUP MODAL FOR VIEWING PHOTOS */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl max-h-screen">
                        <img 
                            src={selectedImage} 
                            alt="Notice Attachment" 
                            className="max-w-full max-h-[90vh] rounded shadow-2xl object-contain" 
                        />
                        <button 
                            className="absolute -top-10 right-0 text-white font-bold uppercase tracking-widest text-sm hover:text-gray-300"
                            onClick={() => setSelectedImage(null)}
                        >
                            Close ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;