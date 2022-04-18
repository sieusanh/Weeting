'use strict'
const Notify = require('../models/Notify')

const addNotify = async (req, res) => {
    const {username, type} = req.body
    try {
        let userNotify = await Notify.findOne({ username })
        if (!userNotify)
            throw Error('Error happen when find Notify by username')

        switch (type) {
            case 'Invite-connect': {
                const {fromUsername, peerChatId} = req.body
                userNotify.notifyList.push({
                    fromUsername,
                    peerChatId,
                    type
                })
                break
            }
            case 'Invite-contact':
            case 'Accept-contact': {
                const {fromUsername} = req.body
                userNotify.notifyList.push({
                    fromUsername,
                    type
                })
                break
            }
            case 'Peer-message': {
                const {peerChatId} = req.body
                userNotify.notifyList.push({
                    peerChatId,
                    type
                })
                break
            }
            // case 'Peer-message': {
            //     const {peerChatId, preview} = req.body
            //     let existed = false

            //     for (const notify of userNotify._doc.notifyList) {
            //         if (notify.type === 'Peer-message' 
            //         && notify.peerChatId === peerChatId) {
            //             notify.preview = preview
            //             existed = true
            //             break
            //         }
            //     }
                
            //     if (!existed) {
            //         userNotify._doc.notifyList.push({
            //             peerChatId,
            //             type,
            //             preview
            //         })
            //     }
            // }
        }
        
        await userNotify.save()
        res.status(200).json({message: 'Success'})
        
    } catch(err) {
        res.status(500).json(err)
    }
}

const removeNotify = async (req, res) => {
    const {username, type} = req.body
    try {
        let userNotify = await Notify.findOne({ username })
        if (!userNotify)
            throw Error('Error happen when find Notify by username')
            
        switch (type) {
            case 'Invite-connect': {
                const {peerChatId} = req.body
                // userNotify._doc.notifyList = 
                //     userNotify._doc.notifyList.filter(notify => 
                //         (notify.type !== 'Invite-connect' 
                //         || notify.peerChatId !== peerChatId)
                //     )
                userNotify.notifyList.pull({
                    peerChatId,
                    type
                })
                break
            }
            case 'Invite-contact': {
                const {fromUsername} = req.body
                // userNotify._doc.notifyList = 
                //     userNotify._doc.notifyList.filter(notify => 
                //         (notify.type !== 'Invite-contact' 
                //         || notify.fromUsername !== fromUsername)
                //     )
                userNotify.notifyList.pull({
                    fromUsername,
                    type
                })
                break
            }
            case 'Accept-contact': {
                const {fromUsername} = req.body
                // userNotify._doc.notifyList = 
                //     userNotify._doc.notifyList.filter(notify => 
                //         (notify.type !== 'Accept-contact' 
                //         || notify.fromUsername !== fromUsername)
                //     )
                userNotify.notifyList.pull({
                    fromUsername,
                    type
                })
                break
            }
            case 'Peer-message': {
                const {peerChatId} = req.body
                // userNotify._doc.notifyList = 
                //     userNotify._doc.notifyList.filter(notify => 
                //         (notify.type !== 'Peer-message' 
                //         || notify.peerChatId !== peerChatId)
                //     )
                userNotify.notifyList.pull({
                    peerChatId,
                    type
                })
                break
            }
        }

        // await userNotify.save(function(err, doc) {
        //     if (err) 
        //         return console.error(err)
        //     console.log('Document $ inserted succussfully! ', doc)
        // })
        const myNotify = await userNotify.save()
        console.log('userNotify after saved: ', myNotify)
        res.status(200).json({message: 'Success'})

    } catch(err) {
        res.status(500).json(err)
    }
}

const getNotifyListLength = (req, res) => {
    const {username} = req.params
    Notify.findOne({ username })
    .then(userNotify => {
        if (userNotify) {
            const notifyList = userNotify._doc.notifyList.filter(notify => 
                notify.type !== 'Peer-message'
            )
            res.status(200).json({length: notifyList.length})
        }
    })
    .catch(err => res.status(500).json(err))
}

const getNotifyList = (req, res) => {
    const {username} = req.params
    Notify.findOne({ username })
    .then(userNotify => {
        if (userNotify) {
            const notifyList = userNotify._doc.notifyList.filter(notify => 
                notify.type !== 'Peer-message'
            )
            res.status(200).json({notifyList})
        }
    })    
    .catch(err => res.status(500).json(err))
}

const getNotifyPeerList = (req, res) => {
    const {username} = req.params
    Notify.findOne({ username })
    .then(userNotify => {
        if (userNotify) {
            const notifyPeerList = userNotify._doc.notifyList.filter(notify => 
                notify.type === 'Peer-message'
            )
            res.status(200).json({ 
                notifyPeerList: notifyPeerList.map(notify => notify.peerChatId) 
            })
        }
    })    
    .catch(err => res.status(500).json(err))
}

module.exports = { addNotify, removeNotify, getNotifyListLength, 
    getNotifyList, getNotifyPeerList }