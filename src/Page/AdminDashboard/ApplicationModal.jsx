import React, { useState } from 'react';
import SeatGrid from './SeatGrid';

const ApplicationModal = ({ app, onClose, occupiedSeats, onApprove, onReject }) => {
    const [seat, setSeat] = useState(null);
    const [mode, setMode] = useState('view');
    if (!app) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-black">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="bg-blue-900 p-6 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-bold">{app.studentName}</h2>
                    <button onClick={onClose} className="text-white font-bold text-xl">✕</button>
                </div>
                <div className="p-8 space-y-8 flex-1">
                    {mode === 'view' ? (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase border-b pb-2">Academic Info</h4>
                                <p><span className="font-bold">ID:</span> {app.studentId}</p>
                                <p><span className="font-bold">Dept:</span> {app.department}</p>
                                <p><span className="font-bold">CGPA:</span> {app.cgpa}</p>
                                <p><span className="font-bold text-blue-600">Mobile:</span> {app.mobile}</p>
                            </div>
                            
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase border-b pb-2">Address Details</h4>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold">Current Address</p>
                                    <p className="text-sm text-gray-800 mb-2">{app.currentAddress}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold">Permanent Address</p>
                                    <p className="text-sm text-gray-800">{app.permanentAddress}</p>
                                </div>
                            </div>

                            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Local Guardian</h4>
                                <p><span className="font-bold">{app.localGuardianName}</span> ({app.localGuardianRelation})</p>
                                <p className="text-sm">Mobile: {app.localGuardianMobile}</p>
                            </div>
                        </div>
                    ) : (
                        <SeatGrid occupiedSeats={occupiedSeats} selectedSeat={seat} onSelect={setSeat} />
                    )}
                </div>
                <div className="p-6 border-t flex justify-end gap-3">
                    {mode === 'view' ? (
                        <>
                            <button onClick={() => onReject(app.id)} className="btn btn-error btn-outline">Reject</button>
                            <button onClick={() => setMode('assign')} className="btn btn-primary">Approve & Assign Room</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setMode('view')} className="btn btn-ghost">Back</button>
                            <button onClick={() => onApprove(app.id, seat)} disabled={!seat} className="btn btn-success text-white">Confirm Allocation</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;