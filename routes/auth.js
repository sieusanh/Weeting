
const router = require('express').Router()
const { Signup, Login, Logout, checkUsernameExist } = require('../controllers/authController')
const { userAuthentication } = require('../middlewares/Authentication')

router.post('/signup', Signup)
router.post('/login', Login)
router.get('/logout', userAuthentication, Logout)
router.post('/check-username-exist', checkUsernameExist)

module.exports = router