import React, { useState } from 'react';
import { Trash2, Loader, MessageSquare } from 'lucide-react';
import AdminNavbar from '../../navbar/adminNavbar'; 

// --- Dummy Data (Replace with API calls) ---
const initialPosts = [
    { id: 101, author: 'Bob Smith', content: 'Looking for a Java tutor! Anyone available next week?', date: '2025-10-01', reports: 0, status: 'Live' },
    { id: 102, author: 'Scammer Bot', content: 'Click here for free crypto and double your money instantly! (Highly reported)', date: '2025-10-02', reports: 5, status: 'Reported' },
    { id: 103, author: 'Alice Johnson', content: 'Completed my first HTML session! Feeling great about learning web development.', date: '2025-09-30', reports: 0, status: 'Live' },
    { id: 104, author: 'Malicious User', content: 'Hate speech content targeting a specific group.', date: '2025-10-03', reports: 15, status: 'Reported' },
    { id: 105, author: 'Tutor Max', content: 'Offering help with advanced calculus and linear algebra. DM for details.', date: '2025-10-04', reports: 0, status: 'Live' },
];

// --- Static Theme Classes (Light Mode) ---
const themeBg = 'bg-gray-100 text-gray-900';
const subtleText = 'text-gray-600';
const primaryText = 'text-indigo-600';


// --- Main Component: Manage Posts Page ---
export default function ManagePosts() {
    const [posts, setPosts] = useState(initialPosts);
    const [loading, setLoading] = useState(false);

    // --- Admin Actions ---

    const deletePost = (postId) => {
        setLoading(true);
        console.log(`Attempting to delete Post ID: ${postId}`);
        // Simulate API call delay
        setTimeout(() => {
            setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
            setLoading(false);
        }, 600); 
    };

    // --- Render ---
    return (
        <div className={`min-h-screen ${themeBg} font-sans transition-colors duration-500`}>
            <AdminNavbar /> 
            
            <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold flex items-center">
                        <MessageSquare size={30} className={`mr-3 ${primaryText}`} />
                        Post Management
                    </h1>
                    {/* <p className={`mt-2 ${subtleText}`}>Review, filter, and moderate community posts, especially those that have been reported.</p> */}
                </header>

                <div className={`shadow-xl rounded-xl p-6 bg-white border border-gray-200 overflow-x-auto`}>
                    <h3 className="text-xl font-bold mb-6">Community Posts ({posts.length})</h3>
                    
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {['ID', 'Author', 'Content Preview', 'Reports', 'Date', 'Actions'].map(header => (
                                    <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${subtleText}`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {posts.map(post => (
                                <tr 
                                    key={post.id} 
                                    // Highlight rows with reports
                                    className={post.reports > 0 ? 'bg-red-50 hover:bg-red-100 transition-colors' : 'hover:bg-gray-100 transition-colors'}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{post.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{post.author}</td>
                                    <td className="px-6 py-4 max-w-xs truncate text-sm">
                                        {post.content}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                        <span className={post.reports > 0 ? 'text-red-600' : 'text-gray-500'}>
                                            {post.reports}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            disabled={loading}
                                            className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-1"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {loading && (
                        <div className="text-center py-4 text-sky-600 font-medium">
                            <Loader size={20} className="animate-spin inline mr-2" /> Deleting post...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}