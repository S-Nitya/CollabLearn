import React, { useState } from 'react';
import { Search, Home, Calendar, MessageSquare, Users, Trophy, Bell, Filter, Clock, MapPin, Star, UserPlus } from 'lucide-react';

export default function SkillSwapBrowse() {
  const [visibleSkills, setVisibleSkills] = useState(6);

  const categories = [
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ), 
      name: 'All Categories', 
      count: '2847 skills', 
      active: true
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ), 
      name: 'Programming', 
      count: '1234 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ), 
      name: 'Academics', 
      count: '856 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      ), 
      name: 'Music', 
      count: '423 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
          <path d="m14 7 3 3" />
          <path d="M5 6v4" />
          <path d="M19 14v4" />
          <path d="M10 2v2" />
          <path d="M7 8H3" />
          <path d="M21 16h-4" />
          <path d="M11 3H9" />
        </svg>
      ), 
      name: 'Arts & Design', 
      count: '334 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.4 14.4 9.6 9.6" />
          <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
          <path d="m21.5 21.5-1.4-1.4" />
          <path d="M3.9 3.9 2.5 2.5" />
          <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
        </svg>
      ), 
      name: 'Fitness', 
      count: '267 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
          <line x1="12" y1="8" x2="12" y2="12" />
        </svg>
      ), 
      name: 'Cooking', 
      count: '189 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ), 
      name: 'Photography', 
      count: '156 skills'
    }
  ];

  const skills = [
    {
      instructor: 'Sarah Chen',
      rating: 4.9,
      reviews: 127,
      title: 'Master JavaScript Fundamentals',
      description: 'Learn the core concepts of JavaScript including variables, functions, and DOM manipulation.',
      tags: ['JavaScript', 'Web Development', 'Programming'],
      duration: '1 hour',
      location: 'Online',
      level: 'Beginner',
      price: 'Free',
      nextAvailable: 'Today, 3:00 PM',
      avatar: 'S'
    },
    {
      instructor: 'Marcus Johnson',
      rating: 4.8,
      reviews: 89,
      title: 'Advanced React Patterns',
      description: 'Deep dive into advanced React patterns including hooks, context, and performance optimization.',
      tags: ['React', 'JavaScript', 'Frontend'],
      duration: '2 hours',
      location: 'Online',
      level: 'Advanced',
      price: '$45/hr',
      nextAvailable: 'Tomorrow, 10:00 AM',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      instructor: 'Dr. Emily Wang',
      rating: 5,
      reviews: 156,
      title: 'Python for Data Science',
      description: 'Learn Python programming focused on data analysis, pandas, and visualization libraries.',
      tags: ['Python', 'Data Science', 'Analytics'],
      duration: '1.5 hours',
      location: 'Online',
      level: 'Intermediate',
      price: '$60/hr',
      nextAvailable: 'Dec 20, 2:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=45'
    },
    {
      instructor: 'James Rodriguez',
      rating: 4.7,
      reviews: 92,
      title: 'Piano Fundamentals',
      description: 'Start your musical journey with basic piano techniques, scales, and simple songs.',
      tags: ['Piano', 'Music Theory', 'Beginner'],
      duration: '45 minutes',
      location: 'In-Person & Online',
      level: 'Beginner',
      price: '$40/hr',
      nextAvailable: 'Dec 18, 6:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    {
      instructor: 'Luna Park',
      rating: 4.9,
      reviews: 73,
      title: 'Digital Art & Illustration',
      description: 'Create stunning digital artwork using industry-standard tools and techniques.',
      tags: ['Digital Art', 'Illustration', 'Photoshop'],
      duration: '2 hours',
      location: 'Online',
      level: 'Intermediate',
      price: '$50/hr',
      nextAvailable: 'Dec 19, 1:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    {
      instructor: 'Carlos Martinez',
      rating: 4.8,
      reviews: 134,
      title: 'Spanish Conversation Practice',
      description: 'Improve your Spanish speaking skills through engaging conversation practice.',
      tags: ['Spanish', 'Language', 'Conversation'],
      duration: '1 hour',
      location: 'Online',
      level: 'Intermediate',
      price: '$35/hr',
      nextAvailable: 'Today, 7:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=52'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .category-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-card:hover {
          transform: translateY(-4px);
        }

        .skill-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .skill-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .nav-item {
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          transform: scale(1.05);
        }

        .tag-item {
          transition: all 0.2s ease;
        }

        .tag-item:hover {
          transform: scale(1.1);
        }

        .bell-notification {
          animation: pulse 2s infinite;
        }
      `}</style>

      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 animate-slideIn">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all duration-300 cursor-pointer hover:scale-110">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">SkillSwap</span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              <button className="nav-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                <Home size={20} />
                <span className="font-medium">Dashboard</span>
              </button>
              <button className="nav-item flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <Search size={20} />
                <span className="font-medium">Browse Skills</span>
              </button>
              <button className="nav-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                <Calendar size={20} />
                <span className="font-medium">Calendar</span>
              </button>
              <button className="nav-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                <MessageSquare size={20} />
                <span className="font-medium">Messages</span>
              </button>
              <button className="nav-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                <Users size={20} />
                <span className="font-medium">Community</span>
              </button>
              <button className="nav-item flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                <Trophy size={20} />
                <span className="font-medium">Achievements</span>
              </button>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <div className="relative cursor-pointer">
                <Bell size={20} className="text-gray-600 hover:text-gray-900 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center bell-notification">3</span>
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-all">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Alex Rodriguez</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="mb-8 animate-fadeInUp">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Discover Amazing Skills</h1>
            <p className="text-lg text-gray-600">Learn from passionate teachers and share your expertise with others</p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-12 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search skills, instructors, or topics..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-700 hover:border-indigo-400 transition-all cursor-pointer">
              <option>All Categories</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-700 hover:border-indigo-400 transition-all cursor-pointer">
              <option>All Levels</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-all hover:border-indigo-400">
              <Filter size={20} />
              <span className="font-medium">More Filters</span>
            </button>
          </div>

          {/* Browse by Category */}
          <div className="mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-8 gap-4">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`category-card p-6 rounded-xl border-2 flex flex-col items-center text-center ${
                    cat.active
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                  style={{animationDelay: `${0.3 + idx * 0.05}s`}}
                >
                  <div className="bg-indigo-100 rounded-2xl p-4 mb-4 text-indigo-600">{cat.icon}</div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.count}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Available */}
          <div className="mb-8 flex items-center justify-between animate-fadeInUp" style={{animationDelay: '0.5s'}}>
            <h2 className="text-2xl font-bold text-gray-900">{skills.length} Skills Available</h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-700 hover:border-indigo-400 transition-all cursor-pointer">
              <option>Relevance</option>
            </select>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {skills.slice(0, visibleSkills).map((skill, idx) => (
              <div key={idx} className="skill-card bg-white rounded-xl border border-gray-200 p-6 animate-fadeInUp" style={{animationDelay: `${0.6 + idx * 0.1}s`}}>
                {/* Instructor Info */}
                <div className="flex items-center gap-3 mb-4">
                  {typeof skill.avatar === 'string' && skill.avatar.startsWith('http') ? (
                    <img src={skill.avatar} alt={skill.instructor} className="w-12 h-12 rounded-full hover:scale-110 transition-transform" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold hover:scale-110 transition-transform">
                      {skill.avatar}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{skill.instructor}</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{skill.rating}</span>
                      <span className="text-gray-500">({skill.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Skill Title & Description */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">{skill.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{skill.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {skill.tags.map((tag, i) => (
                    <span key={i} className="tag-item px-3 py-1 bg-cyan-500 text-white text-xs rounded-full font-medium cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{skill.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{skill.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">{skill.level}</span>
                  <span className={`text-lg font-bold ${skill.price === 'Free' ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {skill.price}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Next available: {skill.nextAvailable}
                </div>

                {/* Book Button */}
                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg">
                    Book Session
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-400 transition-all">
                    <UserPlus size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleSkills < skills.length && (
            <div className="text-center animate-fadeInUp">
              <button
                onClick={() => setVisibleSkills(prev => prev + 3)}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all text-gray-700 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md"
              >
                Load More Skills
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}