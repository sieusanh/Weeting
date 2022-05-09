const router = require('express').Router()
const {userAuthentication} = require('../middlewares/Authentication')
const { checkChatExist, createNewPeerChat, addUserId2ToPeerChat, 
    queryPeerChat, getPeerList, getPeerInfoList, 
    getPeerInfo, pushMessage } = require('../controllers/peerController')

// GET
router.get('/get-peer-list/:userId', userAuthentication, getPeerList)

router.get('/get-peer-info-list/:userId', userAuthentication, getPeerInfoList)

router.get('/get-peer-info/:peerChatId', userAuthentication, getPeerInfo)

// POST
router.post('/create-new-peer-chat', userAuthentication, createNewPeerChat)

router.post('/check-chat-exist', userAuthentication, checkChatExist)

router.post('/query-peer-chat', userAuthentication, queryPeerChat)

// PATCH

router.patch('/add-userId2', userAuthentication, addUserId2ToPeerChat)

router.patch('/push-message', userAuthentication, pushMessage)

module.exports = router