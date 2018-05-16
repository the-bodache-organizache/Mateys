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

router.delete('/:id', async (req, res, next) => {
  try {
    const destroyed = await Rooms.destroy({ where: { id: req.params.id }});
    if (destroyed) res.json({
      message: 'Deleted successfully'
    });
    else {
      const error = new Error(`No room with that id`);
      error.status = 400;
      next(error);
    }
  } catch (err) {
    next(err);
  }
})
