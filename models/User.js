'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema(
    {  
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String, 
            required: true,
            minLength: 6
        },
        avatar: {
            type: String
        },
        contacts: [{
            type: String // id
        }]
    },  
    {timestamps: true}
)

UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.post('save', function(doc, next) {
    next()
})

// static method to login user
UserSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username })
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) 
            return user
        throw Error('Incorrect password')
    }
    throw Error('Incorrect email')
}

module.exports = mongoose.model("User", UserSchema)