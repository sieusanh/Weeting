const User = require('../models/User')
const Notify = require('../models/Notify')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


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

async function Signup(req, res) {
    const { username, password } = req.body 
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({ 
            username, 
            password: hashedPassword
        })
        if (!user)
            throw Error('Error happen when create user')
        
        await Notify.create({ 
            username,
            notifyList: []
        })

        res.status(201).json({ user: user._id })
        
    } catch(err) {
        const errors = handleErrors(err)
        res.status(400).json(errors)
    }
}

function Login(req, res) {
    const {username, password} = req.body

    User.login(username, password)
    .then(user => {
        const accessToken = generateAccessToken({
            id: user._doc._id,
            username: user._doc.username
        })
        res.cookie('accessToken', accessToken, {httpOnly: true, secure: true})
        res.status(200).json({
            id: user._doc._id,
            username: user._doc.username
        })
    })
    .catch(err => {
        console.log('Loi: ', err)
        const errors = handleErrors(err)
        res.status(400).json(errors)
    })
}

function Logout(req, res) {
    res.clearCookie('accessToken')
    res.clearCookie('connect.sid')
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
