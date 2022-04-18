import { useState, useEffect, useContext, useRef, memo } from 'react'
import { PersonAdd, Mood, Send,
    AttachFile, Image, AccountCircle
} from '@material-ui/icons'
import axios from 'axios'
import { NotificationToChat_Context } 
from '../../Context/NotificationToChat_Context'
import { SocketContext } 
from '../../Context/SocketContext'
import { UserBoardToChat_Context } 
from '../../Context/UserBoardToChat_Context'
import { Container, HeadLine, Avatar, Title, 
    Icon, TextScreen, TypeBoard, TextInput,
    SendContainer, UsernameExisted } from './StyledComponent'

function ChatBoard() {
    console.log('Chat Component')
    const [alert, setAlert] = useState('')
    const [newPeerChatId, setNewPeerChatId] = useState('')
    const [newContactStatus, setNewContactStatus] = useState('')
    const [chatMessage, setChatMessage] = useState([])
    const [inputParagraph, setInputParagraph] = useState('')
    const inputRef = useRef()
    const notificationToChat_Context = useContext(NotificationToChat_Context)
    const { contactStatus: notifyContactStatus } = notificationToChat_Context
    const socket = useContext(SocketContext)
    const userBoardContext = useContext(UserBoardToChat_Context)
    const { peerChatInfo, setNotifyPeerChatId } = userBoardContext

    useEffect(() => {
        setNewPeerChatId(peerChatInfo.peerChatId)
        axios.post('/peer/query-peer-chat', {
            peerChatId: peerChatInfo.peerChatId
        })
        .then(res => {
            if (res.status === 200){
                const textArray = res.data.text
                setChatMessage(textArray)
            }
        })
        .catch(err => console.log(err))
    }, [peerChatInfo.peerChatId])

    useEffect(() => {
        console.log('')
        setNewContactStatus(peerChatInfo.contactStatus)
    }, [peerChatInfo.contactStatus])

    useEffect(() => {
        setNewContactStatus(notifyContactStatus)
    }, [notifyContactStatus])

    if (socket) {   
        socket.on('Fail-connect-Username-in-use', () => {
            setAlert('Username hiện đang sử dụng')
        })

        socket.off('Peer-message').on('Peer-message', ({ fromUsername, message, side }) => {
            // Sometimes, the chatName or new chatName is lately set 
            // due to useContext so must wait until the chatName is changed
            if (!peerChatInfo.chatName) 
                return
            
            if (fromUsername === peerChatInfo.chatName) { // wait until the chatName is set
                setChatMessage([
                    ...chatMessage, {
                        side,
                        paragraph: message
                    }
                ])
                return
            } 

            // Update NotifyPeerList 
            axios.get('/user/find/username/' + fromUsername)
            .then(res1 => {
                if (res1.data.id)
                    axios.post('/peer/check-chat-exist', {
                        userId1: localStorage.getItem('userId'),
                        userId2: res1.data.id
                    })
                    .then(res2 => {
                        if (res2.data.peerChatId) 
                            // setNotifyPeerList(prev => {
                            //     // If there has been a notify already in notifyPeerList
                            //     // then update the count property and return, 
                            //     // else push the new notify into the array.
                            //     for (const notify of prev) {
                            //         if (notify.peerChatId === res2.data.peerChatId) {
                            //             notify.count += 1 
                            //             return prev
                            //         }
                            //     }
                            //     prev.push({
                            //         peerChatId: res2.data.peerChatId, 
                            //         count: 1
                            //     })
                            //     return prev
                            // })
                            axios.patch('/notify/add-notify', {
                                username: localStorage.getItem('username'),
                                peerChatId: res2.data.peerChatId, 
                                type: 'Peer-message'
                            })
                            .then(res => {
                                if (res.status === 200)
                                    setNotifyPeerChatId(res2.data.peerChatId)
                            })
                            // setNotifyPeerList(prev => {
                            //     if exist already
                            //     for (const peerChatId of prev) {
                            //         if (peerChatId === res2.data.peerChatId)
                            //             return prev
                            //     }
                            //     prev.push(res2.data.peerChatId)
                            //     return prev
                            // })
                    })
            })
            
        })
    }

    function addContact(e) {
        e.preventDefault()
        socket.emit('Invite-contact', {
            toUsername: peerChatInfo.chatName,
            message: ''
        })
        setNewContactStatus('Wait-for-accept')
    }

    async function sendInviteConnect(e) {
        e.preventDefault()
        if (inputParagraph === '') {
            inputRef.current.focus()
            return
        }
        try {
            const res1 = await axios.post('/peer/create-new-peer-chat', {
                userId1: localStorage.getItem('userId'),
                chatName: peerChatInfo.chatName 
            })
            if (res1.status !== 200)
                throw Error('Error happen when create new peer chat')
    
            // setPeerChatId(res1.data.peerChatId) // Lỗi Minimal, re-render UserBoard
            setNewPeerChatId(res1.data.peerChatId)
            socket.emit('Invite-connect', {
                toUsername: peerChatInfo.chatName,
                message: res1.data.peerChatId
            })
            
            await axios.patch('/peer/push-message', {
                peerChatId: res1.data.peerChatId,
                userId: localStorage.getItem('userId'),
                paragraph: inputParagraph
            })
            .then(res2 => {
                if (res2.status === 200){
                    setChatMessage([
                        ...chatMessage, {
                            side: '1',
                            paragraph: inputParagraph
                        }
                    ])
                }
            })
            .then(fine => {
                setInputParagraph('')
                inputRef.current.focus()
            })
            .catch(err => console.log(err))

        } catch (err) {
            console.log(err)
        }
    }

    function sendMessage(e) {
        e.preventDefault()
        if (inputParagraph === '') {
            inputRef.current.focus()
            return
        }
        //
        axios.patch('/peer/push-message', {
            peerChatId: newPeerChatId,
            userId: localStorage.getItem('userId'),
            paragraph: inputParagraph
        })
        .then(res => {
            if (res.status === 200){
                setChatMessage([
                    ...chatMessage, {
                        side: res.data.side,
                        paragraph: inputParagraph
                    }
                ])
                socket.emit('Peer-message', {
                    toUsername: peerChatInfo.chatName,
                    message: inputParagraph,
                    side: res.data.side
                })
            }
        })
        .then(res => {
            setInputParagraph('')
            inputRef.current.focus()
        })
        .catch(err => console.log(err))
    }

    return (
        <Container>
            <HeadLine>
                {peerChatInfo.chatName && 
                    <Avatar>
                        {peerChatInfo.chatAvatar || <AccountCircle />}
                    </Avatar>
                }
                <Title>{peerChatInfo.chatName}</Title>
                {
                    newContactStatus === 'Stranger'
                    && 
                    <Icon onClick={addContact} title = {'Thêm liên hệ'}>
                        <PersonAdd />
                    </Icon>
                }
                {
                    newContactStatus === 'Wait-for-accept'
                    && 
                    <div style={{border: '1px solid', flexGrow: '4'}}>
                        {'Đang chờ chấp nhận'}
                    </div>
                }
            </HeadLine>
            <TextScreen>
                {chatMessage.map((item, index) => (
                        <div key={index}>
                            <div>{item.side}</div>
                            <div>{item.paragraph}</div>
                        </div>
                    )
                )}
            </TextScreen>
            <TypeBoard>
                <Icon>
                    <Mood />
                </Icon>
                <TextInput
                    ref={inputRef}
                    value={inputParagraph}
                    onChange={e => setInputParagraph(e.target.value)}
                />
                <SendContainer>
                    <Icon onClick={
                            newPeerChatId 
                            ? sendMessage 
                            : sendInviteConnect
                        }
                    >
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
        </Container>
    )
}

export default memo(ChatBoard)