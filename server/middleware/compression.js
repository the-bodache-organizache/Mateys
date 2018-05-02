const router = require('express').Router();
const compression = require('compression');
module.exports = router;

router.use(compression());
