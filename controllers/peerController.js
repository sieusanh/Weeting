const Peer = require('../models/Peer')
const User = require('../models/User')

const checkChatExist = (req, res) => {
    const {userId1, userId2} = req.body

    Peer.findOne({
        $or: [{userId1, userId2}, {userId1: userId2, userId2: userId1}]
    })
    .then(peer => {
        if (!peer)
            return res.json({ message: '404' })
        return res.json({ peerChatId: peer._doc._id })    
    })
    .catch(err => {
        console.log('Loi: ', err)
        res.status(500).json(err)
    })
}

const createNewPeerChat = (req, res) => {
    const {userId1, chatName} = req.body
    Peer.create({ 
        userId1, 
        userId2: 'chatName:' + chatName
    })
    .then(peer => res.status(200).json({ peerChatId: peer._doc._id }))
    .catch(err => res.status(500).json(err))
}

const addUserId2ToPeerChat = (req, res) => {
    const {peerChatId, userId2} = req.body
    Peer.findByIdAndUpdate(peerChatId, {$set: {userId2} })
    .then(peer => res.status(200).json({message: 'Success'}))
    .catch(err => res.status(500).json(err))
}

const queryPeerChat = (req, res) => {
    Peer.findById(req.body.peerChatId)
    .then(peer => {
        const text = peer._doc.content
        res.status(200).json({text})
    })
    .catch(err => res.status(500).json(err.message))
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

const getPeerInfoList = async (req, res) => {
    try {
        const peerList = await Peer.find({
            $or: [{userId1: req.params.userId}, {userId2: req.params.userId}]
        })
        if (!peerList)
            throw Error('Error happen when find peer list')
        
        const arrayOfPromises = peerList.map(async peer => {
            const preview = peer.content.at(-1) || ''
            let userId2
            if (req.params.userId === peer.userId1) {
                // Handle create new peer chat case
                if (peer.userId2.includes('chatName:')) {
                    const username = 
                        peer.userId2.substring('chatName:'.length)
                    const user = await User.findOne({ username })
                    const {avatar} = user._doc 
                    return {
                        peerChatId: peer._id,
                        preview,
                        username, 
                        avatar
                    }
                }
                userId2 = peer.userId2
            }
            if (req.params.userId === peer.userId2) {
                if (peer.userId1.includes('chatName:')) {
                    const username = 
                        peer.userId1.substring('chatName'.length)

                    const user = await User.findOne({ username })
                    const {avatar} = user._doc 
                    return {
                        peerChatId: peer._id,
                        preview,
                        username, 
                        avatar
                    }
                }
                userId2 = peer.userId1
            }
            const user = await User.findById(userId2)
            if (!user)
                throw Error('Error happen when find user by userId2')

            const {username, avatar} = user._doc 
            return {
                peerChatId: peer._id,
                preview,
                username, 
                avatar
            }
        })
        const peerChatInfoList = await Promise.all(arrayOfPromises)
        
        res.status(200).json({ peerChatInfoList })

    } catch(err) { 
        res.status(500).json(err)
    }
}

const getPeerInfo = async (req, res) => {
    const {peerChatId} = req.params
    
    try {
        const peer = await Peer.findById(peerChatId)
        if (!peer)
            throw Error('Error happen when find peer')

        const userId2 = peer.userId2
        const preview = peer.content.at(-1)
        const user = await User.findById(userId2)
        if (!user)
            throw Error('Error happen when find user by userId2')
        const {username, avatar} = user._doc 

        res.status(200).json({
            peerChatId,
            preview,
            username, 
            avatar
        })

    } catch(err) { 
        console.log('Loi: ', err)
        res.status(500).json(err)
    }
}

const pushMessage = (req, res) => {
    Peer.findByIdAndPushMessage({...req.body})
    .then(result => {
        if (result.side)
            res.status(200).json(result)
            
    })
    .catch(err => res.status(500).json(result.error))
}

module.exports = { checkChatExist, createNewPeerChat, 
    addUserId2ToPeerChat, queryPeerChat, getPeerList, 
    getPeerInfoList, getPeerInfo, pushMessage }