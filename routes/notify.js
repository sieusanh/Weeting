const router = require('express').Router()
const {userAuthentication} = require('../middlewares/Authentication')
const { addNotify, removeNotify, getNotifyListLength, 
    getNotifyList, getNotifyPeerList } = require('../controllers/notifyController')

// UPDATE
router.patch('/add-notify', userAuthentication, addNotify)

router.patch('/remove-notify', userAuthentication, removeNotify)

// GET
router.get('/get-notify-list-length/:username', userAuthentication, getNotifyListLength)

router.get('/get-notify-list/:username', userAuthentication, getNotifyList)

router.get('/get-notify-peer-list/:username', userAuthentication, getNotifyPeerList)

module.exports = router