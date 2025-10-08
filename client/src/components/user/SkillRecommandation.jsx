import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Clock, Star, ArrowLeft, Zap, Award } from 'lucide-react';
import MainNavbar from '../../navbar/mainNavbar';

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="p-5 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-5 bg-slate-200 rounded w-5/6 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-200 rounded"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="flex items-center gap-3 text-xs mt-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
      </div>
      <div className="h-11 bg-slate-200 rounded-lg mt-5"></div>
    </div>
  </div>
);

const SkillRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateMatchScore = (recommendedSkill, currentUserSkills) => {
      if (!recommendedSkill || !currentUserSkills) return 0;

      let score = 0;
      const weights = {
        oneWayMatch: 40,
        peerMatch: 20,
        tagOverlap: 25,
        categoryOverlap: 10,
        profileCompleteness: 5,
        recency: 5,
      };

      const { user: recommendedUser, name: recommendedName, tags: theirTagsRaw, category: theirCategory, updatedAt } = recommendedSkill;

      if (!recommendedUser) return 0;

      const seekingNames = (currentUserSkills.seeking || []).map(s => s.name.toLowerCase());
      if (seekingNames.includes((recommendedName || '').toLowerCase())) {
        score += weights.oneWayMatch;
      }
      const offeringNames = (currentUserSkills.offering || []).map(s => s.name.toLowerCase());
      if (offeringNames.includes((recommendedName || '').toLowerCase())) {
        score += weights.peerMatch;
      }

      const myTags = [...(currentUserSkills.offering || []), ...(currentUserSkills.seeking || [])].flatMap(s => s.tags?.map(t => t.toLowerCase()) || []);
      const theirTags = (theirTagsRaw || []).map(t => t.toLowerCase());
      if (myTags.length > 0 && theirTags.length > 0) {
        const commonTags = myTags.filter(t => theirTags.includes(t));
        score += Math.min(weights.tagOverlap, commonTags.length * 5);
      }

      const myCategories = [...new Set([...(currentUserSkills.offering || []), ...(currentUserSkills.seeking || [])].map(s => s.category))];
      if (theirCategory && myCategories.includes(theirCategory)) {
        score += weights.categoryOverlap;
      }

      let completenessBonus = 0;
      if (recommendedUser.avatar && recommendedUser.avatar.type !== 'default' && recommendedUser.avatar.url) {
        completenessBonus += 3;
      }
      score += Math.min(weights.profileCompleteness, completenessBonus);

      if (updatedAt) {
        const skillDate = new Date(updatedAt);
        const now = new Date();
        const daysSinceUpdate = (now - skillDate) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) score += weights.recency;
        else if (daysSinceUpdate < 30) score += weights.recency / 2;
      }

      return Math.min(100, Math.ceil(score));
    };

    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to see recommendations.');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        const fetchOptions = { headers, cache: 'no-store' };

        const timestamp = new Date().getTime();
        const recommendationsUrl = `http://localhost:5000/api/skills/search?offering=true&t=${timestamp}`;

        const [recsResponse, userSkillsResponse] = await Promise.all([
          fetch(recommendationsUrl, fetchOptions),
          fetch('http://localhost:5000/api/skills/my-skills', fetchOptions)
        ]);

        if (!recsResponse.ok) throw new Error(`Failed to fetch recommendations: ${recsResponse.statusText}`);
        if (!userSkillsResponse.ok) throw new Error(`Failed to fetch user skills: ${userSkillsResponse.statusText}`);

        const recommendationsData = await recsResponse.json();
        const userSkillsData = await userSkillsResponse.json();

        let currentUserData = { offering: [], seeking: [] };
        let currentUserId = null;

        if (userSkillsData.success && userSkillsData.data) {
          currentUserData = userSkillsData.data;
          const firstSkill = (currentUserData.offering && currentUserData.offering[0]) || (currentUserData.seeking && currentUserData.seeking[0]);
          if (firstSkill) {
            currentUserId = firstSkill.user;
          }
        }

        const rawRecommendations = recommendationsData.data || recommendationsData || [];

        const filteredRecommendations = currentUserId
          ? rawRecommendations.filter(skill => skill.user._id !== currentUserId)
          : rawRecommendations;

        const scoredRecommendations = filteredRecommendations
          .map(skill => ({
            ...skill,
            matchScore: calculateMatchScore(skill, currentUserData)
          }))
          .sort((a, b) => b.matchScore - a.matchScore);

        setRecommendations(scoredRecommendations);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleBackToBrowse = () => {
    window.history.back();
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Java': 'bg-orange-100 text-orange-800',
      'C/C++': 'bg-blue-100 text-blue-800',
      'Python': 'bg-green-100 text-green-800',
      'MERN': 'bg-purple-100 text-purple-800',
      'Programming': 'bg-blue-100 text-blue-800',
      'Design': 'bg-pink-100 text-pink-800',
      'Data Science': 'bg-green-100 text-green-800',
      'Marketing': 'bg-yellow-100 text-yellow-800',
      'Language': 'bg-red-100 text-red-800',
      'Music': 'bg-teal-100 text-teal-800',
      'Art': 'bg-purple-100 text-purple-800',
      'Business': 'bg-indigo-100 text-indigo-800',
      'Writing': 'bg-gray-100 text-gray-800',
      'Photography': 'bg-cyan-100 text-cyan-800',
      'Fitness': 'bg-lime-100 text-lime-800',
      'Cooking': 'bg-orange-100 text-orange-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MainNavbar />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <MainNavbar />
        <div className="text-center py-10 text-red-500">Error: {error.message || "An unknown error occurred"}</div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-slate-50">
        <MainNavbar />
      <main className="pt-24 max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToBrowse}
                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
              {/* Discover Skills Icon with Deeper Lavender-Purple Gradient */}
              <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-purple-700 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Discover Skills</h1>
                <p className="text-gray-500 text-xs">Personalized recommendations based on your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Grid View */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map(skill => (
              <div key={skill._id} className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 rounded-2xl shadow-lg overflow-hidden 
                transform transition-all duration-300 hover:scale-[1.03] hover:shadow-xl flex flex-col">
                
                <div className="p-5 flex flex-col flex-grow">
                  
                  <div className="flex justify-between items-center mb-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(skill.category)}`}>
                          {skill.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-2 py-0.5 rounded-full">
                          {skill.matchScore > 90 ? <Award className="w-3 h-3 text-amber-500"/> : <Zap className="w-3 h-3 text-purple-600"/>}
                          <span>{skill.matchScore}% Match</span>
                      </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center text-xl shadow font-semibold text-indigo-700">
                      {skill.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{skill.user?.name || 'Anonymous'}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span>{skill.offering?.rating?.toFixed(1) || 'N/A'}</span>
                        <span>({skill.offering?.sessions || 0} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{skill.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{skill.offering?.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-700 mt-auto">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      <span>{skill.offering?.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-600" />
                      <span>{skill.offering?.level || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-2">
                  <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-sm 
                    hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    Book • {skill.offering?.price > 0 ? `$${skill.offering.price}/hr` : 'Free'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>No recommendations found at the moment. Try adding skills you want to learn to your profile!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRecommendations;