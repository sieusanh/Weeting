'use strict'
const mongoose = require('mongoose')

const NotifySchema = new mongoose.Schema(
    {  
        username: {
            type: String,
            required: true,
            unique: true
        },
        notifyList: [
            {
                type: {
                    type: String,
                },
                fromUsername: {
                    type: String 
                },
                peerChatId: {
                    type: String
                },
                _id: false
            }
        ]
    },  
    {timestamps: true}
)

module.exports = mongoose.model("Notify", NotifySchema)