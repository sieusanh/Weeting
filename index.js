const http = require('http')
const express = require('express')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const peerRoute = require('./routes/peer')
// const {OnelineUsers} = require('./controllers/authController')
// const OnlineUsers = []
const OnlineUsers = require('./models/OnlineUsers')

// csrf protection
const csrf = require('csurf')
// session management using cookies
const session = require('express-session')

const csrfProtection = csrf({ cookie: true })


const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true // httpOnly is true by default
    }
}))
dotenv.config()

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })
// const io = new Server(httpServer)

mongoose
    .connect(process.env.MONGO_URL)
    .then(result => {
        console.log('Connect database successfully')
        httpServer.listen(process.env.PORT, () => console.log('Server is running'))
    })
    .catch(err => console.log(err))

// Development
app.get('/', csrfProtection, (req, res) =>
 res.render('/frontend/public/index.html', { csrfToken: req.csrfToken() }))

// Deployment
// app.get('/', (req, res) => res.render('index.html'))
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/peer', peerRoute)


let count = 0
io.on('connection', socket => {
    // server tạo biến socket 
    // để quản lý kết nối của mỗi client connect vào
    
    //
    socket.on('disconnect', () => {
        OnlineUsers.deleteOne({
            username: socket.username
        })
        .then(deleted => {
            console.log(socket.username + ' ngat ket noi!')
            console.log('count: ', --count)
            socket.username = null
        })
        // const i = OnlineUsers.indexOf(socket.Username)
        // OnlineUsers.splice(i, 1)
        
    })
    //
    console.log('Connected User: ', socket.id)
    console.log('count: ', ++count)
    //
    socket.on('Client-send-data', data => {
        console.log('data: ', data)

        // Server send all data
        // io.sockets.emit('Server-send-all', data + ' from client ' + socket.id)

        // Server send to specified socket id
        // io.to('socket-id').emit
        // io.to(socket.id).emit('Server-send-back', data)

        // Server send back to this socket
        // socket.emit('Server-send-back', data)

        // Server send broadcast
        socket.broadcast.emit('Server-send-broadcast', 
            data + ' from client ' + socket.id)
    })

    socket.once('Client-send-username', data => {
        OnlineUsers.findOne({ username: data })
        .then(user => {
            if (user)
                socket.emit('Fail-connect-Username-in-use')
            else {
                socket.username = data
                OnlineUsers.create({
                    username: data,
                    socketId: socket.id
                })
            }
        })
        .catch(err => console.log(err))
    })
    
    socket.on('Invite-connect', data => {
        console.log('Invite-connect/socket.username: ', socket.username)
        // io.to(data).emit('Invite-connect', socket.Username)
        OnlineUsers.findOne({ username: data })
        .then(user => {
            if (user)
                io.to(user._doc.socketId).emit('Invite-connect', socket.username)
        })
        .catch(err => console.log(err))
    })
    socket.on('Decline-connect', data => {
        OnlineUsers.findOne({ username: data })
        .then(user => {
            if (user)
                io.to(user._doc.socketId).emit('Decline-connect', socket.username)
        })
        .catch(err => console.log(err))
    })
    socket.on('Accept-connect', data => {
        OnlineUsers.findOne({ username: data})
        .then(user => {
            if (user)
                io.to(user._doc.socketId).emit('Accept-connect', socket.username)
        })
        .catch(err => console.log(err))
    })
    socket.on('Peer-message', ({toUsername, message}) => {
        OnlineUsers.findOne({ username: toUsername })
        .then(user => {
            if (user)
                io.to(user._doc.socketId).emit('Peer-message', {
                    fromUsername: socket.username,
                    message
                })
        })
        .catch(err => console.log(err))
    })  
})

