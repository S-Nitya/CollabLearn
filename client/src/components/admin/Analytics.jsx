import React, { useState } from 'react';
import { Users, BarChart2, CheckCircle, X, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';
import AdminNavbar from '../../navbar/adminNavbar'; 

// --- DUMMY DATA FOR CHARTING ---
// Simulate monthly data for registered users and active users
const monthlyData = [
    { month: 'Jan', registered: 10, active: 8 },
    { month: 'Feb', registered: 15, active: 10 },
    { month: 'Mar', registered: 25, active: 18 },
    { month: 'Apr', registered: 40, active: 30 },
    { month: 'May', registered: 60, active: 45 },
    { month: 'Jun', registered: 85, active: 70 },
];

const totalUsers = 120; // Assume a total user count for the breakdown
const instructors = 30;
const learners = totalUsers - instructors;
const reportedPostsCount = 18;
const activeUsersCount = 95;

// --- Static Theme Classes (Light Mode) ---
const themeBg = 'bg-gray-50 text-gray-900';
const subtleText = 'text-gray-600';
const primaryText = 'text-sky-600';

// --- Utility Functions ---
const calculateChange = (data) => {
    if (data.length < 2) return { change: 0, icon: <TrendingUp size={20} className="text-gray-500" /> };
    
    const latest = data[data.length - 1].registered;
    const previous = data[data.length - 2].registered;
    const percentage = ((latest - previous) / previous) * 100;

    if (percentage > 0) {
        return { change: percentage.toFixed(1), icon: <TrendingUp size={20} className="text-green-600" />, color: 'text-green-600' };
    } else if (percentage < 0) {
        return { change: percentage.toFixed(1), icon: <TrendingDown size={20} className="text-red-600" />, color: 'text-red-600' };
    }
    return { change: 0, icon: <TrendingUp size={20} className="text-gray-500" />, color: 'text-gray-500' };
};

const userGrowthChange = calculateChange(monthlyData);

// --- Sub-Component: Simple Bar Chart for Monthly Activity ---
const MonthlyUserChart = ({ data }) => {
    // Find max value for scaling the bars
    const maxVal = Math.max(...data.map(d => d.registered));
    
    return (
        <div className="h-64 pt-6">
            <h4 className="text-lg font-semibold mb-4 border-b pb-2">Monthly Registered Users vs. Active Users</h4>
            <div className="flex justify-between items-end h-48 space-x-2">
                {data.map((d, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
                        <div className="text-xs text-gray-500 mb-1">{d.registered}</div>
                        {/* Registered Bar (sky colors) */}
                        <div 
                            className="w-full bg-sky-300 rounded-t-lg transition-all duration-700 hover:bg-sky-400 relative" 
                            style={{ height: `${(d.registered / maxVal) * 80 + 10}%` }} // Scale to 80% of container height + 10% base
                        >
                            {/* Active Bar (sky) */}
                            <div 
                                className="absolute bottom-0 w-full bg-sky-600 rounded-t-lg" 
                                style={{ height: `${(d.active / d.registered) * 100}%` }}
                                title={`Active: ${d.active}`}
                            />
                        </div>
                        <span className="text-sm font-medium mt-1">{d.month}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4 space-x-6 text-sm py-5">
                <div className="flex items-center"><span className="w-3 h-3 bg-sky-300 mr-2 border"></span>Registered</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-sky-600 mr-2"></span>Active</div>
            </div>
        </div>
    );
}

// --- Main Component: Analytics Dashboard Page ---
export default function AnalyticsDashboard() {
    
    const dataCards = [
        { 
            title: "Total Users", 
            value: totalUsers, 
            icon: <Users size={24} />, 
            color: 'text-sky-600', 
            footer: `${userGrowthChange.change}% vs. last month`,
            footerColor: userGrowthChange.color,
            footerIcon: userGrowthChange.icon
        },
        { 
            title: "Active Users (Current)", 
            value: activeUsersCount, 
            icon: <CheckCircle size={24} />, 
            color: 'text-green-600',
            footer: `${(activeUsersCount / totalUsers * 100).toFixed(0)}% of total`,
            footerColor: 'text-gray-500',
            footerIcon: <span className="w-4"></span>
        },
        { 
            title: "Reported Posts", 
            value: reportedPostsCount, 
            icon: <MessageSquare size={24} />, 
            color: 'text-red-600',
            footer: `Requires moderation`,
            footerColor: 'text-red-600',
            footerIcon: <X size={20} />
        },
        { 
            title: "Total Instructors", 
            value: instructors, 
            icon: <BarChart2 size={24} />, 
            color: 'text-yellow-600',
            footer: `${(instructors / totalUsers * 100).toFixed(0)}% of users are Instructors`,
            footerColor: 'text-gray-500',
            footerIcon: <span className="w-4"></span>
        },
    ];
    
    const instructorPercent = (instructors / totalUsers * 100).toFixed(0);
    const learnerPercent = (learners / totalUsers * 100).toFixed(0);

    // --- Render ---
    return (
        <div className={`min-h-screen ${themeBg} font-sans transition-colors duration-500`}>
            <AdminNavbar /> 
            
            <div className="pt-24 max-w-7xl mx-auto px-6 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold flex items-center">
                        <BarChart2 size={30} className={`mr-3 ${primaryText}`} />
                        Platform Analytics & User Growth
                    </h1>
                    {/* <p className={`mt-2 ${subtleText}`}>Key performance indicators and detailed charts on user activity and platform health.</p> */}
                </header>

                {/* KPI Cards (Improved with Footer/Change Indicator) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {dataCards.map((card, index) => (
                        <div 
                            key={index} 
                            className={`p-6 rounded-xl shadow-lg bg-white border border-gray-200 transition-all flex flex-col justify-between`}
                        >
                            {/* Card Header & Value */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-grow">
                                    <p className={`text-lg font-medium ${subtleText}`}>{card.title}</p>
                                    <p className="text-4xl font-extrabold mt-1">{card.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${card.color} bg-gray-100`}>
                                    {card.icon}
                                </div>
                            </div>
                            
                            {/* Card Footer/Trend */}
                            <div className={`flex items-center text-sm font-semibold pt-3 border-t border-gray-100 ${card.footerColor}`}>
                                {card.footerIcon}
                                <span className="ml-1">{card.footer}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* --- CHARTING SECTION --- */}
                <div className={`p-8 rounded-xl shadow-lg bg-white border border-gray-200 mb-12`}>
                    <MonthlyUserChart data={monthlyData} />
                </div>


                {/* User Role Breakdown Section (Simplified Visual) */}
                <div className={`p-8 rounded-xl shadow-lg bg-white border border-gray-200`}>
                    <h3 className="text-2xl font-bold mb-6 border-b pb-3">User Role Distribution</h3>
                    
                    <div className="flex flex-col lg:flex-row items-center justify-around h-64">
                        
                        {/* Instructor Card */}
                        <div className="text-center p-4 border border-green-200 rounded-lg w-full lg:w-1/3 hover:shadow-md transition-shadow">
                            <p className="text-sm uppercase font-semibold text-green-600">Instructors</p>
                            <p className="text-6xl font-extrabold text-green-500 my-3">{instructors}</p>
                            <p className="text-lg font-medium opacity-80">({instructorPercent}% of total)</p>
                        </div>

                        {/* Separator / Visual */}
                        <div className="flex-shrink-0 mx-8 hidden lg:block">
                            <Users size={48} className="text-gray-400" />
                        </div>
                        <div className="w-full lg:hidden border-b border-gray-200 my-4"></div>

                        {/* Learner Card */}
                        <div className="text-center p-4 border border-blue-200 rounded-lg w-full lg:w-1/3 hover:shadow-md transition-shadow">
                            <p className="text-sm uppercase font-semibold text-blue-600">Learners</p>
                            <p className="text-6xl font-extrabold text-blue-500 my-3">{learners}</p>
                            <p className="text-lg font-medium opacity-80">({learnerPercent}% of total)</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}