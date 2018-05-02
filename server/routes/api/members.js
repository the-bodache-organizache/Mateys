const router = require('express').Router();
const { User } = require('../../db');
const { isAdmin } = require('../../permissions');
module.exports = router;

// GET /api/users
// Hm...should everyone really be able to get these...?
router.get('/', isAdmin, async (req, res, next) => {
  try {
    const members = await User.findAll();
    res.json(members);
  } catch (err) {
    next(err);
  }
});
