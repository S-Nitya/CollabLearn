import React, { useState } from 'react';
import { Users, Loader } from 'lucide-react';
import AdminNavbar from '../../navbar/adminNavbar'; 

// --- Dummy Data (Replace with API calls) ---
const initialUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Learner', registered: '2023-01-15', sessions: 5, status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Instructor', registered: '2022-11-20', sessions: 12, status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Learner', registered: '2024-03-01', sessions: 1, status: 'Inactive' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Instructor', registered: '2023-07-10', sessions: 20, status: 'Active' },
    { id: 5, name: 'Eve Torres', email: 'eve@example.com', role: 'Learner', registered: '2024-05-15', sessions: 0, status: 'Active' },
];

// --- Static Theme Classes (Light Mode) ---
const themeBg = 'bg-gray-50 text-gray-900';
const subtleText = 'text-gray-600';
const primaryText = 'text-indigo-600';


// --- Main Component: Manage Users Page ---
export default function ManageUsers() {
    const [users, setUsers] = useState(initialUsers);
    const [loading, setLoading] = useState(false);

    // --- Admin Actions ---
    const blockUser = (userId) => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setUsers(users.map(user => 
                user.id === userId ? { ...user, status: 'Blocked' } : user
            ));
            console.log(`User ID ${userId} blocked.`);
            setLoading(false);
        }, 500); 
    };

    const unblockUser = (userId) => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setUsers(users.map(user => 
                user.id === userId ? { ...user, status: 'Active' } : user
            ));
            console.log(`User ID ${userId} unblocked.`);
            setLoading(false);
        }, 500); 
    };

    // --- Render ---
    return (
        <div className={`min-h-screen ${themeBg} font-sans transition-colors duration-500`}>
            <AdminNavbar /> 
            
            <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold flex items-center">
                        <Users size={30} className={`mr-3 ${primaryText}`} />
                        User Management
                    </h1>
                    {/* <p className={`mt-2 ${subtleText}`}>Review and manage all registered users on the platform.</p> */}
                </header>

                <div className={`shadow-xl rounded-xl p-6 bg-white border border-gray-200 overflow-x-auto`}>
                    <h3 className="text-xl font-bold mb-6">Registered Users ({users.length})</h3>
                    
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {['Name', 'Email', 'Role', 'Registered', 'Status', 'Actions'].map(header => (
                                    <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${subtleText}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id} className={user.status === 'Blocked' ? 'bg-red-50 opacity-70' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${user.role === 'Instructor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.registered}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`font-semibold ${user.status === 'Blocked' ? 'text-red-600' : 'text-green-600'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {user.status === 'Blocked' ? (
                                            <button
                                                onClick={() => unblockUser(user.id)}
                                                disabled={loading}
                                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                            >
                                                Unblock
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => blockUser(user.id)}
                                                disabled={loading}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                Block
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {loading && (
                        <div className="text-center py-4 text-indigo-600 font-medium">
                            <Loader size={20} className="animate-spin inline mr-2" /> Processing request...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}