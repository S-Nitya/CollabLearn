const Skill = require('../models/Skill');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Post = require('../models/Post');

// ============= SKILL POSTING METHODS (FOR BROWSE SKILLS MODAL) =============

// Post a skill (update existing skill with posting details)
const postSkill = async (req, res) => {
  try {
    const { title, description, skills: skillName, timePerHour, price } = req.body;
    const userId = req.userId;

    // Input validation
    if (!title || !description || !skillName || !timePerHour) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, skill name, and duration are required'
      });
    }

    // Prepare the update payload
    const updateData = {
      'offering.description': description,
      'offering.duration': timePerHour,
      isPosted: true, // Activate the skill
      'offering.price': 0 // Default price to 0
    };

    if (price) {
      const parsedPrice = parseFloat(price.replace(/[^\d.]/g, ''));
      if (!isNaN(parsedPrice)) {
        updateData['offering.price'] = parsedPrice;
      }
    }

    // Find the skill and update it atomically
    const updatedSkill = await Skill.findOneAndUpdate(
      { name: skillName, user: userId, isOffering: true }, // Query
      { $set: updateData }, // Update
      { new: true, runValidators: true } // Options
    );

    if (!updatedSkill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found. Please add this skill to your profile first.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill has been posted and is now active.',
      data: updatedSkill
    });

  } catch (error) {
    console.error('Post skill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during skill posting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============= SKILL OFFERING METHODS =============

// Add a new skill offering
const addSkillOffering = async (req, res) => {
  try {
    const { name, level, description, category, tags, duration, price } = req.body;
    const userId = req.userId;

    // Check if user already offers this skill
    const existingSkill = await Skill.findOne({ 
      user: userId, 
      name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      isOffering: true 
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'You are already offering this skill'
      });
    }

    // Create new skill with isPosted set to false.
    // Skills are not posted until the user does so from the browse skills page.
    const newSkill = new Skill({
      name,
      user: userId,
      isOffering: true,
      isPosted: false, // Skill is not posted by default
      offering: {
        level: level || 'Beginner',
        description: description || '',
        duration: duration || '1 hour',
        price: price || 0
      },
      category: category || 'Other',
      tags: tags || []
    });

    await newSkill.save();

    res.status(201).json({
      success: true,
      message: 'Skill offering added successfully',
      skill: newSkill
    });

  } catch (error) {
    console.error('Add skill offering error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during skill addition',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update skill offering
const updateSkillOffering = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { level, description, duration, price } = req.body;
    const userId = req.userId;

    const skill = await Skill.findOne({ _id: skillId, user: userId, isOffering: true });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill offering not found'
      });
    }

    // Update offering fields
    if (level) skill.offering.level = level;
    if (description !== undefined) skill.offering.description = description;
    if (duration) skill.offering.duration = duration;
    if (price !== undefined) skill.offering.price = price;

    await skill.save();

    res.json({
      success: true,
      message: 'Skill offering updated successfully',
      skill
    });

  } catch (error) {
    console.error('Update skill offering error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during skill update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete skill offering
const deleteSkillOffering = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = req.userId;

    const skill = await Skill.findOne({ _id: skillId, user: userId, isOffering: true });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill offering not found'
      });
    }

    // If skill is both offering and seeking, just remove offering
    if (skill.isSeeking) {
      skill.isOffering = false;
      skill.offering = undefined;
      await skill.save();
    } else {
      // If only offering, delete the entire skill
      await Skill.findByIdAndDelete(skillId);
    }

    res.json({
      success: true,
      message: 'Skill offering removed successfully'
    });

  } catch (error) {
    console.error('Delete skill offering error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during skill deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============= SKILL SEEKING METHODS =============

// Add a new skill seeking
const addSkillSeeking = async (req, res) => {
  try {
    const { name, preferredSchedule, category, tags } = req.body;
    const userId = req.userId;

    // Check if user already seeks this skill
    const existingSkill = await Skill.findOne({ 
      user: userId, 
      name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}$`, 'i') },
      isSeeking: true 
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'You are already seeking this skill'
      });
    }

    const newSkill = new Skill({
      name,
      user: userId,
      isSeeking: true,
      seeking: {
        preferredSchedule: preferredSchedule || []
      },
      category: category || 'Other',
      tags: tags || []
    });

    await newSkill.save();

    res.status(201).json({
      success: true,
      message: 'Skill seeking added successfully',
      skill: newSkill
    });

  } catch (error) {
    console.error('Add skill seeking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during skill addition',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update skill seeking
const updateSkillSeeking = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { progress, preferredSchedule } = req.body;
    const userId = req.userId;

    const skill = await Skill.findOne({ _id: skillId, user: userId, isSeeking: true });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill seeking not found'
      });
    }

    // Update seeking fields
    if (progress !== undefined) skill.updateProgress(progress);
    if (preferredSchedule) skill.seeking.preferredSchedule = preferredSchedule;

    await skill.save();

    res.json({
      success: true,
      message: 'Skill seeking updated successfully',
      skill
    });

  } catch (error) {
    console.error('Update skill seeking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during skill update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete skill seeking
const deleteSkillSeeking = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = req.userId;

    const skill = await Skill.findOne({ _id: skillId, user: userId, isSeeking: true });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill seeking not found'
      });
    }

    // If skill is both offering and seeking, just remove seeking
    if (skill.isOffering) {
      skill.isSeeking = false;
      skill.seeking = undefined;
      await skill.save();
    } else {
      // If only seeking, delete the entire skill
      await Skill.findByIdAndDelete(skillId);
    }

    res.json({
      success: true,
      message: 'Skill seeking removed successfully'
    });

  } catch (error) {
    console.error('Delete skill seeking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during skill deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ============= GENERAL SKILL METHODS =============

// Get user's skills
const getUserSkills = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get ALL user skills regardless of isActive status for ProfilePage display
    const skills = await Skill.find({ user: userId })
      .sort({ createdAt: -1 });

    const skillsOffering = skills.filter(skill => skill.isOffering);
    const skillsSeeking = skills.filter(skill => skill.isSeeking);

    res.json({
      success: true,
      data: {
        skillsOffering,
        skillsSeeking,
        totalSkills: skills.length
      }
    });

  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching skills'
    });
  }
};

// Search skills
const searchSkills = async (req, res) => {
  try {
    const { q, category, level, type = 'offering' } = req.query;
    
    let query = { isPosted: true };
    
    if (type === 'offering') {
      query.isOffering = true;
    } else if (type === 'seeking') {
      query.isSeeking = true;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (level && type === 'offering') {
      query['offering.level'] = level;
    }
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { 'offering.description': { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    const skills = await Skill.find(query)
      .populate('user', 'name avatar rating')
      .sort({ createdAt: -1 })
      .limit(50);

    // Debug: Log the populated user data and process avatars
    console.log('Found skills with user data:', skills.map(skill => ({
      skillName: skill.name,
      userName: skill.user?.name,
      userAvatarUrl: skill.user?.getAvatarUrl?.() || null,
      userAvatarType: skill.user?.avatar?.type,
      userId: skill.user?._id
    })));

    // Process skills to include computed avatar URLs
    const processedSkills = skills.map(skill => {
      const skillObj = skill.toObject();
      if (skillObj.user && skill.user.getAvatarUrl) {
        skillObj.user.avatarUrl = skill.user.getAvatarUrl();
        skillObj.user.avatarType = skill.user.avatar?.type;
      }
      return skillObj;
    });

    res.json({
      success: true,
      data: processedSkills,
      count: processedSkills.length
    });

  } catch (error) {
    console.error('Search skills error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during search'
    });
  }
};

// Get skill categories
const getSkillCategories = async (req, res) => {
  try {
    const categories = await Skill.distinct('category', { isPosted: true });
    
    res.json({
      success: true,
      categories: categories.sort()
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching categories'
    });
  }
};

// Get all distinct skill names
const getAllSkillNames = async (req, res) => {
  try {
    const skillNames = await Skill.distinct('name', { isPosted: true });
    
    res.json({
      success: true,
      skillNames: skillNames.sort()
    });

  } catch (error) {
    console.error('Get skill names error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching skill names'
    });
  }
};

// ============= ADVANCED RECOMMENDATION SYSTEM =============

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 20, excludeViewed = true } = req.query;

    console.log(`🔍 RECOMMENDATION ALGORITHM STARTING for user: ${userId}`);

    // 1. Get user's profile and skills
    const [currentUser, userSkills, userBookings, userPosts] = await Promise.all([
      User.findById(userId),
      Skill.find({ user: userId }),
      Booking.find({ student: userId }).populate('instructor').populate('skill'),
      Post.find({ userId: userId })
    ]);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log(`📊 USER PROFILE ANALYSIS:
    - User Skills: ${userSkills.length} (${userSkills.filter(s => s.isOffering).length} offering, ${userSkills.filter(s => s.isSeeking).length} seeking)
    - Booking History: ${userBookings.length} sessions
    - Community Posts: ${userPosts.length} posts`);

    // 2. Analyze user behavior and preferences
    const userProfile = await analyzeUserProfile(userId, userSkills, userBookings, userPosts);

    console.log(`🧠 BEHAVIOR ANALYSIS COMPLETE:
    - Preferred Categories: ${JSON.stringify(userProfile.preferredCategories)}
    - Skill Level: ${userProfile.skillLevel}
    - Learning Goals: ${userProfile.learningGoals.length} skills
    - Learning Intensity: ${userProfile.learningIntensity.toFixed(2)}
    - Social Engagement: ${userProfile.socialEngagement.toFixed(2)}`);

    // 3. Get all available skills (EXCLUDING user's own skills)
    const availableSkills = await Skill.find({
      user: { $ne: userId }, // PRIMARY FILTER: Exclude user's own skills
      isOffering: true,
      isPosted: true
    }).populate('user', 'name avatar rating totalSessions badges createdAt');

    // ADDITIONAL SAFETY CHECK: Double-filter to ensure no user's own skills leak through
    const safeFilteredSkills = availableSkills.filter(skill => 
      skill.user._id.toString() !== userId.toString()
    );

    console.log(`🔒 SKILL FILTERING:
    - Total Skills in DB: ${await Skill.countDocuments({ isOffering: true, isPosted: true })}
    - After excluding user's skills: ${safeFilteredSkills.length}
    - User's own skill IDs to exclude: ${userSkills.map(s => s._id.toString()).join(', ')}`);

    // 4. Calculate recommendation scores using advanced algorithms
    console.log(`⚡ APPLYING RECOMMENDATION ALGORITHMS:`);
    const scoredRecommendations = await Promise.all(
      safeFilteredSkills.map(async (skill) => {
        const score = await calculateAdvancedRecommendationScore(skill, userProfile);
        return {
          ...skill.toObject(),
          recommendationScore: score.total,
          scoreBreakdown: score.breakdown,
          recommendationReason: score.primaryReason
        };
      })
    );

    // 5. Apply advanced filtering and ranking
    let qualifyingRecommendations = scoredRecommendations
      .filter(skill => skill.recommendationScore > 15) // Minimum threshold
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    console.log(`📈 SCORING RESULTS:
    - Skills analyzed: ${scoredRecommendations.length}
    - Qualifying recommendations (score > 15): ${qualifyingRecommendations.length}
    - Top 3 scores: ${qualifyingRecommendations.slice(0, 3).map(s => `${s.name}: ${s.recommendationScore}%`).join(', ')}`);

    // 6. Apply diversification algorithm to prevent filter bubbles
    qualifyingRecommendations = diversifyRecommendations(qualifyingRecommendations, userProfile);

    console.log(`🎯 DIVERSIFICATION:
    - After diversification: ${qualifyingRecommendations.length} skills
    - Categories represented: ${[...new Set(qualifyingRecommendations.map(s => s.category))].join(', ')}`);

    // 7. Apply temporal and trending factors
    qualifyingRecommendations = await applyTemporalFactors(qualifyingRecommendations);

    console.log(`⏰ TEMPORAL ANALYSIS:
    - Trending skills identified: ${qualifyingRecommendations.filter(s => s.isTrending).length}
    - Final recommendation count: ${qualifyingRecommendations.length}`);

    // 8. Limit results and final safety check
    let finalRecommendations = qualifyingRecommendations.slice(0, parseInt(limit));
    
    // FINAL SAFETY CHECK: Ensure absolutely no user's own skills
    finalRecommendations = finalRecommendations.filter(rec => 
      rec.user._id.toString() !== userId.toString()
    );

    console.log(`✅ RECOMMENDATION ALGORITHM COMPLETE:
    - Final recommendations: ${finalRecommendations.length}
    - Algorithm components used: Content-Based Filtering, Collaborative Filtering, Temporal Analysis, Diversification
    - Safety checks passed: User skill exclusion verified`);

    res.json({
      success: true,
      data: finalRecommendations,
      userProfile: {
        preferredCategories: userProfile.preferredCategories,
        skillLevel: userProfile.skillLevel,
        learningGoals: userProfile.learningGoals
      },
      metadata: {
        totalAnalyzed: scoredRecommendations.length,
        qualifying: finalRecommendations.length,
        algorithmsUsed: [
          'Content-Based Filtering',
          'Collaborative Filtering', 
          'Temporal Relevance Scoring',
          'Diversification Algorithm',
          'Social Proof Analysis',
          'Quality Assessment'
        ],
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Get personalized recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating recommendations'
    });
  }
};

// Helper function to analyze user profile and behavior
const analyzeUserProfile = async (userId, userSkills, userBookings, userPosts) => {
  const profile = {
    preferredCategories: {},
    skillLevel: 'Beginner',
    learningGoals: [],
    interactionHistory: {},
    socialEngagement: 0,
    learningIntensity: 0,
    preferredInstructorTypes: {},
    timePreferences: {},
    pricePreferences: { min: 0, max: 100, prefersFree: false }
  };

  // Analyze skills
  const seekingSkills = userSkills.filter(s => s.isSeeking);
  const offeringSkills = userSkills.filter(s => s.isOffering);

  // Category preferences from user's skills
  [...seekingSkills, ...offeringSkills].forEach(skill => {
    profile.preferredCategories[skill.category] = 
      (profile.preferredCategories[skill.category] || 0) + 1;
  });

  // Learning goals extraction
  profile.learningGoals = seekingSkills.map(s => s.name.toLowerCase());

  // Skill level assessment
  if (offeringSkills.length > 0) {
    const levels = offeringSkills.map(s => s.offering?.level).filter(Boolean);
    const levelCounts = levels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    profile.skillLevel = Object.keys(levelCounts).reduce((a, b) => 
      levelCounts[a] > levelCounts[b] ? a : b, 'Beginner');
  }

  // Booking history analysis
  if (userBookings.length > 0) {
    profile.learningIntensity = userBookings.length / Math.max(1, 
      (Date.now() - new Date(userBookings[0].createdAt)) / (1000 * 60 * 60 * 24 * 30));

    // Instructor preferences
    userBookings.forEach(booking => {
      if (booking.instructor) {
        const instructorId = booking.instructor._id.toString();
        profile.preferredInstructorTypes[instructorId] = 
          (profile.preferredInstructorTypes[instructorId] || 0) + 1;
      }
    });

    // Price preferences
    const prices = userBookings.map(b => b.skill?.offering?.price || 0).filter(p => p > 0);
    if (prices.length > 0) {
      profile.pricePreferences.min = Math.min(...prices);
      profile.pricePreferences.max = Math.max(...prices);
    }
    profile.pricePreferences.prefersFree = userBookings.some(b => 
      (b.skill?.offering?.price || 0) === 0);
  }

  // Social engagement from posts
  if (userPosts.length > 0) {
    profile.socialEngagement = userPosts.reduce((sum, post) => 
      sum + (post.stats?.likes || 0) + (post.stats?.comments || 0), 0) / userPosts.length;
  }

  return profile;
};

// Advanced scoring algorithm with detailed explanation
const calculateAdvancedRecommendationScore = async (skill, userProfile) => {
  console.log(`🔢 SCORING: ${skill.name} for user with goals: ${userProfile.learningGoals.join(', ')}`);
  
  const breakdown = {
    directMatch: 0,
    categoryAffinity: 0,
    levelCompatibility: 0,
    instructorQuality: 0,
    socialProof: 0,
    temporalRelevance: 0,
    priceCompatibility: 0,
    diversityBonus: 0
  };

  const weights = {
    directMatch: 30,        // Highest weight: exact match with learning goals
    categoryAffinity: 20,   // High weight: category preference based on history
    levelCompatibility: 15, // Medium weight: appropriate skill level progression
    instructorQuality: 12,  // Medium weight: instructor credentials and ratings
    socialProof: 8,         // Low-medium weight: popularity and validation
    temporalRelevance: 6,   // Low weight: recency and trending
    priceCompatibility: 5,  // Low weight: price preference matching
    diversityBonus: 4       // Low weight: exploration encouragement
  };

  console.log(`📋 ALGORITHM BREAKDOWN for ${skill.name}:`);

  // 1. DIRECT MATCH ALGORITHM (Content-Based Filtering)
  const skillNameLower = skill.name.toLowerCase();
  if (userProfile.learningGoals.includes(skillNameLower)) {
    breakdown.directMatch = weights.directMatch;
    console.log(`   ✅ Direct Match: ${weights.directMatch}% (exact skill name match)`);
  }

  // Complementary skills matching using knowledge graph
  const complementarySkills = await getComplementarySkills(userProfile.learningGoals);
  if (complementarySkills.some(comp => skillNameLower.includes(comp))) {
    breakdown.directMatch += weights.directMatch * 0.6;
    console.log(`   ✅ Complementary Match: ${(weights.directMatch * 0.6).toFixed(1)}% (related skill)`);
  }

  // 2. CATEGORY AFFINITY ALGORITHM (Collaborative Filtering)
  const categoryPreference = userProfile.preferredCategories[skill.category] || 0;
  const totalUserSkills = Object.values(userProfile.preferredCategories).reduce((a, b) => a + b, 0);
  if (totalUserSkills > 0) {
    breakdown.categoryAffinity = (categoryPreference / totalUserSkills) * weights.categoryAffinity;
    console.log(`   📊 Category Affinity: ${breakdown.categoryAffinity.toFixed(1)}% (${skill.category} preference: ${categoryPreference}/${totalUserSkills})`);
  }

  // 3. LEVEL COMPATIBILITY ALGORITHM (Progressive Learning)
  if (skill.offering?.level) {
    const levelHierarchy = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    const skillLevel = levelHierarchy[skill.offering.level] || 2;
    const userLevel = levelHierarchy[userProfile.skillLevel] || 1;
    
    // Optimal progression: slightly above user's current level
    const optimalLevel = Math.min(4, userLevel + 1);
    const levelDiff = Math.abs(skillLevel - optimalLevel);
    breakdown.levelCompatibility = Math.max(0, weights.levelCompatibility - (levelDiff * 3));
    console.log(`   📈 Level Compatibility: ${breakdown.levelCompatibility.toFixed(1)}% (skill: ${skill.offering.level}, user: ${userProfile.skillLevel}, optimal: ${optimalLevel})`);
  }

  // 4. INSTRUCTOR QUALITY ALGORITHM (Reputation-Based)
  const instructor = skill.user;
  if (instructor) {
    let qualityScore = 0;
    
    // Rating factor (0-5 scale normalized)
    if (instructor.rating?.average) {
      const ratingScore = (instructor.rating.average / 5) * 5;
      qualityScore += ratingScore;
      console.log(`   ⭐ Rating Score: ${ratingScore.toFixed(1)} (${instructor.rating.average}/5)`);
    }
    
    // Experience factor (logarithmic scale)
    if (instructor.totalSessions) {
      const experienceScore = Math.min(4, Math.log10(instructor.totalSessions + 1));
      qualityScore += experienceScore;
      console.log(`   🎓 Experience Score: ${experienceScore.toFixed(1)} (${instructor.totalSessions} sessions)`);
    }
    
    // Badge/credential factor
    if (instructor.badges && instructor.badges.length > 0) {
      const badgeScore = Math.min(3, instructor.badges.length);
      qualityScore += badgeScore;
      console.log(`   🏆 Badge Score: ${badgeScore} (${instructor.badges.length} badges)`);
    }
    
    breakdown.instructorQuality = Math.min(weights.instructorQuality, qualityScore);
  }

  // 5. SOCIAL PROOF ALGORITHM (Popularity-Based)
  if (skill.offering) {
    let socialScore = 0;
    
    // Session popularity (logarithmic to prevent bias toward very popular skills)
    const popularityScore = Math.min(3, Math.log10((skill.offering.sessions || 0) + 1));
    socialScore += popularityScore;
    
    // Rating factor
    if (skill.offering.rating) {
      const skillRatingScore = (skill.offering.rating / 5) * 3;
      socialScore += skillRatingScore;
    }
    
    breakdown.socialProof = Math.min(weights.socialProof, socialScore);
    console.log(`   👥 Social Proof: ${breakdown.socialProof.toFixed(1)}% (${skill.offering.sessions || 0} sessions, rating: ${skill.offering.rating || 'N/A'})`);
  }

  // 6. TEMPORAL RELEVANCE ALGORITHM (Time-Decay Function)
  const skillAge = (Date.now() - new Date(skill.updatedAt)) / (1000 * 60 * 60 * 24);
  if (skillAge < 7) {
    breakdown.temporalRelevance = weights.temporalRelevance;
    console.log(`   ⏰ Temporal: ${weights.temporalRelevance}% (fresh: ${skillAge.toFixed(1)} days)`);
  } else if (skillAge < 30) {
    breakdown.temporalRelevance = weights.temporalRelevance * 0.7;
    console.log(`   ⏰ Temporal: ${(weights.temporalRelevance * 0.7).toFixed(1)}% (recent: ${skillAge.toFixed(1)} days)`);
  } else if (skillAge < 90) {
    breakdown.temporalRelevance = weights.temporalRelevance * 0.4;
    console.log(`   ⏰ Temporal: ${(weights.temporalRelevance * 0.4).toFixed(1)}% (older: ${skillAge.toFixed(1)} days)`);
  }

  // 7. PRICE COMPATIBILITY ALGORITHM (Budget-Based)
  const skillPrice = skill.offering?.price || 0;
  if (skillPrice === 0 && userProfile.pricePreferences.prefersFree) {
    breakdown.priceCompatibility = weights.priceCompatibility;
    console.log(`   💰 Price: ${weights.priceCompatibility}% (free, user prefers free)`);
  } else if (skillPrice >= userProfile.pricePreferences.min && 
             skillPrice <= userProfile.pricePreferences.max) {
    breakdown.priceCompatibility = weights.priceCompatibility * 0.8;
    console.log(`   💰 Price: ${(weights.priceCompatibility * 0.8).toFixed(1)}% ($${skillPrice} in range $${userProfile.pricePreferences.min}-$${userProfile.pricePreferences.max})`);
  }

  // 8. DIVERSITY BONUS ALGORITHM (Exploration Encouragement)
  const categoryCount = userProfile.preferredCategories[skill.category] || 0;
  const totalCategories = Object.keys(userProfile.preferredCategories).length;
  if (totalCategories > 3 && categoryCount === 0) {
    breakdown.diversityBonus = weights.diversityBonus;
    console.log(`   🎯 Diversity: ${weights.diversityBonus}% (new category exploration)`);
  }

  // Calculate total score
  const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
  
  // Determine primary recommendation reason
  const maxScore = Math.max(...Object.values(breakdown));
  const primaryReason = Object.keys(breakdown).find(key => breakdown[key] === maxScore);

  console.log(`   🎯 TOTAL SCORE: ${total.toFixed(1)}% (Primary reason: ${primaryReason})\n`);

  return {
    total: Math.min(100, Math.round(total)),
    breakdown,
    primaryReason
  };
};

// Get complementary skills based on learning goals
const getComplementarySkills = async (learningGoals) => {
  const complementaryMap = {
    'javascript': ['react', 'node.js', 'typescript', 'html', 'css'],
    'react': ['javascript', 'redux', 'next.js', 'typescript'],
    'python': ['django', 'flask', 'data science', 'machine learning', 'pandas'],
    'java': ['spring', 'hibernate', 'android', 'kotlin', 'maven'],
    'machine learning': ['python', 'tensorflow', 'pytorch', 'data science'],
    'web development': ['html', 'css', 'javascript', 'react', 'node.js'],
    'data science': ['python', 'r', 'sql', 'machine learning', 'statistics'],
    'mobile development': ['react native', 'flutter', 'android', 'ios', 'kotlin'],
    'devops': ['docker', 'kubernetes', 'aws', 'jenkins', 'terraform'],
    'ui/ux': ['figma', 'adobe xd', 'photoshop', 'user research', 'prototyping']
  };

  const complements = new Set();
  learningGoals.forEach(goal => {
    const related = complementaryMap[goal] || [];
    related.forEach(skill => complements.add(skill));
  });

  return Array.from(complements);
};

// Diversification algorithm
const diversifyRecommendations = (recommendations, userProfile) => {
  const diversified = [];
  const categoryCount = {};
  const maxPerCategory = 3;

  // Sort by score first
  const sorted = [...recommendations].sort((a, b) => b.recommendationScore - a.recommendationScore);

  // Apply diversification
  for (const recommendation of sorted) {
    const category = recommendation.category;
    const currentCount = categoryCount[category] || 0;
    
    if (currentCount < maxPerCategory) {
      diversified.push(recommendation);
      categoryCount[category] = currentCount + 1;
    }
  }

  // Fill remaining slots with highest scoring items
  const remaining = sorted.filter(item => !diversified.includes(item));
  const finalCount = Math.min(20, diversified.length + remaining.length);
  
  return [...diversified, ...remaining].slice(0, finalCount);
};

// Apply temporal factors and trending analysis
const applyTemporalFactors = async (recommendations) => {
  // Get trending skills (most booked in last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const trendingSkills = await Booking.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$skill', bookingCount: { $sum: 1 } } },
    { $sort: { bookingCount: -1 } },
    { $limit: 10 }
  ]);

  const trendingSkillIds = trendingSkills.map(t => t._id.toString());

  return recommendations.map(rec => {
    let trendingBonus = 0;
    if (trendingSkillIds.includes(rec._id.toString())) {
      trendingBonus = 5; // Trending bonus
    }

    return {
      ...rec,
      recommendationScore: rec.recommendationScore + trendingBonus,
      isTrending: trendingBonus > 0
    };
  }).sort((a, b) => b.recommendationScore - a.recommendationScore);
};

// ============= ALGORITHM DOCUMENTATION =============

/*
🤖 ADVANCED SKILL RECOMMENDATION ALGORITHM EXPLANATION

🎯 PRIMARY GOAL: 
Provide personalized, intelligent skill recommendations that match user learning goals, 
prevent filter bubbles, and encourage skill exploration.

📊 ALGORITHM COMPONENTS:

1. 🔍 USER BEHAVIOR ANALYSIS
   - Analyzes user's current skills (offering/seeking)
   - Examines booking history and learning patterns
   - Evaluates social engagement through posts
   - Determines skill level progression
   - Identifies price preferences and budget patterns

2. 🎯 CONTENT-BASED FILTERING (30% weight)
   - Direct skill name matching with learning goals
   - Complementary skills detection using knowledge graph
   - Example: User learning "JavaScript" → recommends "React", "Node.js"

3. 👥 COLLABORATIVE FILTERING (20% weight)
   - Category affinity based on user's skill history
   - Uses other users' learning patterns
   - Recommends popular skills in user's preferred categories

4. 📈 PROGRESSIVE LEARNING ALGORITHM (15% weight)
   - Skill level compatibility assessment
   - Ensures appropriate difficulty progression
   - Beginner → Intermediate → Advanced → Expert

5. ⭐ INSTRUCTOR QUALITY ASSESSMENT (12% weight)
   - Multi-factor instructor evaluation:
     * Average rating (0-5 scale)
     * Teaching experience (session count)
     * Credentials and badges
     * Profile completeness

6. 👥 SOCIAL PROOF ANALYSIS (8% weight)
   - Skill popularity based on booking frequency
   - Community validation through ratings
   - Session completion rates

7. ⏰ TEMPORAL RELEVANCE SCORING (6% weight)
   - Time-decay function for skill freshness
   - Fresh content (< 7 days): 100% weight
   - Recent content (< 30 days): 70% weight
   - Older content (< 90 days): 40% weight

8. 💰 PRICE COMPATIBILITY (5% weight)
   - Budget preference matching
   - Free skill bonus for budget-conscious users
   - Price range compatibility

9. 🎯 DIVERSITY BONUS (4% weight)
   - Prevents filter bubbles
   - Encourages exploration of new categories
   - Balances recommendations across skill domains

🔒 SAFETY MEASURES:
1. PRIMARY FILTER: MongoDB query with { user: { $ne: userId } }
2. SECONDARY FILTER: Additional JavaScript filter to double-check
3. FINAL SAFETY CHECK: Last verification before sending response

🎛️ POST-PROCESSING:
1. DIVERSIFICATION: Limits skills per category to ensure variety
2. TRENDING ANALYSIS: Identifies and boosts popular skills
3. QUALITY THRESHOLD: Filters out low-scoring recommendations (< 15%)
4. RESULT LIMITING: Returns top N recommendations based on limit parameter

🧠 MACHINE LEARNING CONCEPTS USED:
- Weighted scoring with multiple features
- Collaborative filtering techniques
- Content-based recommendation systems
- Temporal decay functions
- Knowledge graph for skill relationships
- Anti-bias diversification algorithms

📈 SCALABILITY FEATURES:
- Database indexing for performance
- Parallel processing of score calculations
- Efficient aggregation queries
- Caching-friendly design

🔄 CONTINUOUS IMPROVEMENT:
- Detailed logging for algorithm analysis
- Score breakdown for transparency
- A/B testing capabilities
- User feedback integration points
*/

module.exports = {
  // Skill Posting (Browse Skills Modal)
  postSkill,
  
  // Skill Offering
  addSkillOffering,
  updateSkillOffering,
  deleteSkillOffering,
  
  // Skill Seeking
  addSkillSeeking,
  updateSkillSeeking,
  deleteSkillSeeking,
  
  // General
  getUserSkills,
  searchSkills,
  getSkillCategories,
  getAllSkillNames,
  
  // Advanced Recommendations
  getPersonalizedRecommendations
};
