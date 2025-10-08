import React, { useState, useEffect } from 'react';
import { Users, Trash2, BarChart2, CheckCircle, X, Loader } from 'lucide-react';

// Assuming AdminNavbar exists at this path
import AdminNavbar from '../../navbar/adminNavbar'; 

// --- Dummy Data (Replace with API calls) ---
const initialUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Learner', registered: '2023-01-15', sessions: 5, status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Instructor', registered: '2022-11-20', sessions: 12, status: 'Active' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Learner', registered: '2024-03-01', sessions: 1, status: 'Inactive' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Instructor', registered: '2023-07-10', sessions: 20, status: 'Active' },
];

const initialPosts = [
    { id: 101, author: 'Bob Smith', content: 'Looking for a Java tutor!', date: '2025-10-01', reports: 0, status: 'Live' },
    { id: 102, author: 'Scammer Bot', content: 'Click here for free crypto!', date: '2025-10-02', reports: 5, status: 'Reported' },
    { id: 103, author: 'Alice Johnson', content: 'Completed my first HTML session!', date: '2025-09-30', reports: 0, status: 'Live' },
];

// --- Static Theme Classes (Light Mode) ---
const themeBg = 'bg-gray-50 text-gray-900';
const primaryText = 'text-sky-600';
const subtleText = 'text-gray-600';
const buttonClass = (isActive) => isActive 
    ? `py-2 px-4 rounded-lg font-semibold bg-sky-600 text-white`
    : `py-2 px-4 rounded-lg font-medium hover:bg-gray-200 ${subtleText}`;


// --- Main Component ---
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('users'); // users, posts, demographics
    const [users, setUsers] = useState(initialUsers);
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);

    // --- Admin Actions ---

    const deletePost = (postId) => {
        setLoading(true);
        setTimeout(() => {
            setPosts(posts.filter(post => post.id !== postId));
            console.log(`Post ID ${postId} deleted.`);
            setLoading(false);
        }, 500); // Simulate API call
    };

    const blockUser = (userId) => {
        setLoading(true);
        setTimeout(() => {
            setUsers(users.map(user => 
                user.id === userId ? { ...user, status: 'Blocked' } : user
            ));
            console.log(`User ID ${userId} blocked.`);
            setLoading(false);
        }, 500); // Simulate API call
    };
    
    // --- Sub-Component: Users Table ---
    const UserManagement = () => (
        <div className={`shadow-xl rounded-xl p-6 bg-white border border-gray-200 overflow-x-auto`}>
            <h3 className="text-xl font-bold mb-6">Registered Users ({users.length})</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        {['Name', 'Email', 'Role', 'Status', 'Actions'].map(header => (
                            <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${subtleText}`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id} className={user.status === 'Blocked' ? 'opacity-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${user.role === 'Instructor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {user.status}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => blockUser(user.id)}
                                    disabled={user.status === 'Blocked' || loading}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                    {user.status === 'Blocked' ? 'Blocked' : 'Block'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <div className="text-center py-4"><Loader size={20} className="animate-spin inline mr-2" /> Processing...</div>}
        </div>
    );
    
    // --- Sub-Component: Posts Table ---
    const PostManagement = () => (
        <div className={`shadow-xl rounded-xl p-6 bg-white border border-gray-200 overflow-x-auto`}>
            <h3 className="text-xl font-bold mb-6">Community Posts ({posts.length})</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        {['Post ID', 'Author', 'Content Preview', 'Reports', 'Actions'].map(header => (
                            <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${subtleText}`}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {posts.map(post => (
                        <tr key={post.id} className={post.reports > 0 ? 'bg-red-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{post.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{post.author}</td>
                            <td className="px-6 py-4 max-w-xs truncate text-sm">{post.content}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-500">{post.reports}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => deletePost(post.id)}
                                    disabled={loading}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 size={16} className="inline mr-1" /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && <div className="text-center py-4"><Loader size={20} className="animate-spin inline mr-2" /> Processing...</div>}
        </div>
    );

    // --- Sub-Component: Demographics ---
    const DemographicsView = () => {
        const totalUsers = users.length;
        const instructors = users.filter(u => u.role === 'Instructor').length;
        const learners = totalUsers - instructors;
        const activeUsers = users.filter(u => u.status === 'Active').length;
        
        const dataCards = [
            { title: "Total Users", value: totalUsers, icon: <Users size={24} />, color: 'text-sky-500' },
            { title: "Active Users", value: activeUsers, icon: <CheckCircle size={24} />, color: 'text-green-500' },
            { title: "Reported Posts", value: posts.filter(p => p.reports > 0).length, icon: <X size={24} />, color: 'text-red-500' },
            { title: "Instructors", value: instructors, icon: <BarChart2 size={24} />, color: 'text-yellow-500' },
        ];
        
        return (
            <div>
                <h3 className="text-xl font-bold mb-6">User Demographics & Platform Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {dataCards.map((card, index) => (
                        <div key={index} className={`p-5 rounded-xl shadow-md bg-white border border-gray-200`}>
                            <div className="flex items-center justify-between">
                                <div className={`${card.color}`}>
                                    {card.icon}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium opacity-75">{card.title}</p>
                                    <p className="text-3xl font-bold mt-1">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className={`p-6 rounded-xl shadow-md bg-white border border-gray-200`}>
                    <h4 className="text-lg font-semibold mb-4 border-b pb-2">User Role Breakdown</h4>
                    <div className="flex justify-around items-center h-40">
                        {/* Simple Bar/Donut Chart Placeholder */}
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-green-500">{instructors}</p>
                            <p className="font-medium mt-1">Instructors</p>
                            <p className="text-xs opacity-75">({((instructors / totalUsers) * 100).toFixed(0)}%)</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-extrabold text-blue-500">{learners}</p>
                            <p className="font-medium mt-1">Learners</p>
                            <p className="text-xs opacity-75">({((learners / totalUsers) * 100).toFixed(0)}%)</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    // --- Main Render ---
    return (
        <div className={`min-h-screen ${themeBg} font-sans transition-colors duration-500`}>
            {/* Using the AdminNavbar */}
            <AdminNavbar /> 
            
            <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold flex items-center">
                        <BarChart2 size={30} className={`mr-3 ${primaryText}`} />
                        Admin Dashboard
                    </h1>
                    {/* <p className={`mt-2 ${subtleText}`}>Manage platform content, users, and view key metrics.</p> */}
                </header>

                {/* Navigation Tabs */}
                <div className={`mb-8 p-1 rounded-xl shadow-inner bg-gray-200 flex space-x-2`}>
                    <button 
                        onClick={() => setActiveTab('users')} 
                        className={buttonClass(activeTab === 'users')}
                    >
                        <Users size={18} className="inline mr-2" /> All Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('posts')} 
                        className={buttonClass(activeTab === 'posts')}
                    >
                        <Trash2 size={18} className="inline mr-2" /> Community Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab('demographics')} 
                        className={buttonClass(activeTab === 'demographics')}
                    >
                        <BarChart2 size={18} className="inline mr-2" /> Demographics
                    </button>
                </div>
                
                {/* Content Area */}
                <div>
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'posts' && <PostManagement />}
                    {activeTab === 'demographics' && <DemographicsView />}
                </div>

            </div>
        </div>
    );
}