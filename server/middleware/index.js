const router = require('express').Router()
module.exports = router

router.use(require('./logging'))
router.use(require('./security'))
router.use(require('./body-parsing'))
router.use(require('./compression'))
router.use(require('./session'))
router.use(require('./static'))
