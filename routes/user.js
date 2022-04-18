const router = require('express').Router()
const {userAuthentication} = require('../middlewares/Authentication')
// const {adminAuthorization} = require('../middlewares/Authorization')
const {
    updateUserById, deleteUserById, getUserById, getUserByUsername, 
    addContact, getContactList, getAllUser, getUserStats
} = require('../controllers/userController')

// UPDATE
router.put('/:id', userAuthentication, updateUserById)

router.patch('/add-contact', userAuthentication, addContact)

// DELETE
router.delete('/:id', userAuthentication, deleteUserById)

// GET BY ID
// router.post('/find/:id', userAuthentication, adminAuthorization, getUserById)

// GET BY USERNAME
router.get('/find/username/:username', userAuthentication, getUserByUsername)

// GET CONTACT LISt
router.get('/get-contact-list/:userId', userAuthentication, getContactList)

// GET ALL USER
// router.post('/', userAuthentication, adminAuthorization, getAllUser)

// GET USER STATS
// router.post('/stats', userAuthentication, adminAuthorization, getUserStats)

module.exports = router