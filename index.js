
const express = require('express'),
    { Server } = require('socket.io'),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    cookieParser = require('cookie-parser'),

    authRoute = require('./routes/auth'),
    userRoute = require('./routes/user'),
    peerRoute = require('./routes/peer'),
    notifyRoute = require('./routes/notify'),
    onlineRoute = require('./routes/online'),

    OnlineUsers = require('./models/OnlineUsers'),
    OfflineReceivers = require('./models/OfflineReceivers'),
    User = require('./models/User'),
    http = require('http'),

    // csrf protection
    csrf = require('csurf'),
    // session management using cookies
    session = require('express-session'),

    csrfProtection = csrf({ cookie: true }),
    cors = require('cors')

dotenv.config()

const app = express()
app.use(cors({
    // origin: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
    origin: `http://${process.env.HOSTNAME}:9090`,
    // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}))
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

async function connectDatabase() {
    await mongoose.connect(process.env.MONGO_URL)
        .then(result => 
            console.log('Connect database successfully')
        )
        .catch(err => console.log(err))
}

connectDatabase()

const httpServer = http.createServer(app)

httpServer.listen(process.env.PORT || 9090, () => console.log('Server is working...'))
const io = new Server(httpServer)

// Development
// app.get('/', csrfProtection, (req, res) =>
//     res.render('/frontend/public/index.html', {
//         csrfToken: req.csrfToken()
//     })
// )

// Deployment
app.get('/', csrfProtection, (req, res) => 
    res.render('index.html', { 
        csrfToken: req.csrfToken() 
    })
)
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/peer', peerRoute)
app.use('/notify', notifyRoute) 
app.use('/online-user', onlineRoute)

let count = 0
io.on('connection', socket => {
    // server tạo biến socket 
    // để quản lý kết nối của mỗi client connect vào

    const transport = socket.conn.transport.name; // in most cases, "polling"
    socket.conn.on("upgrade", () => {
        const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
        console.log('Upgraded transport name: ', upgradedTransport)
    })

    //
    socket.on('disconnect', async () => {
        console.log('Bye username: ', socket.username)
        const date = new Date()
        const timeObj = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        }
        const user = await User.findOne({ username: socket.username })
        if (!user)
            return
        // user._doc.contacts.forEach(async userId => {
        //     const contactUser = await User.findById(userId)

        //     if (!contactUser)
        //         throw Error('Error happen when find contact user')

        //     const {username} = contactUser._doc
            
        //     const onlineUser = await OnlineUsers.findOne({ username })
        
        //     if (onlineUser) { //
        //         io.to(onlineUser._doc.socketId).emit('Notify-offline', {
        //             fromUsername: socket.username,
        //             message: timeObj.year
        //         })
        //         return
        //     }
        //     // 
        //     console.log('Offline username: ', socket.username)
        //     await OfflineReceivers.create({
        //         username,
        //         command: 'Notify-offline',
        //         data: {
        //             fromUsername: socket.username,
        //             message: timeObj.year
        //         }
        //     })
        // })

        for (const userId of user._doc.contacts) {

            const contactUser = await User.findById(userId)

            if (!contactUser)
                continue

            const {username} = contactUser._doc
            
            const onlineUser = await OnlineUsers.findOne({ username })
        
            if (onlineUser) { //
                io.to(onlineUser._doc.socketId).emit('Notify-offline', {
                    fromUsername: socket.username,
                    message: timeObj.year
                })
            }
            // else {
            //     console.log('Offline username: ', socket.username)
            //     await OfflineReceivers.create({
            //         username,
            //         command: 'Notify-offline',
            //         data: {
            //             fromUsername: socket.username,
            //             message: timeObj.year
            //         }
            //     })
            // }
        }
 
        await OnlineUsers.deleteOne({
            username: socket.username
        })
        .then(deleted => {
            console.log(socket.username + ' ngat ket noi!')
            console.log('count: ', --count)
            socket.username = null
        })
    })
    //
    console.log('Connected User: ', socket.id)
    console.log('count: ', ++count)

    socket.on('Notify-online', async ({fromUsername}) => {
        const existed_user = await OnlineUsers.findOne({ username: fromUsername })
        if (existed_user) { 
            socket.emit('Fail-connect-Username-in-use')
            return
        }
                
        socket.username = fromUsername
        await OnlineUsers.create({
            username: fromUsername,
            socketId: socket.id
        })

        // 
        const date = new Date()
        const timeObj = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        }
        const user = await User.findOne({ username: fromUsername })
        // await user._doc.contacts.forEach(async userId => {
        //     const contactUser = await User.findById(userId)

        //     if (!contactUser)
        //         throw Error('Error happen when find contact user')

        //     const {username} = contactUser._doc
            
        //     const onlineUser = await OnlineUsers.findOne({ username })
            
        //     if (onlineUser) { // 
        //         io.to(onlineUser._doc.socketId).emit('Notify-online', {
        //             fromUsername: socket.username,
        //             message: timeObj.year
        //         })
        //         return
        //     }
        //     // 
        //     await OfflineReceivers.create({
        //         username,
        //         command: 'Notify-online',
        //         data: {
        //             fromUsername: socket.username,
        //             message: timeObj.year
        //         }
        //     })
        // })

        if (!user)
            return

        // Send Notify-online to all contacted user
        const onlineUsers = []
        for (const userId of user._doc.contacts) {
            const contactUser = await User.findById(userId)

            if (!contactUser)
                continue

            const {username} = contactUser._doc
            
            const onlineUser = await OnlineUsers.findOne({ username })
            
            if (onlineUser) { //
                io.to(onlineUser._doc.socketId).emit('Notify-online', {
                    fromUsername: socket.username,
                    message: timeObj.year
                })

                onlineUsers.push(username)
            }
            // else {
            //     await OfflineReceivers.create({
            //         username,
            //         command: 'Notify-online',
            //         data: {
            //             fromUsername: socket.username,
            //             message: timeObj.year
            //         }
            //     })
            // }
        }

        // Send online contacted users back to this user
        socket.emit('Initial-online-users', {onlineUsers})
        
        //
        const receiverList = await OfflineReceivers.find({ username: fromUsername })
        if (receiverList) {
            receiverList.forEach(receiver => {
                socket.emit(receiver._doc.command, receiver._doc.data)
            })
            await OfflineReceivers.deleteMany({ username: fromUsername })
        }
    })

    async function sendData(socket, toUsername, message, command) {
        const user = await OnlineUsers.findOne({ username: toUsername })
        
        if (user) { // online
            io.to(user._doc.socketId).emit(command, {
                fromUsername: socket.username,
                message
            })
            return
        }
        // offline
        await OfflineReceivers.create({
            username: toUsername,   
            command,
            data: {
                fromUsername: socket.username,
                message
            }
        })
    }

    socket.on('Invite-connect', ({toUsername, message}) => {
        sendData(socket, toUsername, message, 'Invite-connect')
    })

    socket.on('Invite-contact', ({toUsername, message}) => {
        sendData(socket, toUsername, message, 'Invite-contact')
    })

    socket.on('Accept-contact', ({toUsername, message}) => {
        sendData(socket, toUsername, message, 'Accept-contact')
    })

    socket.on('Peer-message', async ({ toUsername, message, side }) => {
        const user = await OnlineUsers.findOne({ username: toUsername })
       
        if (user) { // online
            io.to(user._doc.socketId).emit('Peer-message', {
                fromUsername: socket.username,
                message,
                side
            })
            return
        }
        // offline
        await OfflineReceivers.create({
            username: toUsername,
            command: 'Peer-message',
            data: {
                fromUsername: socket.username,
                message,
                side
            }
        })
    })
})
