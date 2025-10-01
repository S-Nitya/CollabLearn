import React from 'react';
import CollabLearnLogo from '../assets/Collablearn Logo.png'; 

const DashboardNavbar = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
      
      {/* Left Side: Logo */}
      <div className="flex items-center text-xl font-bold text-indigo-600 w-1/4">
        <img 
          src={CollabLearnLogo}
          alt="CollabLearn Logo" 
          className="h-8 w-8 rounded-full mr-2 object-cover"
        />
        CollabLearn
      </div>
      
      {/* Center: Centered Navigation Tabs */}
      {/* flex-1 allows this section to take up the remaining space, and justify-center centers the content */}
      <div className="flex-1 flex justify-center">
        <nav className="hidden lg:flex space-x-8 text-gray-600">
          <a href="#" className="font-semibold text-lg px-3 py-1 rounded-md hover:bg-gray-100 hover:text-indigo-700 transition duration-150 transform hover:scale-105">
            Dashboard
          </a>
          <a href="#" className="font-semibold text-lg px-3 py-1 rounded-md hover:bg-gray-100 hover:text-indigo-700 transition duration-150 transform hover:scale-105">
            Browse Skills
          </a>
          <a href="#" className="font-semibold text-lg px-3 py-1 rounded-md hover:bg-gray-100 hover:text-indigo-700 transition duration-150 transform hover:scale-105">
            Calendar
          </a>
          <a href="#" className="font-semibold text-lg px-3 py-1 rounded-md hover:bg-gray-100 hover:text-indigo-700 transition duration-150 transform hover:scale-105">
            Messages
          </a>
          <a href="#" className="font-semibold text-lg px-3 py-1 rounded-md hover:bg-gray-100 hover:text-indigo-700 transition duration-150 transform hover:scale-105">
            Community
          </a>
          <a href="#" className="font-semibold text-lg px-3 py-1 rounded-md hover:bg-gray-100 hover:text-indigo-700 transition duration-150 transform hover:scale-105">
            Achievements
          </a>
        </nav>
      </div>

      {/* Right Side: Notifications & User */}
      <div className="flex items-center space-x-4 w-1/4 justify-end">
        <div className="relative">
          <span className="material-icons-outlined text-gray-500 text-2xl cursor-pointer">&#128276;</span> {/* Notification icon */}
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <img src="https://i.pravatar.cc/32?img=6" alt="Alex Rodriguez" className="h-8 w-8 rounded-full border-2 border-indigo-500" /> 
          <span className="font-medium text-gray-700 hidden sm:block">Alex Rodriguez</span>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;