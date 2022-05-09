const OnlineUsers = require('../models/OnlineUsers')

const checkOnline = (req, res) => {
    const {username} = req.params
    OnlineUsers.findOne({ username })
    .then(online => {
        if (online) 
            res.status(200).json({ message: 'Found' })
    })
    .catch(err => 
        res.status(404).json({ message: '404' })
    )
}

module.exports = { checkOnline }