import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { NotificationsNone } from '@material-ui/icons'
import { Badge } from '@material-ui/core'
import { SocketContext } from '../../Context/SocketContext'
import { NotificationToChat_Context } 
from '../../Context/NotificationToChat_Context'
import { NotificationToUserBoard_Context } 
from '../../Context/NotificationToUserBoard_Context'
import {Container, Icon, NotificationBoard, 
    NotificationItem, Confirmation, Accept, 
    Decline} from './StyledComponent'

function NotificationButton({toggle}) {
    console.log('NotificationButton Component')
    const socket = useContext(SocketContext)
    const chatContext = 
        useContext(NotificationToChat_Context)
    const userBoardContext = 
        useContext(NotificationToUserBoard_Context)
    
    const [notifyCount, setNotifyCount] = useState(0)
    const [notifyList, setNotifyList] = useState([])
    const { setContactStatus } = chatContext
    const { notifyContactList, setNotifyPeerChatId, 
        setNotifyContactList } = userBoardContext
    useEffect(() => {
        axios.get('/notify/get-notify-list-length/' + 
            localStorage.getItem('username')
        )
        .then(res => {
            setNotifyCount(res.data.length)
        })
    }, [])
    
    useEffect(() => {
        axios.get('/notify/get-notify-list/' + 
            localStorage.getItem('username')
        )
        .then(res => {
            setNotifyList(res.data.notifyList)
        })
    }, [notifyCount])
    console.log('notifyList: ', notifyList)

    if (socket) {
        socket.off('Invite-contact').on('Invite-contact', ({fromUsername, message}) => {
            // setNotifyList(prev => [
            //     ...prev, {
            //         type: 'Invite-contact',
            //         fromUsername
            //     }
            // ])
            axios.patch('/notify/add-notify', {
                username: localStorage.getItem('username'),
                fromUsername,
                type: 'Invite-contact'
            })
            .then(res => {
                if (res.status === 200)
                    setNotifyCount(prev => prev + 1)
            })
            .catch(err => console.log(err))
        })
        
        socket.off('Accept-contact').on('Accept-contact', ({fromUsername, message}) => {
            axios.patch('/user/add-contact', {
                userId: localStorage.getItem('userId'),
                contactUsername: fromUsername
            })
            .then(res1 => {
                if (res1.status === 200) {
                    // setNotifyList(prev => [
                    //     ...prev, {
                    //         type: 'Accept-contact',
                    //         fromUsername,
                    //     }   
                    // ])
                    axios.patch('/notify/add-notify', {
                        username: localStorage.getItem('username'),
                        fromUsername,
                        type: 'Accept-contact'
                    })
                    .then(res2 => {
                        if (res2.status === 200) {
                            setNotifyCount(prev => prev + 1)
                            setContactStatus('Friend')
                            setNotifyContactList(!notifyContactList)
                        }
                    })
                }
            })
        })
    
        socket.off('Invite-connect').on('Invite-connect', ({fromUsername, message}) => {
            // setNotifyList(prev => [
            //     ...prev, {
            //         type: 'Invite-connect',
            //         fromUsername,
            //         peerChatId: message
            //     }
            // ])
            axios.patch('/notify/add-notify', {
                username: localStorage.getItem('username'),
                fromUsername,
                type: 'Invite-connect',
                peerChatId: message
            })
            .then(res => {
                if (res.status === 200)
                    setNotifyCount(prev => prev + 1)
            })
        })
    }

    async function acceptConnect(e, invitePeerChatId) {
        e.preventDefault()
        try {
            const res1 = await axios.patch('/peer/add-userId2', {
                peerChatId: invitePeerChatId,
                userId2: localStorage.getItem('userId')
            })

            if (res1.status !== 200)
                throw Error('Error happen when add userId2')

            // setNotifyPeerList(prev => [
                //     ...prev, {
                //         peerChatId: invitePeerChatId, 
                //         count: 1
                //     }
                // ])
            await axios.patch('/notify/add-notify', {
                username: localStorage.getItem('username'),
                peerChatId: invitePeerChatId, 
                type: 'Peer-message'
            })
            .then(res2 => {
                if (res2.status === 200)
                    setNotifyPeerChatId(invitePeerChatId)
            })
            
                // setNotifyList(
                //     notifyList.filter(notify =>
                //         !notify.peerChatId ||
                //         notify.peerChatId !== invitePeerChatId
                //     )
                // )

            await axios.patch('/notify/remove-notify', {
                username: localStorage.getItem('username'),
                peerChatId: invitePeerChatId,
                type: 'Invite-connect'
            })
            .then(res3 => {
                if (res3.status === 200)
                    setNotifyCount(prev => 
                        prev === 0 ? 0 : prev - 1)
            })

        } catch(err) {
            console.log(err)
        }
    }


    function declineConnect(e, invitePeerChatId) {
        e.preventDefault()

        // setNotifyList(
        //     notifyList.filter(notify =>
        //         !notify.peerChatId ||
        //         notify.peerChatId !== invitePeerChatId
        //     )
        // )

        axios.patch('/notify/remove-notify', {
            username: localStorage.getItem('username'),
            peerChatId: invitePeerChatId,
            type: 'Invite-connect'
        })
        .then(res => {
            if (res.status === 200)
                setNotifyCount(prev => 
                    prev === 0 ? 0 : prev - 1)
        })
    }

    async function acceptContact(e, fromUsername) {
        e.preventDefault()
        await axios.patch('/user/add-contact', {
            userId: localStorage.getItem('userId'),
            contactUsername: fromUsername
        })
        .then(res => {
            if (res.status === 200) {
                socket.emit('Accept-contact', {
                    toUsername: fromUsername,
                    message: '' 
                })
            }
        })
        // setNotifyList(
                //     notifyList.filter(notify =>
                //         notify.fromUsername !== fromUsername
                //     )
                // )
        await axios.patch('/notify/remove-notify', {
            username: localStorage.getItem('username'),
            fromUsername,
            type: 'Invite-contact'
        })
        .then(res => {
            if (res.status === 200) {
                setNotifyCount(prev => 
                    prev === 0 ? 0 : prev - 1)
                setNotifyContactList(!notifyContactList)
            }
        })
    }

    function declineContact(e, fromUsername) {
        e.preventDefault() 
        // setNotifyList(
        //     notifyList.filter(notify =>
        //         notify.fromUsername !== fromUsername
        //     )
        // )
        axios.patch('/notify/remove-notify', {
            username: localStorage.getItem('username'),
            fromUsername,
            type: 'Invite-contact'
        })
        .then(res => {
            if (res.status === 200)
                setNotifyCount(prev => 
                    prev === 0 ? 0 : prev - 1)
        })
    }

    function removeNotify(e, fromUsername) {
        e.preventDefault() 

        // setNotifyList(
        //     notifyList.filter(notify =>
        //         notify.fromUsername !== fromUsername
        //     )
        // )
        axios.patch('/notify/remove-notify', {
            username: localStorage.getItem('username'),
            fromUsername,
            type: 'Accept-contact'
        })
        .then(res => {
            if (res.status === 200)
                setNotifyCount(prev => 
                    prev === 0 ? 0 : prev - 1)
        })
    }

    function renderNotificationItem(notify, index) {
        switch (notify.type) {
            case 'Invite-connect':
                return (
                    <NotificationItem key={index}>
                        {`${notify.fromUsername} muốn kết nối với bạn`}
                        <Confirmation>
                            <Accept 
                                onClick={e => acceptConnect(e, notify.peerChatId)}
                            >
                                Đồng ý
                            </Accept>
                            <Decline 
                                onClick={e => declineConnect(e, notify.peerChatId)}
                            >
                                Từ chối
                            </Decline>
                        </Confirmation>
                    </NotificationItem>
                )
            case 'Invite-contact':
                return (
                    <NotificationItem key={index}>
                        {`${notify.fromUsername} muốn thêm liên hệ với bạn`}
                        <Confirmation>
                            <Accept 
                                onClick={e => acceptContact(e, notify.fromUsername)}
                            >
                                Đồng ý
                            </Accept>
                            <Decline 
                                onClick={e => declineContact(e, notify.fromUsername)}
                            >
                                Từ chối
                            </Decline>
                        </Confirmation>
                    </NotificationItem>
                )
            case 'Accept-contact':  
                return (
                    <NotificationItem key={index}>
                        {`${notify.fromUsername} đã thêm bạn vào liên hệ`}
                        <Accept 
                            onClick={e => removeNotify(e, notify.fromUsername)}
                        >
                            Xác nhận
                        </Accept>
                    </NotificationItem>
                )           
        }
    }

    return (
        <Container>
            <Icon
                title = {'Thông báo'}
            >
                {
                    notifyCount
                        ?
                        <Badge badgeContent={notifyCount} color="primary">
                            <NotificationsNone />
                        </Badge>
                        : <NotificationsNone />
                }
            </Icon>
            {toggle &&
                <NotificationBoard>
                    {
                        notifyList.map((notify, index) => 
                            renderNotificationItem(notify, index)
                        )
                    }
                </NotificationBoard>
            }
        </Container>
    )
}

export default NotificationButton