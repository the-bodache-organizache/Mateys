const router = require('express').Router();
const { Rooms } = require('../../db');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const rooms = await Rooms.findAll();
    res.json(rooms);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { room } = req.body;
  try {
    const resolvedRoom = await Rooms.create(room);
    res.json(resolvedRoom);
  } catch (err) {
    next(err);
  }
});
