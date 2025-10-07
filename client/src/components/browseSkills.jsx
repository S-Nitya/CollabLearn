import React, { useState, useEffect } from 'react';
import { Search, Home, Calendar, MessageSquare, Users, Trophy, Bell, Filter, Clock, MapPin, Star, UserPlus, X, ChevronDown } from 'lucide-react';
import MainNavbar from '../navbar/mainNavbar.jsx';
import { Link } from 'react-router-dom';
// Placeholder MainNavbar component


export default function SkillSwapBrowse() {
  const [visibleSkills, setVisibleSkills] = useState(6);
  const [showPostSkillModal, setShowPostSkillModal] = useState(false);
  const [postSkillForm, setPostSkillForm] = useState({
    title: '',
    description: '',
    skills: '',
    timePerHour: '',
    price: ''
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const categories = [
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18" />
          <path d="M15 3v18" />
        </svg>
      ), 
      name: 'All Categories', 
      count: '2847 skills', 
      active: true
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5">
          {/* Steam */}
          <path d="M18 8c1 2 0 4 1 6M25 6c1 2.5 0 4.5 1 7" strokeLinecap="round"/>
          
          {/* Coffee cup */}
          <path d="M12 20h26M12 20c0 0 2 18 13 18s13-18 13-18" strokeLinecap="round" strokeLinejoin="round"/>
          <ellipse cx="25" cy="20" rx="13" ry="3" fill="currentColor" opacity="0.2"/>
          
          {/* Cup handle */}
          <path d="M38 24c2 0 4 1.5 4 4s-2 4-4 4" strokeLinecap="round"/>
        </svg>
      ), 
      name: 'Java', 
      count: '856 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="currentColor">
          <path d="M25,2L6,11v17c0,11.7,8.1,22.6,19,25c10.9-2.4,19-13.3,19-25V11L25,2z M25,7l15,7v14c0,9.3-6.4,17.9-15,20 c-8.6-2.1-15-10.7-15-20V14L25,7z"/>
          <text x="25" y="32" textAnchor="middle" fontSize="16" fontWeight="bold" fill="currentColor">C++</text>
        </svg>
      ), 
      name: 'C/C++', 
      count: '734 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="currentColor">
          {/* Python snake logo - two intertwined snakes */}
          <path d="M20 8c-3 0-5 2-5 5v6h10v1H13c-3 0-5 2-5 5v6c0 3 2 5 5 5h4v-5c0-3 2-5 5-5h10c2.5 0 4.5-2 4.5-4.5v-8.5c0-3-2-5-5-5h-11.5z" opacity="0.6"/>
          <path d="M30 42c3 0 5-2 5-5v-6H25v-1h12c3 0 5-2 5-5v-6c0-3-2-5-5-5h-4v5c0 3-2 5-5 5H18c-2.5 0-4.5 2-4.5 4.5v8.5c0 3 2 5 5 5h11.5z"/>
          <circle cx="18" cy="13" r="1.5" fill="white"/>
          <circle cx="32" cy="37" r="1.5" fill="white"/>
        </svg>
      ), 
      name: 'Python', 
      count: '1023 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="currentColor">
          {/* MongoDB leaf */}
          <path d="M25 5c-1 0-1.8 3-2.5 7-.8 4-1.5 9-1.5 13 0 6 2 10 4 10s4-4 4-10c0-4-.7-9-1.5-13-.7-4-1.5-7-2.5-7z"/>
          <path d="M24 35v10h2V35" opacity="0.6"/>
          <ellipse cx="25" cy="15" rx="8" ry="12" opacity="0.3"/>
        </svg>
      ), 
      name: 'MongoDB', 
      count: '342 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="8" y1="25" x2="42" y2="25"/>
          <line x1="8" y1="15" x2="25" y2="15"/>
          <line x1="8" y1="35" x2="25" y2="35"/>
          <path d="M25 5L42 15v20L25 45"/>
        </svg>
      ), 
      name: 'Express', 
      count: '298 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="25" cy="25" rx="18" ry="7"/>
          <ellipse cx="25" cy="25" rx="18" ry="7" transform="rotate(60 25 25)"/>
          <ellipse cx="25" cy="25" rx="18" ry="7" transform="rotate(120 25 25)"/>
          <circle cx="25" cy="25" r="4" fill="currentColor"/>
        </svg>
      ), 
      name: 'React', 
      count: '567 skills'
    },
    { 
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 50 50" fill="currentColor">
          {/* Node.js hexagon with JS */}
          <path d="M25 5L8 14v18l17 10 17-10V14L25 5z"/>
          <path d="M25 10l12 7v14l-12 7-12-7V17l12-7z" fill="white" opacity="0.9"/>
          <text x="25" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">JS</text>
        </svg>
      ), 
      name: 'Node.js', 
      count: '445 skills'
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
      title: 'Java Spring Boot Mastery',
      description: 'Build enterprise-level applications with Spring Boot framework and best practices.',
      tags: ['Java', 'Spring Boot', 'Backend'],
      duration: '2 hours',
      location: 'In-Person & Online',
      level: 'Intermediate',
      price: '$55/hr',
      nextAvailable: 'Dec 18, 6:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=33'
    },
    {
      instructor: 'Luna Park',
      rating: 4.9,
      reviews: 73,
      title: 'C++ Game Development',
      description: 'Create stunning games using C++ and modern game development techniques.',
      tags: ['C++', 'Game Dev', 'Programming'],
      duration: '2 hours',
      location: 'Online',
      level: 'Advanced',
      price: '$50/hr',
      nextAvailable: 'Dec 19, 1:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=27'
    },
    {
      instructor: 'Carlos Martinez',
      rating: 4.8,
      reviews: 134,
      title: 'Full Stack MERN Development',
      description: 'Build complete web applications using MongoDB, Express, React, and Node.js.',
      tags: ['MERN', 'Full Stack', 'JavaScript'],
      duration: '2.5 hours',
      location: 'Online',
      level: 'Intermediate',
      price: '$65/hr',
      nextAvailable: 'Today, 7:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=52'
    }
  ];

  // Fetch user's available skills from database
  const fetchAvailableSkills = async () => {
    try {
      setSkillsLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('/api/skills/my-skills', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Extract unique skill names from user's skills (both offering and seeking)
        const allUserSkills = [...data.data.skillsOffering, ...data.data.skillsSeeking];
        const uniqueSkills = [...new Set(allUserSkills.map(skill => skill.name))];
        setAvailableSkills(uniqueSkills);
      } else {
        console.error('Failed to fetch skills:', data.message);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  };

  // Fetch skills when modal opens
  useEffect(() => {
    if (showPostSkillModal) {
      fetchAvailableSkills();
    }
  }, [showPostSkillModal]);

  const handlePostSkillSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to post a skill');
        return;
      }

      const response = await fetch('/api/skills/post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: postSkillForm.title,
          description: postSkillForm.description,
          skills: postSkillForm.skills,
          timePerHour: postSkillForm.timePerHour,
          price: postSkillForm.price
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Skill details updated successfully!');
        
        // Reset form and close modal
        setPostSkillForm({
          title: '',
          description: '',
          skills: '',
          timePerHour: '',
          price: ''
        });
        setShowPostSkillModal(false);
        setShowSkillsDropdown(false);
      } else {
        alert(data.message || 'Failed to post skill');
      }
    } catch (error) {
      console.error('Error posting skill:', error);
      alert('An error occurred while posting the skill. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostSkillForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skill selection
  const handleSkillSelect = (skillName) => {
    setPostSkillForm(prev => ({
      ...prev,
      skills: skillName
    }));
    setShowSkillsDropdown(false); // Close dropdown after selection
  };

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

        .cursor-pointer {
          cursor: pointer;
        }

        .modal-overlay {
          backdrop-filter: blur(4px);
          background: rgba(0, 0, 0, 0.4);
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .modal-overlay {
          backdrop-filter: blur(4px);
          background: rgba(0, 0, 0, 0.4);
        }
      `}</style>

      <MainNavbar />

      {/* Main Content */}
      <div className="pt-24">
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
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 transition-all hover:border-indigo-400 cursor-pointer">
              <Filter size={20} />
              <span className="font-medium">More Filters</span>
            </button>
            <button 
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:shadow-lg font-semibold cursor-pointer"
              onClick={() => setShowPostSkillModal(true)}
            >
              <UserPlus size={20} />
              <span>Post Skill</span>
            </button>
          </div>

          {/* Browse by Category */}
          <div className="mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`category-card p-6 rounded-xl border-2 flex flex-col items-center text-center cursor-pointer ${
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

                <div className="flex items-center justify-end mb-4">
                  <span className={`text-lg font-bold ${skill.price === 'Free' ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {skill.price}
                  </span>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  Next available: {skill.nextAvailable}
                </div>

                {/* Book Button */}
                <div className="flex items-center gap-2">
                  {/* <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg cursor-pointer">
                    Book Session
                  </button> */}
                  <Link to='/book-session' className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all hover:shadow-lg cursor-pointer px-28"> Book Session</Link>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-400 transition-all cursor-pointer">
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
                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all text-gray-700 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md cursor-pointer"
              >
                Load More Skills
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Skill Modal */}
      {showPostSkillModal && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 animate-fadeInUp shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Post a New Skill</h2>
              <button 
                onClick={() => {
                  setShowPostSkillModal(false);
                  setShowSkillsDropdown(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handlePostSkillSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={postSkillForm.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Master JavaScript Fundamentals"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={postSkillForm.description}
                  onChange={handleInputChange}
                  placeholder="e.g., This course covers the basics of Javascript..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill to Include <span className="text-red-500">*</span>
                </label>
                
                {/* Selected Skill Display */}
                {postSkillForm.skills && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                      {postSkillForm.skills}
                      <button
                        type="button"
                        onClick={() => setPostSkillForm(prev => ({ ...prev, skills: '' }))}
                        className="hover:bg-indigo-200 rounded-full p-0.5 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  </div>
                )}
                
                {/* Skills Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-left flex items-center justify-between cursor-pointer"
                  >
                    <span className={!postSkillForm.skills ? "text-gray-400" : "text-gray-900"}>
                      {!postSkillForm.skills 
                        ? "Select a skill to include..." 
                        : postSkillForm.skills
                      }
                    </span>
                    <ChevronDown size={20} className={`transform transition-transform ${
                      showSkillsDropdown ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Dropdown Options */}
                  {showSkillsDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {skillsLoading ? (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          Loading skills...
                        </div>
                      ) : availableSkills.length === 0 ? (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No skills available
                        </div>
                      ) : (
                        availableSkills.map((skill, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSkillSelect(skill)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer ${
                              postSkillForm.skills === skill ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
                            }`}
                          >
                            <span>{skill}</span>
                            {postSkillForm.skills === skill && (
                              <span className="text-indigo-600">✓</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                
                {/* Validation */}
                {!postSkillForm.skills && (
                  <p className="text-xs text-gray-500 mt-1">Please select a skill</p>
                )}
              </div>

              {/* Time per Hour */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Duration <span className="text-red-500">*</span>
                </label>
                <select
                  name="timePerHour"
                  value={postSkillForm.timePerHour}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                >
                  <option value="">Select duration</option>
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                  <option value="2.5 hours">2.5 hours</option>
                  <option value="3 hours">3 hours</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Optional)
                </label>
                <input
                  type="text"
                  name="price"
                  value={postSkillForm.price}
                  onChange={handleInputChange}
                  placeholder="e.g., $50/hr (leave empty for free)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPostSkillModal(false);
                    setShowSkillsDropdown(false);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!postSkillForm.skills}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                    !postSkillForm.skills 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Post Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}