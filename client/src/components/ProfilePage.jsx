import React, { useState } from 'react';
import { MapPin, Calendar, Mail, Phone, Globe, Edit, X, Star, Plus, Award, BookOpen } from 'lucide-react';
import MainNavbar from '../navbar/mainNavbar';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('skills');
  const [profileData] = useState({
    name: 'Alex Rodriguez',
    location: 'San Francisco, CA',
    joinDate: 'March 2023',
    rating: 4.9,
    reviews: 127,
    bio: "Full-stack developer with 8+ years of experience. Passionate about teaching and helping others grow in their tech journey. I specialize in JavaScript, React, and Node.js development.",
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    website: 'alexrodriguez.dev',
    totalSessions: 156,
    skillsTeaching: 4,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  });

  const [skillsTeaching] = useState([
    {
      id: 1,
      name: 'JavaScript',
      level: 'Expert',
      description: 'Modern ES6+ JavaScript, async programming, and best practices',
      sessions: 45,
      rating: 4.9,
      price: 75
    },
    {
      id: 2,
      name: 'React',
      level: 'Expert',
      description: 'React fundamentals, hooks, context, and advanced patterns',
      sessions: 38,
      rating: 4.8,
      price: 80
    },
    {
      id: 3,
      name: 'Node.js',
      level: 'Advanced',
      description: 'Backend development with Express, APIs, and database integration',
      sessions: 29,
      rating: 4.9,
      price: 70
    },
    {
      id: 4,
      name: 'CSS/SCSS',
      level: 'Intermediate',
      description: 'Modern CSS, Flexbox, Grid, and responsive design',
      sessions: 22,
      rating: 4.7,
      price: 60
    }
  ]);

  const [skillsLearning] = useState([
    {
      id: 1,
      name: 'Python',
      progress: 75,
      instructor: 'Dr. Emily Wang',
      nextSession: 'Today, 2:00 PM'
    },
    {
      id: 2,
      name: 'Data Science',
      progress: 45,
      instructor: 'Marcus Chen',
      nextSession: 'Dec 20, 3:00 PM'
    },
    {
      id: 3,
      name: 'Machine Learning',
      progress: 20,
      instructor: 'Sarah Kim',
      nextSession: 'Not scheduled'
    }
  ]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-cyan-500';
      case 'Advanced':
        return 'bg-blue-500';
      case 'Intermediate':
        return 'bg-cyan-400';
      default:
        return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'skills', label: 'Skills' },
    // { id: 'reviews', label: 'Reviews' },
    // { id: 'achievements', label: 'Achievements' },
    { id: 'availability', label: 'Availability' },
    // { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
        <MainNavbar />
      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 transform transition-all duration-300 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Profile Image */}
              <div className="relative group">
                <img
                  src={profileData.profileImage}
                  alt={profileData.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-110 hover:bg-indigo-700">
                  <Award size={20} />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-fade-in">
                  {profileData.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-3 text-gray-600">
                  <div className="flex items-center gap-1 transition-colors duration-200 hover:text-indigo-600">
                    <MapPin size={16} />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-1 transition-colors duration-200 hover:text-indigo-600">
                    <Calendar size={16} />
                    <span className="text-sm">Joined {profileData.joinDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(profileData.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        } transition-all duration-200`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{profileData.rating}</span>
                  <span className="text-gray-500 text-sm">({profileData.reviews} reviews)</span>
                </div>

                <p className="text-gray-600 mb-4 max-w-3xl leading-relaxed">
                  {profileData.bio}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-indigo-600 transition-all duration-200 hover:text-indigo-700">
                    <Mail size={16} />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 transition-all duration-200 hover:text-indigo-700">
                    <Phone size={16} />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 transition-all duration-200 hover:text-indigo-700">
                    <Globe size={16} />
                    <span>{profileData.website}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Edit Button */}
            <div className="flex flex-col items-end gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                <Edit size={18} />
                <span className="font-medium">Edit Profile</span>
              </button>

              <div className="text-right space-y-2">
                <div>
                  <div className="text-4xl font-bold text-indigo-600">{profileData.totalSessions}</div>
                  <div className="text-sm text-gray-500">Total Sessions</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-cyan-500">{profileData.skillsTeaching}</div>
                  <div className="text-sm text-gray-500">Skills Teaching</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills I Teach */}
            <div className="bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-indigo-600" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900">Skills I Teach</h2>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105">
                  <Plus size={18} />
                  <span className="font-medium">Add Skill</span>
                </button>
              </div>

              <div className="space-y-4">
                {skillsTeaching.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="border border-gray-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-indigo-200 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.name}</h3>
                        <span className={`inline-block px-3 py-1 ${getLevelColor(skill.level)} text-white text-xs font-medium rounded-full`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">${skill.price}</div>
                        <div className="text-xs text-gray-500">per hour</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">{skill.sessions} sessions</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-gray-900">{skill.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200">
                          <X size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills I'm Learning */}
            <div className="bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="text-cyan-500" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Skills I'm Learning</h2>
              </div>

              <div className="space-y-6">
                {skillsLearning.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
                      <span className="text-sm font-semibold text-gray-900">{skill.progress}%</span>
                    </div>

                    <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.progress}%`,
                          background: `linear-gradient(to right, ${
                            skill.progress >= 70 ? '#6366f1, #06b6d4' :
                            skill.progress >= 40 ? '#3b82f6, #06b6d4' :
                            '#6366f1, #8b5cf6'
                          })`
                        }}
                      />
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Instructor: {skill.instructor}</div>
                      <div>Next session: {skill.nextSession}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Reviews content coming soon...</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Achievements content coming soon...</p>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Availability content coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Settings content coming soon...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}