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

OnlineSchema.pre('save', function(next) {
    // const salt = await bcrypt.genSalt()
    // this.password = await bcrypt.hash(this.password, salt)
    next()
})

OnlineSchema.post('save', function(doc, next) {
    next()
})

// OnlineSchema.statics.push = async function(data) {
//     const online = await this.findOne()
//     if (online) {
//         console.log('enter online')
//         console.log('online obj: ', online._doc)
//         online.onlineUsers.push(data)
//     }
// }

module.exports = mongoose.model("OnlineUsers", OnlineSchema)