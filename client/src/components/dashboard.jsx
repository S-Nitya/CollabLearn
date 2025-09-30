import React, { useState } from "react";
import { FaBell, FaStar, FaCalendarPlus } from "react-icons/fa";

export default function CollablearnDashboard() {
  const [notifications] = useState(2);

  return (
    <div className="min-h-screen bg-[#0a0a3d] text-gray-900">
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="COLLABLEARN Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-[#0a0a3d]">COLLABLEARN</h1>
        </div>
        <nav className="flex items-center gap-6 text-gray-600 font-medium">
          <a href="#" className="text-[#0a0a3d]">Dashboard</a>
          <a href="#">Browse Skills</a>
          <a href="#">Calendar</a>
          <a href="#">Messages</a>
          <a href="#">Community</a>
          <a href="#">Achievements</a>
        </nav>
        <div className="flex items-center gap-6">
          <div className="relative">
            <FaBell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {notifications}
              </span>
            )}
          </div>
          <button className="bg-[#0a0a3d] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaCalendarPlus /> Schedule Session
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="p-8 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-6 text-[#0a0a3d]">
          Welcome back, Alex Rodriguez! 👋
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#0a0a3d]">156</p>
            <p>Total Sessions</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#0a0a3d]">4.9</p>
            <p>Average Rating</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#0a0a3d]">8</p>
            <p>Skills Teaching</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 text-center">
            <p className="text-3xl font-bold text-[#0a0a3d]">12</p>
            <p>Badges Earned</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="col-span-2">
            <h3 className="font-bold mb-4">Upcoming Sessions</h3>
            <div className="space-y-4">
              <div className="bg-white shadow rounded-xl p-4 flex justify-between">
                <p>JavaScript Fundamentals with Sarah Chen</p>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-md">Learning</span>
              </div>
              <div className="bg-white shadow rounded-xl p-4 flex justify-between">
                <p>React Hooks Deep Dive with Marcus Johnson</p>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md">Teaching</span>
              </div>
              <div className="bg-white shadow rounded-xl p-4 flex justify-between">
                <p>Python Data Analysis with Dr. Emily Wang</p>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-md">Learning</span>
              </div>
            </div>
          </div>

          {/* Learning Progress */}
          <div>
            <h3 className="font-bold mb-4">Learning Progress</h3>
            <div className="bg-white shadow rounded-xl p-4 space-y-4">
              <div>
                <p className="text-sm font-medium">Python</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-[75%]"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Data Science</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[45%]"></div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Machine Learning</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-[20%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills I'm Teaching + Right Column */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          {/* Skills Teaching */}
          <div className="col-span-2">
            <h3 className="font-bold mb-4">Skills I'm Teaching</h3>
            <div className="bg-white shadow rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <p>JavaScript (Expert) - 45 sessions</p>
                <span className="flex items-center gap-1 text-yellow-500"><FaStar /> 4.9</span>
              </div>
              <div className="flex justify-between">
                <p>React (Expert) - 38 sessions</p>
                <span className="flex items-center gap-1 text-yellow-500"><FaStar /> 4.8</span>
              </div>
              <div className="flex justify-between">
                <p>CSS/SCSS (Advanced) - 29 sessions</p>
                <span className="flex items-center gap-1 text-yellow-500"><FaStar /> 4.9</span>
              </div>
              <div className="flex justify-between">
                <p>Node.js (Intermediate) - 22 sessions</p>
                <span className="flex items-center gap-1 text-yellow-500"><FaStar /> 4.7</span>
              </div>
            </div>
          </div>

          {/* Recent + Quick Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold mb-4">Recent Activity</h3>
              <div className="bg-white shadow rounded-xl p-4 space-y-2 text-sm">
                <p>✅ Completed: Advanced CSS Grid (2h ago)</p>
                <p>⭐ Received 5-star review (4h ago)</p>
                <p>🏅 Earned badge: CSS Master (Yesterday)</p>
                <p>📌 New booking for React Tutorial (2d ago)</p>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="bg-white shadow rounded-xl p-4 space-y-2 text-sm">
                <button className="w-full bg-[#0a0a3d] text-white py-2 rounded-lg">+ Add New Skill</button>
                <button className="w-full border py-2 rounded-lg">Set Availability</button>
                <button className="w-full border py-2 rounded-lg">Message Center</button>
                <button className="w-full border py-2 rounded-lg">View Achievements</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
