import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { db } from '../../firebase/firebase.config';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';

const Complaints = () => {
    const { user } = useContext(AuthContext);
    const [complaintText, setComplaintText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [myComplaints, setMyComplaints] = useState([]);

    const IMGBB_API_KEY = "8da19b39cddb6533a5480c96521a12b2";

    useEffect(() => {
        if(!user) return;
        const q = query(collection(db, "complaints"), where("studentEmail", "==", user.email));
        const unsub = onSnapshot(q, snap => setMyComplaints(snap.docs.map(d => ({id:d.id, ...d.data()}))));
        return () => unsub();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!complaintText.trim()) return;
        setUploading(true);
        let imageUrl = "";

        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
                const data = await response.json();
                if (data.success) imageUrl = data.data.url;
            } catch (err) { alert("Image upload failed", err); }
        }

        try {
            await addDoc(collection(db, "complaints"), {
                text: complaintText, image: imageUrl, studentEmail: user.email,
                date: new Date().toLocaleDateString(), status: 'open', timestamp: new Date()
            });
            setComplaintText(""); setSelectedFile(null); alert("Submitted!");
        } catch (error) { console.error(error); } finally { setUploading(false); }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-black">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-2">File a Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea className="textarea textarea-bordered w-full h-32 bg-gray-50 focus:bg-white" placeholder="Describe issue..." value={complaintText} onChange={(e) => setComplaintText(e.target.value)} required></textarea>
                    <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="file-input file-input-bordered file-input-sm w-full text-white" />
                    <button disabled={uploading} className="btn btn-error w-full text-white">{uploading ? "Uploading..." : "Submit"}</button>
                </form>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">History</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {myComplaints.map(item => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">{item.date}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.status==='open'?'text-red-600 bg-red-100':'text-green-600 bg-green-100'}`}>{item.status}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{item.text}</p>
                            {item.image && <img src={item.image} alt="Proof" className="w-full h-32 object-cover rounded-lg border" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Complaints;