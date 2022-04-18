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
            //required: false
        },
        content: [
            {
                side: {
                    type: String,
                },
                paragraph: {
                    type: String 
                },
                // {timestamps: true},
                _id: false
            }
        ]
    },  
    // {timestamps: true}
)

PeerSchema.pre('save', function(next) {
    next()
})

PeerSchema.post('save', function(doc, next) {
    next()
})

PeerSchema.statics.findByIdAndPushMessage = async function ({peerChatId, userId, paragraph}) {   
    try {
        const updatedPeer = await this.findById(peerChatId)
        let side = '1'
        if (updatedPeer) {
            if (updatedPeer._doc.userId2 === userId) 
                side = '2'
            updatedPeer._doc.content.push({
                side,
                paragraph
            })
        }
        // const savedPeer = await updatedPeer.save()
        // return savedPeer
        await updatedPeer.save()
        return {side}

    } catch(err) {
        return err
    }
    
}

module.exports = mongoose.model("Peer", PeerSchema)