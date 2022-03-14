const router = require('express').Router()
const {userAuthentication} = require('../middlewares/Authentication')
const { checkChatExist, createNewPeerChat, queryPeerChat, 
    getPeerList, pushMessage } = require('../controllers/peerController')

// GET
router.get('/get-peer-list/:userId', userAuthentication, getPeerList)

// POST
router.post('/create-new-peer-chat', userAuthentication, createNewPeerChat)

router.post('/check-chat-exist', userAuthentication, checkChatExist)

router.post('/query-peer-chat', userAuthentication, queryPeerChat)

router.patch('/push-message', userAuthentication, pushMessage)

module.exports = router