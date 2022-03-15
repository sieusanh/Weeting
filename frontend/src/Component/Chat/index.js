import io from 'socket.io-client'
import { useState, useEffect } from 'react'
import { PersonAdd, NotificationsNone, Mood, Send, AttachFile, Image } from '@material-ui/icons'
import { Badge } from '@material-ui/core'
import axios from 'axios'
import { useStore, actions } from '../../store'
import {Container, HeadLine, Title, Icon, 
    TextScreen, TypeBoard, TextInput, 
    SendContainer, UsernameExisted, 
    ToggleNotification, NotificationItem, 
    Accept, Decline} from './StyledComponent'

function Chat() {
    const [alert, setAlert] = useState('')
    const [message, setMessage] = useState('')
    const [invitor, setInvitor] = useState('')
    const [connectAccepted, setConnectAccepted] = useState(true)
    const [inputParagraph, setInputParagraph] = useState('')
    const [toggleNotification, setToggleNotification] = useState(false)
    const [state, dispatch] = useStore()
    const {userId2, chatName, chatAvatar, peerChatId,
         groupChatId, searchChat} = state

    // const [socket, setSocket] = useState(() => {
    //     const initSocket = io('http://localhost:8080')
    //     return initSocket
    // })
    const [socket, setSocket] = useState(null)
    let newSocket
    useEffect(() => {
        // newSocket = io('http://localhost:8080')
        // newSocket = io('http://localhost:8080', {
        //     transports : ['websocket'] 
        // })
        newSocket = io('http://localhost:8080', {  
            cors: {
                origin: "*",
                credentials: true
            },
            transports : ['websocket'] 
        })
        setSocket(newSocket)
        newSocket.emit(
            'Client-send-username', 
            localStorage.getItem('username')
        )
        return () => newSocket.close()
    }, [newSocket])
    
    if (socket){
        // socket.on('Server-send-all', data => {
        //     setMessage(data)
        // })
        // socket.on('Server-send-back', data => {
        //     setMessage(data)
        // })
        // socket.on('Server-send-broadcast', data => {
        //     setMessage(data)
        // })    
        socket.on("connect", () => {
            const transport = socket.io.engine.transport.name; // in most cases, "polling"
            console.log('Transport name: ', transport)
            
            socket.io.engine.on("upgrade", () => {
                const upgradedTransport = socket.io.engine.transport.name; // in most cases, "websocket"
                console.log('Upgraded transport name: ', upgradedTransport)
            })
        })
        socket.on('Fail-connect-Username-in-use', () => {
            setAlert('Username hiện đang sử dụng')
        })
        socket.on('Invite-connect', data => {
            setInvitor(data)
        })
        socket.on('Peer-message', ({fromUsername, message}) => {
            setMessage(message)
        })
        
    }
   
    function addContact(e) {
        e.preventDefault()
    }

    function sendAcceptConnect(e) {
        e.preventDefault()
        socket.emit('Accept-connect', invitor)
    }

    function sendDeclineConnect(e) {
        e.preventDefault()
        socket.emit('Decline-connect', invitor)
    }

    function sendMessage(e) {
        e.preventDefault()
        let chatId
        let accepted = true
        console.log('searchChat: ', searchChat)
        if (searchChat) { 
            console.log('Enter if search chat')
            // Kiểm tra xem trước đó đã connect chưa
            axios.post('/peer/check-chat-exist', {
                userId1: localStorage.getItem('userId'), 
                userId2
            })
            .then(res => {
                if (res.data.message === 'Chat not found') {
                    console.log('Enter Chat not found')
                    setConnectAccepted(false)
                    accepted = false
                    console.log('Chat not found - accepted: ', accepted)
                    // function myPromise(callback) {
                    //     return new Promise((resolve, reject) => {
                    //         callback()
                    //         resolve('yes')
                    //         reject('no')
                    //     })
                    // }
                    // await myPromise(() => socket.emit('Invite-connect', chatName))
                    socket.emit('Invite-connect', chatName)
                    socket.on('Decline-connect', data => {
                        if (data === chatName) 
                            setConnectAccepted(false)
                    })
                    // await myPromise(() => 
                    //     socket.on('Accept-connect', data => {
                    //         if (data === chatName) {
                    //             setConnectAccepted(true)
                    //             axios.post('/peer/create-new-peer-chat', {
                    //                 userId1: localStorage.getItem('userId'), 
                    //                 userId2
                    //             })
                    //             .then(res => {
                    //                 if (res.status === 200){
                    //                     dispatch(actions.setPeerChatId(res.data.peerChatId))
                    //                     chatId = res.data.peerChatId
                    //                 }
                    //             })
                    //         }
                    //     })
                    // )
                    socket.on('Accept-connect', data => {
                        if (data === chatName) {
                            setConnectAccepted(true)
                            axios.post('/peer/create-new-peer-chat', {
                                userId1: localStorage.getItem('userId'), 
                                userId2
                            })
                            .then(res => {
                                if (res.status === 200){
                                    dispatch(actions.setPeerChatId(res.data.peerChatId))
                                    chatId = res.data.peerChatId
                                    accepted = true
                                }
                            })
                        }
                    })
                    console.log('End of Chat not found')
                }
                else {
                    dispatch(actions.setPeerChatId(res.data.peerChatId))
                    chatId = res.data.peerChatId
                }          
            })
            .catch(err => console.log(err.response.data))
        }
        console.log('accepted: ', accepted)
        if (accepted) {
            socket.emit('Peer-message', {
                toUsername: chatName,
                message: inputParagraph
            })
            axios.patch('/peer/push-message', {
                peerChatId: chatId,
                userId: localStorage.getItem('userId'),
                paragraph: inputParagraph
            })
            .then(res => {
                if (res.status === 200) 
                    setMessage(inputParagraph)
            })
            .catch(err => console.log('Loi gi: ', err.response.data))
            console.log('End all')
        }
    }

    return (
        <Container>
            <HeadLine>
                <Title>{chatName}</Title>
                <Icon onClick={addContact}>
                    <PersonAdd />
                </Icon>
                <Icon 
                    style={{marginLeft: '600px'}}
                    onClick={() => 
                        setToggleNotification(!toggleNotification)}
                >
                    {
                        invitor 
                        ? 
                            <Badge badgeContent={1} color="primary">
                                <NotificationsNone />
                            </Badge>
                        :   <NotificationsNone />
                    }
                    
                </Icon>
            </HeadLine>
            <TextScreen>
                {
                    connectAccepted 
                    ? message
                    : `Đang chờ chấp nhận kết nối từ ${chatName}` 
                }
            </TextScreen>
            <TypeBoard>
                <Icon>
                    <Mood />
                </Icon>
                <TextInput 
                    value={inputParagraph}
                    onChange={e => setInputParagraph(e.target.value)}
                />
                <SendContainer>
                    <Icon onClick={sendMessage}>
                        <Send />
                    </Icon>
                    <Icon>
                        <AttachFile />
                    </Icon>
                    <Icon>
                        <Image />
                    </Icon>
                </SendContainer>
            </TypeBoard>
            {alert && 
                <UsernameExisted>
                    {'Tài khoản hiện đang sử dụng'}
                </UsernameExisted>
            }
            {toggleNotification &&
                <ToggleNotification>
                    {invitor && 
                        <NotificationItem>
                            {`${invitor} muốn kết nối với bạn`}
                            <Accept onClick={sendAcceptConnect}>Đồng ý</Accept>
                            <Decline onClick={sendDeclineConnect}>Từ chối</Decline>
                        </NotificationItem>
                    }
                </ToggleNotification>
            }
        </Container>
    )
}

export default Chat