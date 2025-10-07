import React, { useState, useMemo } from 'react';
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    addDays, 
    addMonths, 
    subMonths, 
    isSameMonth, 
    isSameDay,
    isToday,
    addWeeks,
    subWeeks
} from 'date-fns';
import MainNavbar from '../../navbar/mainNavbar'; 

const CalendarPage = () => {
  // --- STATE MANAGEMENT ---
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the date currently centered/viewed
  const [currentView, setCurrentView] = useState('Month'); // 'Day', 'Week', or 'Month'

  // --- HANDLERS ---

  const handlePrev = () => {
    if (currentView === 'Month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (currentView === 'Week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (currentView === 'Day') {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (currentView === 'Month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (currentView === 'Week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (currentView === 'Day') {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleViewChange = (event) => {
    setCurrentView(event.target.value);
    setCurrentDate(new Date()); // Reset date to today when changing view
  };

  // --- CALENDAR LOGIC (for Month View) ---

  const monthName = format(currentDate, 'MMMM yyyy');

  // Generate calendar days only for the Month view
  const monthCalendarDays = useMemo(() => {
    if (currentView !== 'Month') return [];
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Saturday end

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate, currentView]);


  // --- MOCK DATA (Remaining unchanged) ---
  const todaySessions = [
    { name: 'JavaScript Fundamentals', time: '2:00 PM', duration: '60min', instructor: 'Self' }
  ];

  const bookingRequests = [
    { name: 'Lisa Park', skill: 'JavaScript Fundamentals', date: 'Dec 21, 2024', time: '2:00 PM', duration: '1 hour', note: 'Looking forward to learning JavaScript from scratch!' },
    { name: 'Michael Chen', skill: 'React Advanced Patterns', date: 'Dec 22, 2024', time: '10:00 AM', duration: '1.5 hours', note: 'I want to learn about custom hooks and context patterns.' }
  ];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-auto">
        
        <MainNavbar />
        
        {/* Main Calendar Content */}
        <main className="flex-1 p-6 bg-gray-100 pt-24">
          
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Calendar</h1>
              <p className="text-gray-600">Manage your teaching sessions and learning schedule</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Selector Button - MADE FUNCTIONAL */}
              <div className="relative">
                <select 
                  value={currentView}
                  onChange={handleViewChange}
                  className="appearance-none border border-gray-300 rounded-lg py-2 px-4 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option>Day</option>
                    <option>Week</option>
                    <option>Month</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <span className="material-icons-outlined text-sm">&#9660;</span> {/* Dropdown arrow */}
                </div>
              </div>
              
              <button className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
                <span className="material-icons-outlined text-xl mr-1">&#x2B;</span> Filter
              </button>
              
              {/* Block Time Button (Indigo-Themed) */}
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 font-semibold">
                <span className="material-icons-outlined text-xl mr-2">&#x2B;</span> Block Time
              </button>
            </div>
          </div>

          {/* Main Grid: Calendar and Side Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column: Calendar View (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                {/* Dynamic Month/View Title */}
                <h3 className="text-xl font-semibold text-gray-800">
                  {currentView === 'Month' 
                    ? monthName
                    : currentView === 'Week'
                    ? `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM do')}`
                    : format(currentDate, 'EEEE, MMM do, yyyy')
                  }
                </h3>

                {/* Navigation Buttons - MADE FUNCTIONAL */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handlePrev}
                    className="text-gray-500 hover:text-gray-800 border p-2 rounded-lg"
                  >
                    &#x2039;
                  </button>
                  <button 
                    onClick={handleToday}
                    className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Today
                  </button>
                  <button 
                    onClick={handleNext}
                    className="text-gray-500 hover:text-gray-800 border p-2 rounded-lg"
                  >
                    &#x203A;
                  </button>
                </div>
              </div>

              {/* Dynamic Calendar Content */}
              {currentView === 'Month' ? (
                // --- MONTH VIEW GRID ---
                <div className="grid grid-cols-7 text-center border border-gray-200">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-sm font-semibold text-gray-500 border-b border-gray-200">
                      {day}
                    </div>
                  ))}
                  
                  {/* Days */}
                  {monthCalendarDays.map((day, index) => (
                    <div 
                      key={index} 
                      className={`h-24 p-2 border border-gray-200 ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <div className={`text-sm font-semibold h-6 w-6 flex items-center justify-center rounded-full mx-auto 
                        ${isToday(day) ? 'bg-red-500 text-white' : ''} 
                        ${isSameDay(day, currentDate) && !isToday(day) && isSameMonth(day, currentDate) ? 'border-2 border-indigo-600 text-indigo-600' : 'text-gray-800'}
                        ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
                      `}>
                        {format(day, 'd')}
                      </div>
                      {/* Placeholder for events */}
                    </div>
                  ))}
                </div>
              ) : (
                // --- DAY / WEEK VIEW PLACEHOLDER ---
                <div className="text-center py-20 text-gray-500 border border-gray-200 rounded-lg h-96 flex items-center justify-center">
                    <p className="text-lg">
                        {currentView} View is currently displaying: <br />
                        <span className="font-semibold text-gray-700">{format(currentDate, 'EEEE, MMMM do, yyyy')}</span>. 
                        Detailed Day/Week grid implementation goes here.
                    </p>
                </div>
              )}
            </div>

            {/* Right Column: Sessions and Requests */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Today's Sessions Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Sessions</h3>
                {todaySessions.map((session, index) => (
                  <div key={index} className="border-b last:border-b-0 pb-3 mb-3">
                    <p className="text-sm font-medium text-gray-700">{session.skill}</p>
                    <p className="text-xs text-gray-500 mb-2">{session.time} • {session.duration}</p>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-indigo-600 font-semibold">Join</p>
                      <button className="text-gray-500 hover:text-gray-800">&#9993;</button> {/* Message icon */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Booking Requests Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Requests</h3>
                {bookingRequests.map((request, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <img src={`https://i.pravatar.cc/32?img=${index + 10}`} alt={request.name} className="h-8 w-8 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-800">{request.name}</p>
                        <p className="text-xs text-indigo-600">{request.skill}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {request.date} at {request.time}<br />
                      <span className="text-xs text-gray-500">Duration: {request.duration}</span>
                    </p>
                    <p className="text-xs italic text-gray-500 mb-3">"{request.note}"</p>
                    <div className="flex justify-between space-x-2">
                      <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium">
                        Accept
                      </button>
                      <button className="flex-1 px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 text-sm font-medium">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* This Week Stats Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">This Week</h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Teaching sessions</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning sessions</span>
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span>Total hours</span>
                    <span className="font-semibold">7.5</span>
                  </div>
                  <div className="flex justify-between text-indigo-600 font-bold pt-2 border-t border-gray-200">
                    <span>Earnings</span>
                    <span>$375</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarPage;