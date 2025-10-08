import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, MapPin, Star, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MainNavbar from '../../navbar/mainNavbar';

const SkillRecommendations = () => {
  const [likedSkills, setLikedSkills] = useState([]);
  const [bookmarkedSkills, setBookmarkedSkills] = useState([]);

  const recommendations = {
    forYou: [
      {
        id: 1,
        user: 'Priya Sharma',
        avatar: '👩‍💻',
        skill: 'Advanced Java Programming',
        category: 'Java',
        rating: 4.9,
        reviews: 32,
        duration: '2 hours',
        level: 'Advanced',
        price: 'Free',
        description: 'Master multithreading, collections framework, and design patterns in Java',
        matchScore: 95,
        tags: ['Multithreading', 'Collections', 'Design Patterns'],
        booked: 58,
      },
      {
        id: 2,
        user: 'Arjun Reddy',
        avatar: '👨‍💼',
        skill: 'Spring Boot Microservices',
        category: 'Java',
        rating: 4.8,
        reviews: 28,
        duration: '2.5 hours',
        level: 'Expert',
        price: '$75/hr',
        description: 'Build production-ready microservices with Spring Boot and Docker',
        matchScore: 92,
        tags: ['Spring Boot', 'REST API', 'Microservices'],
        booked: 72,
      },
      {
        id: 3,
        user: 'Sneha Patel',
        avatar: '👩‍🔬',
        skill: 'Data Structures in C++',
        category: 'C/C++',
        rating: 4.7,
        reviews: 24,
        duration: '1.5 hours',
        level: 'Intermediate',
        price: 'Free',
        description: 'Deep dive into STL, algorithms, and competitive programming techniques',
        matchScore: 88,
        tags: ['STL', 'Algorithms', 'Competitive Programming'],
        booked: 47,
      },
    ],
    similar: [
        {
        id: 8,
        user: 'Vikram Kumar',
        avatar: '👨‍🔧',
        skill: 'C++ for System Programming',
        category: 'C/C++',
        rating: 4.8,
        reviews: 26,
        duration: '2 hours',
        level: 'Advanced',
        price: '$65/hr',
        description: 'Low-level programming, memory management, and system-level concepts',
        matchScore: 93,
        tags: ['Memory Management', 'Pointers', 'System Programming'],
        booked: 61,
      },
      {
        id: 9,
        user: 'Ananya Iyer',
        avatar: '👩‍💼',
        skill: 'Node.js Backend Development',
        category: 'MERN',
        rating: 4.9,
        reviews: 35,
        duration: '2 hours',
        level: 'Intermediate',
        price: 'Free',
        description: 'Build RESTful APIs, authentication, and database integration with Node.js',
        matchScore: 96,
        tags: ['Express.js', 'REST API', 'Authentication'],
        booked: 87,
      },
    ]
  };
  
  const allSkills = [...recommendations.forYou, ...recommendations.similar];

  const handleBackToBrowse = () => {
    window.history.back();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Java': 'bg-orange-100 text-orange-800',
      'C/C++': 'bg-blue-100 text-blue-800',
      'Python': 'bg-green-100 text-green-800',
      'MERN': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
      <div className="min-h-screen bg-slate-50">
        <MainNavbar />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToBrowse}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Discover Skills</h1>
                <p className="text-gray-500 text-xs">Personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Grid View */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allSkills.map(card => (
            <div key={card.id} className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 rounded-2xl shadow-lg overflow-hidden 
              transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl flex flex-col">
              
              {/* Main content area with increased padding for more height */}
              <div className="p-5 flex flex-col flex-grow"> {/* Increased padding from p-4 to p-5 */}
                
                <div className="flex justify-between items-center mb-4"> {/* Increased margin from mb-3 to mb-4 */}
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(card.category)}`}>
                        {card.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-2 py-0.5 rounded-full">
                        <Zap className="w-3 h-3 text-purple-600"/>
                        <span>{card.matchScore}% Match</span>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="flex items-center gap-3 mb-4"> {/* Increased gap and margin */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-xl shadow">
                    {card.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">{card.user}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{card.rating}</span>
                      <span>({card.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Skill Details */}
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{card.skill}</h4>
                  {/* Increased description font size for more height */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{card.description}</p>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-gray-700 mt-auto">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    <span>{card.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-indigo-600" />
                    <span>{card.level}</span>
                  </div>
                </div>
              </div>

              {/* Action Button with increased padding */}
              <div className="p-5 pt-2"> {/* Increased padding */}
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm 
                  hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                  Book • {card.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRecommendations;