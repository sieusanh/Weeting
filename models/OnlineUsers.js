'use strict'
const mongoose = require('mongoose')

const OnlineSchema = new mongoose.Schema(
    {  
        username: {
            type: String,
            required: true,
            unique: true
        },
        socketId: {
            type: String,
            required: true,
            unique: true
        } 
    },  
    {timestamps: true}
)

module.exports = mongoose.model("OnlineUsers", OnlineSchema)