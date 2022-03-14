const User = require('../models/User')
const jwt = require('jsonwebtoken')

// const OnlineUsers = []

// handle errors
function handleErrors(err) {
    const errors = {}

    // Login incorrect input value
    if (err.message === 'Incorrect email')
        errors.email = 'This email is not registered'
    
    if (err.message === 'Incorrect password')
        errors.password = 'This password is incorrect'
    
    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'This email is already registered'
        return errors
    }

    // validation errors
    if (!err.errors)
        return errors
        
    const errorKeys = Object.keys(err.errors)
    errorKeys.forEach(fieldName => 
        errors[fieldName] = err.errors[fieldName].message
    )
    return errors
}

// Generating tokens
function generateAccessToken(user) {
    const {id, username} = user
    const accessToken = jwt.sign(
            {id, username},
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: process.env.TOKEN_EXPIRED_IN + "h"}
        )
    return accessToken
}

function Signup(req, res) {
    const { username, password } = req.body 
    User.create({ username, password })
    .then(u => res.status(201).json({ user: u._id }))
    .catch(err => {
        const errors = handleErrors(err)
        res.status(400).json(errors)
    })
}

function Login(req, res) {
    const {username, password} = req.body
    const userObj = {}

    User.login(username, password)
    .then(user => {
        userObj.id = user._doc._id
        userObj.username = user._doc.username
        // userObj.role = user._doc.role
        const accessToken = generateAccessToken(userObj)
        res.cookie('accessToken', accessToken, {httpOnly: true, secure: true})
        res.status(200).json(userObj)
        
        //update online user
        // OnlineUsers.push(userObj.username)
    })
    .catch(err => {
        const errors = handleErrors(err)
        res.status(400).json(errors)
    })
}

function Logout(req, res) {
    res.clearCookie('accessToken')
    res.status(204).json({message: 'See you again!'})
}

const checkUsernameExist = (req, res) => {
    const {username} = req.body
    User.findOne({ username })
    .then(user => {
        if (user === null)
            return res.json('Available')
        res.json('Existed')
    })
    .catch(err => res.json(err))
}

module.exports = {
    Signup, Login, Logout, checkUsernameExist
}
