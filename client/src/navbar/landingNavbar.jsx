import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Collablearn Logo.png'; // Ensure you have a logo image in the specified path

export default function LandingNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 h-16">
      <div className="flex justify-between items-center h-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          {/* 🔽 Replace src with your custom logo image */}
          <img 
            src={logo} 
            alt="CollabLearn Logo" 
            className="w-12 h-12 rounded-xl object-cover" 
          />
          <span className="text-2xl font-bold text-indigo-600">CollabLearn</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/browse-skills" className="text-gray-600 hover:text-indigo-600 transition">Browse Skills</Link>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition">How it Works</a>
          <Link to="/community" className="text-gray-600 hover:text-indigo-600 transition">Community</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition font-medium">
            Sign In
          </Link>
          <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
