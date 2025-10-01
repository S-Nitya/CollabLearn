import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Home, Calendar, MessageSquare, Users, Trophy, Bell, User } from 'lucide-react';

import CollabLearnLogo from '../assets/Collablearn Logo.png';

export default function MainNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('Guest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUsername(storedUsername);
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername('Guest');
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? 'nav-item flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
      : 'nav-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="flex justify-between items-center h-20 px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={CollabLearnLogo}
            alt="CollabLearn Logo" 
            className="w-12 h-12 rounded-xl object-cover"
          />
          <span className="text-2xl font-bold text-indigo-600">CollabLearn</span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>
            <Home size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/browse-skills" className={getLinkClass('/browse-skills')}>
            <Search size={20} />
            <span className="font-medium">Browse Skills</span>
          </Link>
          <Link to="/calendar" className={getLinkClass('/calendar')}>
            <Calendar size={20} />
            <span className="font-medium">Calendar</span>
          </Link>
          <Link to="/messages" className={getLinkClass('/messages')}>
            <MessageSquare size={20} />
            <span className="font-medium">Messages</span>
          </Link>
          <Link to="/community" className={getLinkClass('/community')}>
            <Users size={20} />
            <span className="font-medium">Community</span>
          </Link>
          <Link to="/achievements" className={getLinkClass('/achievements')}>
            <Trophy size={20} />
            <span className="font-medium">Achievements</span>
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <Bell size={20} className="text-gray-600 hover:text-gray-900 transition-colors" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center bell-notification">3</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-all"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{username}</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-red-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
