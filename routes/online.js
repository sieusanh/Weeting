const router = require('express').Router()
const {userAuthentication} = require('../middlewares/Authentication')
const { checkOnline } = require('../controllers/onlineController')

// GET
router.get('/check-online/:username', userAuthentication, checkOnline)

module.exports = router