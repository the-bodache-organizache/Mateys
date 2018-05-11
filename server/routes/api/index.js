const router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/rooms', require('./rooms'));

router.use((req, res, next) => {
  const err = new Error('API route not found');
  err.status = 404;
  next(err);
});
