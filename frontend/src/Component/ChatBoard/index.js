import { useState, useEffect, useContext, useRef, memo } from 'react'
import axios from 'axios'

import { PersonAdd, Mood, Send,
    AttachFile, Image, AccountCircle } 
from '@material-ui/icons'

import { NotificationToChat_Context } 
from '../../Context/NotificationToChat_Context'

import { SocketContext } 
from '../../Context/SocketContext'

import { UserBoardToChat_Context } 
from '../../Context/UserBoardToChat_Context'

import { Container, HeadLine, Avatar, Title, 
    Icon, TextScreen, TypeBoard, TextInput,
    SendContainer, UsernameExisted } 
from './StyledComponent'

function ChatBoard() {
    // console.log('Chat Component')
    const [alert, setAlert] = useState('')
    const [newContactStatus, setNewContactStatus] = useState('')
    const [chatMessage, setChatMessage] = useState([])
    const [inputParagraph, setInputParagraph] = useState('')
	const [newPeerChatId, setNewPeerChatId] = useState('')
    const inputRef = useRef()
    const notificationToChat_Context = useContext(NotificationToChat_Context)
    const { contactInfo } = notificationToChat_Context
    const socket = useContext(SocketContext)
    const userBoardContext = useContext(UserBoardToChat_Context)
    const { peerChatInfo, setNotifyPeerChatId, 
        setNewCreatedPeerChatId } = userBoardContext
    useEffect(() => {
        if (!peerChatInfo.peerChatId)
            return
            
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
        if (!peerChatInfo.contactStatus)
            return

        setNewContactStatus(peerChatInfo.contactStatus)
    }, [peerChatInfo.contactStatus])

    useEffect(() => {
        if (contactInfo.contactStatus === 'Stranger'
        || contactInfo.fromUsername === ''
        || contactInfo.peerChatId === '')
            return
        if (contactInfo.fromUsername ===  peerChatInfo.chatName) {
            setNewPeerChatId(contactInfo.peerChatId)
            setNewContactStatus(contactInfo.contactStatus) 
        }
    }, [contactInfo])

    if (socket) {   
        socket.on('Fail-connect-Username-in-use', () => {
            setAlert('Username hi???n ??ang s??? d???ng')
        })

        socket.off('Peer-message').on('Peer-message', ({ fromUsername, message, side }) => {
            
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
                if (res1.data.id) {
                    axios.post('/peer/check-chat-exist', {
                        userId1: localStorage.getItem('userId'),
                        userId2: res1.data.id
                    })
                    .then(res2 => {
                        if (res2.status === 200) { 
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
                        }
                    })
                }
            })
            .catch(err => console.log(err))
        })
    }

    function addContact(e) {
        e.preventDefault()

        if (!newPeerChatId) {
            axios.post('/peer/create-new-peer-chat', {
                userId1: localStorage.getItem('userId'),
                chatName: peerChatInfo.chatName 
            })
            .then(res => {
                // setPeerChatId(res1.data.peerChatId) // L???i Minimal, re-render UserBoard
                setNewPeerChatId(res.data.peerChatId)
                setNewContactStatus('Wait-for-accept')
                socket.emit('Invite-contact', {
                    toUsername: peerChatInfo.chatName,
                    message: res.data.peerChatId
                })
            })
        } else {
            setNewContactStatus('Wait-for-accept')
            socket.emit('Invite-contact', {
                toUsername: peerChatInfo.chatName,
                message: newPeerChatId
            })
        }
        
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
    
            // setPeerChatId(res1.data.peerChatId) // L???i Minimal, re-render UserBoard
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
                    setNewCreatedPeerChatId(res1.data.peerChatId)
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
                    <Icon onClick={addContact} title = {'Th??m li??n h???'}>
                        <PersonAdd />
                    </Icon>
                }
                {
                    newContactStatus === 'Wait-for-accept'
                    && 
                    <div style={{border: '1px solid', flexGrow: '4'}}>
                        {'??ang ch??? ch???p nh???n'}
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
                    {'T??i kho???n hi???n ??ang s??? d???ng'}
                </UsernameExisted>
            }
        </Container>
    )
}

export default memo(ChatBoard)