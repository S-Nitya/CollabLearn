import React, { useState, useEffect } from 'react';
import { Users, Loader } from 'lucide-react';
import AdminNavbar from '../../navbar/adminNavbar'; // Corrected import path

// --- Static Theme Classes (Light Mode) ---
const themeBg = 'bg-gray-100 text-gray-900';
const subtleText = 'text-gray-600';
const primaryText = 'text-indigo-600';

// --- Main Component: Manage Users Page ---
export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Tracks which user's action is loading

    // Fetches all users from the backend when the component mounts.
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.success) {
                    setUsers(result.data);
                } else {
                    console.error("Failed to fetch users:", result.message);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // --- Admin Actions ---
    const blockUser = async (userId) => {
        setActionLoading(userId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/block`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                // Update state locally for instant UI feedback
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, status: 'Blocked' } : user
                ));
            } else {
                console.error("Failed to block user:", result.message);
            }
        } catch (error) {
            console.error("Error blocking user:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const unblockUser = async (userId) => {
        setActionLoading(userId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/unblock`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                // Update state locally for instant UI feedback
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, status: 'Active' } : user
                ));
            } else {
                console.error("Failed to unblock user:", result.message);
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
        } finally {
            setActionLoading(null);
        }
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
                </header>

                <div className={`shadow-xl rounded-xl p-6 bg-white border border-gray-200 overflow-x-auto`}>
                    <h3 className="text-xl font-bold mb-6">Registered Users ({users.length})</h3>
                    
                    {loading ? (
                         <div className="text-center py-10">
                            <Loader size={32} className="animate-spin inline text-indigo-600" />
                            <p className="mt-2">Loading users...</p>
                         </div>
                    ) : (
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.registered).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${user.status === 'Blocked' ? 'text-red-600' : 'text-green-600'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user.status === 'Blocked' ? (
                                                <button
                                                    onClick={() => unblockUser(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                                >
                                                    {actionLoading === user.id ? '...' : 'Unblock'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => blockUser(user.id)}
                                                    disabled={actionLoading === user.id}
                                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                >
                                                    {actionLoading === user.id ? '...' : 'Block'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

