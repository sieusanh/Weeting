'use strict'
const Peer = require('../models/Peer')

const checkChatExist = (req, res) => {
    const {userId1, userId2} = req.body
    Peer.findOne({userId1, userId2})
    .then(peer => {
        if (!peer)
            return res.json({message: 'Chat not found'})
        return res.status(200).json({ peerChatId: chat._doc._id })    
    })
    .catch(err => res.json(err))
}

const createNewPeerChat = (req, res) => {
    const {userId1, userId2} = req.body
    Peer.create({ 
        userId1, 
        userId2, 
        content: [
            {
                side: '1', 
                paragraph: ''
            }, 
            {   side: '2',
                paragraph: ''
            }
        ] 
    })
    .then(peer => {
        console.log(peer._doc)
        res.status(200).json({ peerChatId: peer._doc._id })
    })
    .catch(err => res.status(500).json(err))
}

const queryPeerChat = (req, res) => {
    Peer.findById(req.body.peerChatId)
    .then(peer => {
        const text = peer._doc.content
        res.status(200).json({text})
    })
    .catch(err => res.status(500).json(err))
}

const getPeerList = (req, res) => {
    Peer.find({
        $or: [{userId1: req.params.userId}, {userId2: req.params.userId}]
    })
    .then(peer => {
        const peerChatIdList = [...peer.map(item => item._id)]
        res.status(200).json({ peerChatIdList })
    })
    .catch(err => res.status(500).json(err))
}

const pushMessage = (req, res) => {
    Peer.findByIdAndPushMessage({...req.body})
    .then(peer => res.status(200).json({
        peerChatId: peer._doc._id
    }))
    .catch(err => res.status(500).json('Loi gi: ', err))
}

module.exports = { checkChatExist, createNewPeerChat, queryPeerChat, 
    getPeerList, pushMessage }