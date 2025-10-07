import React, { useState } from 'react';
import { Clock, Calendar, X } from 'lucide-react';

// Using the same styling principles (colors, fonts, shadow) as your existing components.

// --- Booking Modal Component (Included within the page for encapsulation) ---
const BookingModal = ({ skillTitle, instructorName, onClose, onConfirm }) => {
    // State for form inputs
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('60'); // Default to 60 minutes
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!date || !time || !duration) {
            setError('Please select a Date, Time, and Duration.');
            return;
        }

        // Basic date validation
        const sessionDateTime = new Date(`${date}T${time}`);
        if (isNaN(sessionDateTime) || sessionDateTime < new Date()) {
            setError('Please select a valid time that is in the future.');
            return;
        }

        const sessionDetails = {
            skillTitle,
            instructorName,
            date,
            time,
            duration: parseInt(duration),
            notes,
        };

        onConfirm(sessionDetails);
    };

    return (
        // Modal Overlay (Full screen with backdrop blur/darken)
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50" style={{ backdropFilter: 'blur(4px)', background: 'rgba(0, 0, 0, 0.4)' }}>
            
            {/* Modal Content Box */}
            <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 animate-fadeInUp shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Book Session: {skillTitle}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <p className="text-md text-gray-700 mb-4">Instructor: <span className="font-semibold text-indigo-600">{instructorName}</span></p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Date and Time Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="date"
                                    id="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Time <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="time"
                                    id="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Duration Field */}
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all cursor-pointer"
                            required
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">1 hour (60 minutes)</option>
                            <option value="90">1.5 hours (90 minutes)</option>
                            <option value="120">2 hours (120 minutes)</option>
                        </select>
                    </div>

                    {/* Notes Field */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Specific Topics / Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            rows="3"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y transition-all"
                            placeholder="Specify areas you want to cover or any prerequisites you've completed."
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 mt-6"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};
// --- End Booking Modal Component ---

export default function BookingSessionPage() {
    // We simulate receiving the skill details from the page that links here (e.g., from query params or context)
    // For this example, we hardcode a default session
    const [skillDetails] = useState({
        title: 'Master JavaScript Fundamentals',
        instructor: 'Sarah Chen'
    });
    
    // State to control whether the modal is shown
    // It's set to true by default to show the booking page immediately upon load
    const [isModalVisible, setIsModalVisible] = useState(true);

    const handleBookingConfirm = (sessionDetails) => {
        console.log('BOOKING CONFIRMED:', sessionDetails);
        alert(`Success! Session with ${sessionDetails.instructorName} booked for ${sessionDetails.date} at ${sessionDetails.time}. Redirecting...`);
        
        // In a real app, you would redirect the user to a confirmation or dashboard page here.
        // For now, we'll just close the modal and show a placeholder message.
        setIsModalVisible(false);
    };

    // Placeholder UI for the rest of the page (in case the modal is closed or not used immediately)
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
            {/* Minimal Styling for Animations */}
            <style>{`
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
            `}</style>
            
            <div className="text-center p-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Session Booking Portal</h1>
                <p className="text-lg text-gray-600">
                    Your session request is being processed.
                    {isModalVisible ? (
                        <span className="text-indigo-600 font-semibold ml-1">Please fill out the details.</span>
                    ) : (
                        <span className="text-green-600 font-semibold ml-1">Redirecting to confirmation page.</span>
                    )}
                </p>
                
                {!isModalVisible && (
                    <div className="mt-8 p-6 bg-white rounded-xl shadow-md border-t-4 border-indigo-600 max-w-lg mx-auto">
                        <p className="text-gray-700 font-medium">Session with **{skillDetails.instructor}** confirmed!</p>
                        <p className="text-sm text-gray-500 mt-2">In a production application, you would now be redirected to your calendar view.</p>
                        <button 
                            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            onClick={() => window.history.back()}
                        >
                            Go Back to Skills
                        </button>
                    </div>
                )}
            </div>

            {/* The Booking Modal */}
            {isModalVisible && (
                <BookingModal
                    skillTitle={skillDetails.title}
                    instructorName={skillDetails.instructor}
                    onClose={() => setIsModalVisible(false)} // Allows user to close without booking
                    onConfirm={handleBookingConfirm}
                />
            )}
        </div>
    );
}