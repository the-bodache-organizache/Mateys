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
  const room = Object.keys(req.body).join('');
  try {
    const resolvedRoom = await Rooms.create({
      name: room
    });
    res.json(resolvedRoom);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  const room = req.body;
  try {
    const resolvedRoom = await Rooms.update({
      occupancy: room.occupancy
    },
    {
      where: {
        id: room.id,
        returning: true,
        plain: true
      }
    });
    res.json(resolvedRoom);
  } catch (err) {
    next(err);
  }
});
