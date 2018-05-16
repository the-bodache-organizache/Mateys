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

router.delete('/', async (req, res, next) => {
  const { room } = req.body;
  try {
    const destroyed = await Rooms.destroy({ where: { name: room.name }});
    if (destroyed) res.json({
      room,
      message: 'Deleted successfully'
    });
    else {
      const error = new Error(`No room with that name: ${room.name}`);
      error.status = 400;
      next(error);
    }
  } catch (err) {
    next(err);
  }
})
