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
        console.log(err)
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
        res.status(200).json({ id, avatar })
    })
    .catch(err => res.json(err))
}

const startNewChat = (req, res) => {
    const {userId1, userId2} = req.params
    Chat.createChat({ userId1, userId2 })
    .then(success => res.status(201).json({ message: 'Success' }))
    .catch(err => {
        const errors = handleErrors(err)
        res.status(500).json(errors)
    })
}

const getAllUser = async (req, res) => {
    const query = req.query.new
    try {
        const users = query 
        ? await User.find().sort({_id: -1}).limit(5) 
        : await User.find()
        for (let index in users) {
            let {password, ...others} = users[index]._doc
            users[index] = others
        }
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json(err)
    }
}

const getUserStats = async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {$project: {month: {$month: "$createdAt"}}},
            {$group: {_id: '$month', total: {$sum: 1}}}
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = {
    updateUserById, deleteUserById, getUserById, getUserByUsername, 
    startNewChat, getAllUser, getUserStats
}