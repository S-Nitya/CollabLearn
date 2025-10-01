import React from 'react';
import DashboardNavbar from '../navbar/landingNavbar'; // Assuming you save the new component here

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        
        {/* Top Navbar Component */}
        <DashboardNavbar />
        
        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 bg-gray-100">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, Alex Rodriguez! 👋
              </h1>
              <div className="flex items-center space-x-4">
                <button className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
                  <span className="material-icons-outlined text-xl mr-2">&#x1F514;</span> Notifications
                </button>
                
                {/* 1. SCHEDULE SESSION BUTTON - GRADIENT ADDED */}
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300">
                  <span className="material-icons-outlined text-xl mr-2">&#x2B;</span> Schedule Session
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              You have 3 upcoming sessions this week. Keep up the great work!
            </p>
          </div>

          {/* Stat Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Sessions Card */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
              <div className="bg-indigo-100 text-indigo-600 rounded-full h-12 w-12 flex items-center justify-center text-2xl">
                &#128218; {/* Book icon */}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">156</p>
                <p className="text-gray-500">Total Sessions</p>
              </div>
            </div>

            {/* Average Rating Card */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
              <div className="bg-yellow-100 text-yellow-600 rounded-full h-12 w-12 flex items-center justify-center text-2xl">
                &#9733; {/* Star icon */}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">4.9</p>
                <p className="text-gray-500">Average Rating</p>
              </div>
            </div>

            {/* Skills Teaching Card */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
              <div className="bg-pink-100 text-pink-600 rounded-full h-12 w-12 flex items-center justify-center text-2xl">
                &#128107; {/* Users icon */}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">8</p>
                <p className="text-gray-500">Skills Teaching</p>
              </div>
            </div>

            {/* Badges Earned Card */}
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
              <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center text-2xl">
                &#127942; {/* Trophy icon */}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">12</p>
                <p className="text-gray-500">Badges Earned</p>
              </div>
            </div>
          </div>

          {/* Grid for two main sections: Upcoming/Skills and Learning Progress/Activity/Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Upcoming Sessions & Skills I'm Teaching) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Upcoming Sessions Card (No change needed) */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="material-icons-outlined text-2xl text-gray-500 mr-2">&#128197;</span> Upcoming Sessions
                  </h3>
                  <button className="text-indigo-600 text-sm font-semibold hover:underline">
                    View All
                  </button>
                </div>

                {/* Session Item 1 */}
                <div className="flex items-center justify-between py-4 border-t border-gray-200 first:border-none">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-600 rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold">
                      JS
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">JavaScript Fundamentals</p>
                      <p className="text-sm text-gray-500">with Sarah Chen</p>
                      <p className="text-xs text-gray-400">Today <span className="font-bold">@ 2:00 PM</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      Learning
                    </span>
                    <button className="text-gray-500 hover:text-gray-800">&#128200;</button> {/* Stats icon */}
                    <button className="text-gray-500 hover:text-gray-800">&#128197;</button> {/* Calendar icon */}
                  </div>
                </div>

                {/* Session Item 2 */}
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img src="https://i.pravatar.cc/32?img=6" alt="Alex Rodriguez" className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-800">React Hooks Deep Dive</p>
                      <p className="text-sm text-gray-500">teaching Marcus Johnson</p>
                      <p className="text-xs text-gray-400">Tomorrow <span className="font-bold">@ 10:00 AM</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      Teaching
                    </span>
                    <button className="text-gray-500 hover:text-gray-800">&#128200;</button> {/* Stats icon */}
                    <button className="text-gray-500 hover:text-gray-800">&#128197;</button> {/* Calendar icon */}
                  </div>
                </div>

                {/* Session Item 3 */}
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img src="https://i.pravatar.cc/32?img=7" alt="Alex Rodriguez" className="h-10 w-10 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-800">Python Data Analysis</p>
                      <p className="text-sm text-gray-500">with Dr. Emily Wang</p>
                      <p className="text-xs text-gray-400">Dec 19 <span className="font-bold">@ 4:30 PM</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      Learning
                    </span>
                    <button className="text-gray-500 hover:text-gray-800">&#128200;</button> {/* Stats icon */}
                    <button className="text-gray-500 hover:text-gray-800">&#128197;</button> {/* Calendar icon */}
                  </div>
                </div>
              </div>

              {/* 2. SKILLS I'M TEACHING CARD - STYLED AS TABS */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-500 mr-2">&#127891;</span> Skills I'm Teaching
                </h3>
                
                {/* Skill Item 1 - Tab Styling */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 shadow-sm hover:bg-gray-100 transition duration-150">
                  <div>
                    <p className="font-semibold text-gray-800">JavaScript</p>
                    <p className="text-sm text-gray-500">Level: Expert <span className="font-medium text-gray-600">45 sessions</span> <span className="text-yellow-500">&#9733; 4.9</span></p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200">Manage</button>
                </div>
                
                {/* Skill Item 2 - Tab Styling */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 shadow-sm hover:bg-gray-100 transition duration-150">
                  <div>
                    <p className="font-semibold text-gray-800">React</p>
                    <p className="text-sm text-gray-500">Level: Expert <span className="font-medium text-gray-600">38 sessions</span> <span className="text-yellow-500">&#9733; 4.8</span></p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200">Manage</button>
                </div>

                {/* Skill Item 3 - Tab Styling */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 shadow-sm hover:bg-gray-100 transition duration-150">
                  <div>
                    <p className="font-semibold text-gray-800">CSS/SCSS</p>
                    <p className="text-sm text-gray-500">Level: Advanced <span className="font-medium text-gray-600">29 sessions</span> <span className="text-yellow-500">&#9733; 4.9</span></p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200">Manage</button>
                </div>

                {/* Skill Item 4 - Tab Styling */}
                <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2 shadow-sm hover:bg-gray-100 transition duration-150">
                  <div>
                    <p className="font-semibold text-gray-800">Node.js</p>
                    <p className="text-sm text-gray-500">Level: Intermediate <span className="font-medium text-gray-600">22 sessions</span> <span className="text-yellow-500">&#9733; 4.7</span></p>
                  </div>
                  <button className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-200">Manage</button>
                </div>
              </div>
            </div>

            {/* Right Column (Learning Progress, Recent Activity, Quick Actions) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Learning Progress Card (No change needed) */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-500 mr-2">&#128200;</span> Learning Progress
                </h3>
                
                {/* Progress Item 1 */}
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-1">Python</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">75%</p>
                  <p className="text-xs text-gray-400">Next: Today, 2:00 PM</p>
                </div>

                {/* Progress Item 2 */}
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-1">Data Science</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">45%</p>
                  <p className="text-xs text-gray-400">Next: Dec 20, 3:00 PM</p>
                </div>
                
                {/* Progress Item 3 */}
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-1">Machine Learning</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{width: '20%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">20%</p>
                  <p className="text-xs text-gray-400">Next: Not scheduled</p>
                </div>
              </div>

              {/* Recent Activity Card (No change needed) */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-500 mr-2">&#128221;</span> Recent Activity
                </h3>
                
                {/* Activity Item 1 */}
                <div className="flex items-start mb-3">
                  <span className="material-icons-outlined text-green-500 text-lg mr-3 mt-1">&#10003;</span> {/* Checkmark icon */}
                  <div>
                    <p className="text-gray-700">Completed session: <span className="font-semibold">Advanced CSS Grid</span></p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                {/* Activity Item 2 */}
                <div className="flex items-start mb-3">
                  <span className="material-icons-outlined text-yellow-500 text-lg mr-3 mt-1">&#9733;</span> {/* Star icon */}
                  <div>
                    <p className="text-gray-700">Received 5-star review from <span className="font-semibold">Emma Wilson</span></p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                
                {/* Activity Item 3 */}
                <div className="flex items-start mb-3">
                  <span className="material-icons-outlined text-purple-500 text-lg mr-3 mt-1">&#127942;</span> {/* Trophy icon */}
                  <div>
                    <p className="text-gray-700">Earned badge: <span className="font-semibold">CSS Master</span></p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>

                {/* Activity Item 4 */}
                <div className="flex items-start">
                  <span className="material-icons-outlined text-blue-500 text-lg mr-3 mt-1">&#128218;</span> {/* Book icon */}
                  <div>
                    <p className="text-gray-700">New booking request for <span className="font-semibold">React Tutorial</span></p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>

              {/* 3. QUICK ACTIONS CARD - STYLED AS TABS */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <span className="material-icons-outlined text-2xl text-gray-500 mr-2">&#128200;</span> Quick Actions
                </h3>
                
                <div className="space-y-2">
                  {/* Action Item 1 - Tab Styling */}
                  <button className="flex items-center px-4 py-3 text-indigo-600 font-semibold bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 w-full text-left shadow-sm">
                    <span className="material-icons-outlined text-xl mr-3">&#x2B;</span> Add New Skill
                  </button>
                  {/* Action Item 2 - Tab Styling */}
                  <button className="flex items-center px-4 py-3 text-indigo-600 font-semibold bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 w-full text-left shadow-sm">
                    <span className="material-icons-outlined text-xl mr-3">&#128197;</span> Set Availability
                  </button>
                  {/* Action Item 3 - Tab Styling */}
                  <button className="flex items-center px-4 py-3 text-indigo-600 font-semibold bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 w-full text-left shadow-sm">
                    <span className="material-icons-outlined text-xl mr-3">&#128101;</span> Message Center
                  </button>
                  {/* Action Item 4 - Tab Styling */}
                  <button className="flex items-center px-4 py-3 text-indigo-600 font-semibold bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-150 w-full text-left shadow-sm">
                    <span className="material-icons-outlined text-xl mr-3">&#127942;</span> View Achievements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;