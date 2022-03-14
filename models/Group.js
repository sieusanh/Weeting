'use strict'
const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema(
    {  
        content: [{
            userId: {
                type: String,
                required: true,
            },
            paragraph: {
                type: String 
            } 
        }]
    },  
    {timestamps: true}
)

module.exports = mongoose.model("Group", GroupSchema)