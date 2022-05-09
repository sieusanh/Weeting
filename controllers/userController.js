'use strict'
const User = require('../models/User')

const updateUserById = async (req, res) => {
    const {accessToken, ...others} = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: others}, {new: true})
        res.status(200).json(updatedUser)
    } catch(err) {
        res.status(500).json(err)
    }
}

const deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...')
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).json({message: 'User not found'})
        const {password, ...others} = user._doc
        res.status(200).json(others)
    } catch(err) {
        res.json(err)
    }
}

const getUserByUsername = (req, res) => {
    const {username} = req.params
    User.findOne({ username })
    .then(user => {
        if (!user)
            return res.json({message: '404'})
        const {_id: id, avatar} = user._doc
        res.json({ id, avatar })
    })
    .catch(err => res.json(err))
}

const addContact = async (req, res) => {
    const {userId, contactUsername} = req.body
    try {
        const user = await User.findById(userId)
        const contact_user = await User.findOne({ 
            username: contactUsername 
        })
        if (user && contact_user) 
            user._doc.contacts.push(contact_user._doc._id)
        await user.save()
        res.status(200).json({message: 'Success'})
    } catch (err) {
        res.status(500).json(err)
    }
}

const getContactList = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
    
        if (!user)
            throw Error('Error happen when find user')
        
        const arrayOfPromises = user._doc.contacts.map(async userId => {
            const contactUser = await User.findById(userId)

            if (!contactUser)
                throw Error('Error happen when find contact user')

            const {username, avatar} = contactUser._doc
            return {
                username, 
                avatar
            }
        })
        const contactList = await Promise.all(arrayOfPromises)
        
        res.status(200).json({ contactList })

    } catch(err) { 
        res.status(500).json(err)
    }
}



module.exports = {
    updateUserById, deleteUserById, getUserById, getUserByUsername, 
    addContact, getContactList
}