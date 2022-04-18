'use strict'
const mongoose = require('mongoose')

const OfflineSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        command: {
            type: String,
            required: true,
        },
        data: {
            fromUsername: {
                type: String,
                required: true
            },
            message: {
                type: String,
            },
            side: {
                type: String
            }
        }
    },  
    {timestamps: true}
)


module.exports = mongoose.model("OfflineReceivers", OfflineSchema)