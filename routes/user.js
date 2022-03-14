const router = require('express').Router()
const {userAuthentication} = require('../middlewares/Authentication')
// const {adminAuthorization} = require('../middlewares/Authorization')
const {updateUserById, deleteUserById, getUserById, 
    getUserByUsername, getAllUser, getUserStats} = require('../controllers/userController')

// UPDATE
router.put('/:id', userAuthentication, updateUserById)

// DELETE
router.delete('/:id', userAuthentication, deleteUserById)

// GET BY ID
// router.post('/find/:id', userAuthentication, adminAuthorization, getUserById)

// GET BY USERNAME
router.get('/find/username/:username', userAuthentication, getUserByUsername)

// GET ALL USER
// router.post('/', userAuthentication, adminAuthorization, getAllUser)

// GET USER STATS
// router.post('/stats', userAuthentication, adminAuthorization, getUserStats)

module.exports = router