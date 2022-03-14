'use strict'
const mongoose = require('mongoose')

const PeerSchema = new mongoose.Schema(
    {  
        userId1: {
            type: String,
            required: true,
        },
        userId2: {
            type: String,
            required: true,
        },
        content: [
            {
                side: {
                    type: String,
                    required: true,
                },
                paragraph: {
                    type: String 
                } 
            },
            {timestamps: true}
        ]
    },  
    // {timestamps: true}
)

PeerSchema.pre('save', function(next) {
    // const salt = await bcrypt.genSalt()
    // this.password = await bcrypt.hash(this.password, salt)
    next()
})

PeerSchema.post('save', function(doc, next) {
    next()
})

PeerSchema.statics.findByIdAndPushMessage = 
        async (peerChatId, userId, paragraph) => {
    try {
        const peer = await this.findById(peerChatId)
        if (data) {
            const updatedPeer = data._doc
            let side
            (updatedPeer.userId1 === userId) && (side = '1')
            (updatedPeer.userId2 === userId) && (side = '2')
            updatedPeer.content.push({
                side,
                paragraph
            })
        }
        const savedPeer = await peer.save()
        return savedPeer
    } catch(err) {
        return err
    }
}

module.exports = mongoose.model("Peer", PeerSchema)