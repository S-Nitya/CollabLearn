const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
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
  getAllSkillNames
} = require('../controllers/skillController');

// ============= SKILL OFFERING ROUTES =============
router.post('/offering', auth, addSkillOffering);
router.put('/offering/:skillId', auth, updateSkillOffering);
router.delete('/offering/:skillId', auth, deleteSkillOffering);

// ============= SKILL SEEKING ROUTES =============
router.post('/seeking', auth, addSkillSeeking);
router.put('/seeking/:skillId', auth, updateSkillSeeking);
router.delete('/seeking/:skillId', auth, deleteSkillSeeking);

// ============= GENERAL SKILL ROUTES =============
router.get('/my-skills', auth, getUserSkills);
router.get('/search', searchSkills);
router.get('/categories', getSkillCategories);
router.get('/names', getAllSkillNames);

module.exports = router;