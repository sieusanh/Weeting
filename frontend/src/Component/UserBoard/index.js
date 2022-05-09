import {useEffect, useLayoutEffect, useState, 
    useContext, memo} from 'react'
import { Search, MoreVert, Chat, Group, 
    VoiceChat, Contacts, AccountCircle } from '@material-ui/icons'
// import ChatIcon from '@material-ui/icons/Chat' 
import axios from 'axios'

import { SocketContext } 
from '../../Context/SocketContext'

import { UserBoardToChat_Context } 
from '../../Context/UserBoardToChat_Context'

import { NotificationToUserBoard_Context } 
from '../../Context/NotificationToUserBoard_Context'

import {Container, TopContainer, SearchContainer, SearchLabel, 
    SearchInput, SettingIcon, ActivityContainer, ActivityItem, 
    TabList, TabItem, NotFound, ChatItem, ChatAvatar, ChatTitle, 
    OnlineSign, OfflineSign, ChatName, Preview} from './StyledComponent'

function UserBoard() {
    // console.log('UserBoard Component')
    const [tab, setTab] = useState('Peer') // Chat | Group | Meeting | Contact
    const [peerList, setPeerList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [meetingList, setMeetingList] = useState([])
    const [contactList, setContactList] = useState([])
    const [onlineList, setOnlineList] = useState([])
    const [result, setResult] = useState('404')
    const [notifyPeerList, setNotifyPeerList] = useState([])
    const [searchChatInfo, setSearchChatInfo] = useState({
        userId2: '',
        username: '',
        avatar: ''
    })
    const socket = useContext(SocketContext)
    const userBoardToChat_Context = useContext(UserBoardToChat_Context)
    const notificationContext = useContext(NotificationToUserBoard_Context)
    const { setPeerChatInfo, peerChatInfo, setChatName, setGroupChatId, 
        notifyPeerChatId: notifyChatId, newCreatedPeerChatId } = userBoardToChat_Context
    const { notifyPeerChatId: notificationId, 
        notifyContactList } = notificationContext
        
    // Initialize lists
    useLayoutEffect(() => {
        switch(tab) {
            case 'Peer': {
                setPeerList(peerList)
                return 
            }
            case 'Group':
                return
            case 'Meeting':
                return
            case 'Contact':
                // axios.get('/user/get-contact-list/' + localStorage.getItem('userId'))
                // .then(res => {
                //     if (res.status === 200)
                //         setContactList(res.data.contactList)
                // })
                // .catch(err => console.log(err))
                setContactList(contactList)
                return 
        }
    }, [tab])

    // Initialize peerList with notify
    useEffect(() => {
        axios.get('/peer/get-peer-info-list/' + localStorage.getItem('userId'))
        .then(res1 => {
            if (res1.status === 200) {
                const tempArr = res1.data.peerChatInfoList
                axios.get('/notify/get-notify-peer-list/' + 
                    localStorage.getItem('username')
                )
                .then(res2 => {
                    if (res1.status === 200) {
                        tempArr.forEach(peer => {
                            peer.notify = 
                                res2.data.notifyPeerList.includes(peer.peerChatId)
                        })
                        setPeerList(tempArr)
                    }
                })
            }
        })
        .catch(err => console.log(err))
    }, [])
    
    if (socket) {
        socket.off('Initial-online-users').on('Initial-online-users', ({onlineUsers}) => {
            setOnlineList(onlineUsers)
        })
        socket.off('Notify-online').on('Notify-online', ({fromUsername, message}) => {
            // setPeerList(prev => {
            //     for (const peer of prev) {
            //         if (peer.username === fromUsername) {
            //             peer.activityStatus = 'Online'
            //             return prev
            //         }
            //     }
            // })
            if (peerList.length === 0)
                return

            // const tempArr = [...peerList]
            // for (const peer of tempArr) {
            //     if (peer.username === fromUsername) {
            //         peer.activityStatus = 'Online'

            //         break
            //     }
            // }
            // setPeerList(tempArr)
            setOnlineList([...onlineList, fromUsername])
        })
        socket.off('Notify-offline').on('Notify-offline', ({fromUsername, message}) => {
            // setPeerList(prev => {
            //     for (const peer of prev) {
            //         if (peer.username === fromUsername) {
            //             peer.activityStatus = 'Offline'
            //             return prev
            //         }
            //     }
            // })
            if (peerList.length === 0)
                return

            // const tempArr = [...peerList]
            // for (const peer of tempArr) {
            //     if (peer.username === fromUsername) {
            //         peer.activityStatus = 'Offline'
            //         break
            //     }
            // }
            // setPeerList(tempArr)

            const tempArr = 
                onlineList.filter(username => 
                    username !== fromUsername
                )
            setOnlineList(tempArr)
        })
    }

    useEffect(() => {
        // if (onlineList.length === 0)
        //     return

        // Update peerList
        const tempArr1 = peerList
        tempArr1.forEach(peer => {
            if (onlineList.includes(peer.username)) {
                peer.activityStatus = 'Online'
            } else {
                peer.activityStatus = 'Offline'
            }
        })
        setPeerList(tempArr1)

        // Update contactList
        const tempArr2 = contactList
        tempArr2.forEach(contact => {
            if (onlineList.includes(contact.username)) {
                contact.activityStatus = 'Online'
            } else {
                contact.activityStatus = 'Offline'
            }
        })
        setContactList(tempArr2)

    }, [onlineList])

    // Initialize the peerList with notify
    // useLayoutEffect(() => {
    //     if (peerList.length === 0)
    //         return
    //     setNotifyPeerList(true)
    // }, [peerList])

    // useEffect(() => {
    //     if (!notifyPeerList)
    //         return

    //     axios.get('/notify/get-notify-peer-list/' + 
    //         localStorage.getItem('username')
    //     )
    //     .then(res => {
    //         // setNotifyPeerList(prev => res.data.notifyPeerList)
            
    //         // setPeerList(prev => {
    //         //     prev.forEach(peer => { 
    //         //         peer.notify = 
    //         //             res.data.notifyPeerList.includes(peer.peerChatId)
    //         //     })
    //         //     return prev
    //         // })
    //         console.log('inside peerList: ', peerList)
    //         const tempArr = [...peerList]
    //         tempArr.forEach(peer => {
    //             peer.notify = 
    //                 res.data.notifyPeerList.includes(peer.peerChatId)
    //         })
    //         setPeerList(tempArr)
    //         setNotifyPeerList(false)
    //     })
    // }, [notifyPeerList])

    // Work when having a peer chat notify
    useLayoutEffect(() => {
        if (!notifyChatId || peerList.length === 0)
            return
        // setNotifyPeerList(prev => {
        //     prev.push(notifyChatId)
        //     return prev
        // })

        // setPeerList(prev => {
        //     for (const peer of prev) {
        //         if (peer.peerChatId === notifyChatId) {
        //             peer.notify = true
        //             // peer.notify = notifyPeerList.includes(peer.peerChatId)
        //             return prev
        //         }
        //     }
        // })
        
        const tempArr = peerList
        for (const peer of tempArr) {
            if (peer.peerChatId === notifyChatId) {
                peer.notify = true
                break
            }
        }
        setPeerList(tempArr)

    }, [notifyChatId])

    // Work when having a new peer chat created
    useLayoutEffect(() => {
        if (!notificationId)
            return
        
        // Update the peerList when having a new connected user
        axios.get('/peer/get-peer-info-list/' + localStorage.getItem('userId'))
        .then(res => {
            if (res.status === 200) {
                // setPeerList(prev => {
                //     prev = [...res.data.peerChatInfoList]
                //     for (const peer of prev) {
                //         if (peer.peerChatId === notificationId) {
                //             peer.activityStatus = 'Offline'
                //             peer.notify = true
                //             // peer.notify = notifyPeerList.includes(peer.peerChatId)
                //             return prev
                //         }
                //     }
                // })

                // setNotifyPeerList(prev => {
                //     prev.push(notificationId) 
                //     return prev
                // })

                const tempArr = res.data.peerChatInfoList
                for (const peer of tempArr) {
                    if (peer.peerChatId === notificationId) {
                        peer.notify = true
                        peer.activityStatus = 'Offline'
                        break
                    }
                }
                setPeerList(tempArr)
            }
        })
        .catch(err => console.log(err))
        
        // .then(fine => {
        //     console.log('fine')
        //     setNotifyPeerList(prev => {
        //         prev.push(notificationId)
        //         return prev
        //     })
        // })
        // .catch(err => console.log(err))

    }, [notificationId])

    useLayoutEffect(() => {
        if (!newCreatedPeerChatId)
            return
        
        // Update the peerList when having a new connected user
        axios.get('/peer/get-peer-info-list/' + localStorage.getItem('userId'))
        .then(res => {
            if (res.status === 200) {
                const tempArr = res.data.peerChatInfoList
                for (const peer of tempArr) {
                    if (peer.peerChatId === newCreatedPeerChatId) {
                        peer.notify = true
                        peer.activityStatus = 'Offline'
                        break
                    }
                }
                setPeerList(tempArr)
            }
        })
        .catch(err => console.log(err))

    }, [newCreatedPeerChatId])

    // Work when the notifyPeerList updated
    // useEffect(() => {
    //     console.log('useEffect2')
    //     if (notifyPeerList.length === 0 || peerList.length === 0) 
    //         return
    //     setPeerList(prev => {
    //         console.log('enter2')
    //         prev.forEach(peer => { 
    //             console.log('peer: ', peer)
    //             peer.notify = notifyPeerList.includes(peer.peerChatId)
    //         })
    //         console.log('prev2 after: ', prev)
    //         return prev
    //     })
    //     console.log('peerList2: ', peerList)

    // }, [notifyPeerList])

    // Notify Contact List
    useLayoutEffect(() => {
        // if (!notifyContactList)
        //     return

        axios.get('/user/get-contact-list/' + localStorage.getItem('userId'))
        .then(res1 => {
            if (res1.status === 200) {
                // const tempArr = res.data.contactList
                // tempArr.forEach(contact => {
                //     if (onlineList.includes(contact.username)) {
                //         contact.activityStatus = 'Online'
                //     } else {
                //         contact.activityStatus = 'Offline'
                //     }
                // })
                setContactList(res1.data.contactList)
            }
        })
        .catch(err => console.log(err))

        axios.get('/peer/get-peer-info-list/' + localStorage.getItem('userId'))
        .then(res2 => {
            if (res2.status === 200) {
                for (const peer of res2.data.peerChatInfoList) {
                    if (peer.peerChatId === notifyContactList){
                        axios.get('/online-user/check-online/' + 
                            peer.username
                        )
                        .then(res3 => {
                            if (res3.status === 200 
                                && res3.data.message === 'Found') {
                                setOnlineList([...onlineList, peer.username])
                            }
                        })
                        .catch(err => console.log(err))
                        break
                    }
                }
            }
        })
        .catch(err => console.log(err))

    }, [notifyContactList])

    // Handle the search data when user inputing
    function handleSearchInput(e) {
        e.preventDefault()
        setTab('Search')
        axios.get('/user/find/username/' + e.target.value)
        .then(res => {
            if (res.data.message && res.data.message === '404')
                setResult('404')
            else {
                setResult('Found')
                setSearchChatInfo({
                    userId2: res.data.id,
                    username: e.target.value,
                    avatar: res.data.avatar
                })
            }
        })
        .catch(err => console.log(err))
    }

    // Handle the chat of the found user
    function renderSearchChat(e) {
        e.preventDefault()
        
        axios.post('/peer/check-chat-exist', {
            userId1: localStorage.getItem('userId'),
            userId2: searchChatInfo.userId2
        })
        .then(res => {

            const peerChatInfo = { 
                peerChatId: '',
                chatName: '',
                chatAvatar: '',
                contactStatus: 'Stranger'
            }
            if (res.data.message !== '404')
                peerChatInfo.peerChatId = res.data.peerChatId

            const found = contactList.find(element => 
                element.username === searchChatInfo.username
            )
            if (found) 
                peerChatInfo.contactStatus = 'Friend'
            
            peerChatInfo.chatName = searchChatInfo.username
            peerChatInfo.chatAvatar = searchChatInfo.avatar

            setPeerChatInfo(peerChatInfo)
        })
        .catch(err => console.log(err))
    }

    // Handle the peer chat between users that connected before
    function renderPeerChat(e, peer) {
        e.preventDefault()
        const found = contactList.find(element => 
            element.username === peer.username
        )
        const peerChatInfo = {
            peerChatId: peer.peerChatId,
            chatName: peer.username,
            chatAvatar: peer.avatar,
            contactStatus: 'Stranger'
        }
        if (found) 
            peerChatInfo.contactStatus = 'Friend'
            
        setPeerChatInfo(peerChatInfo)
        
        
        // Remove Notify item
        // setNotifyPeerList(prev => 
        //     prev.filter(notify => 
        //         notify.peerChatId !== peer.peerChatId
        //     )
        // )
        axios.patch('/notify/remove-notify', {
            username: localStorage.getItem('username'),
            peerChatId: peer.peerChatId,
            type: 'Peer-message'
        })
        .then(res => {
            if (res.status === 200) {
                // setNotifyPeerList(prev => {
                //     const tempArr = prev.filter(notifyPeerChatId => 
                //         notifyPeerChatId !== peer.peerChatId
                //     )
                //     return tempArr
                // })

                // setPeerList(prev => {
                //     for (const prevPeer of prev) {
                //         if (prevPeer.peerChatId === peer.peerChatId) {
                //             prevPeer.notify = false
                //             // peer.notify = notifyPeerList.includes(peer.peerChatId)
                //             return prev
                //         }
                //     }
                // })

                const tempArr = peerList
                for (const prevPeer of tempArr) {
                    if (prevPeer.peerChatId === peer.peerChatId) {
                        prevPeer.notify = false
                        break
                    }
                }
                setPeerList(prev => tempArr)
            }
        })
    }

    // Handle the group chat between users that connected before
    function renderGroupChat(e, group) {
        e.preventDefault()
        setGroupChatId(group.id)
        setChatName(group.username)
        setPeerChatInfo({
            // peerChatId: group.groupChatId,
            chatName: group.username,
            // chatAvatar: group.avatar
        })
    }

    return (
        <Container>
            <TopContainer>
                <SearchContainer>
                    <SearchLabel htmlFor='searchInput'>
                        <Search />
                    </SearchLabel>
                    <SearchInput 
                        id='searchInput'
                        placeholder='Search people' 
                        onChange={handleSearchInput}
                    />
                </SearchContainer>
                <SettingIcon>
                    <MoreVert />
                </SettingIcon>
            </TopContainer>
            <ActivityContainer>
                <ActivityItem 
                    tab={tab}
                    onClick={() => setTab('Peer')}
                >
                    <Chat />
                    Peer
                </ActivityItem>
                <ActivityItem 
                    tab={tab}
                    onClick={() => setTab('Group')}
                >
                    <Group />
                    Group
                </ActivityItem>
                <ActivityItem 
                    tab={tab}
                    onClick={() => setTab('Meeting')}
                >
                    <VoiceChat />
                    Meeting
                </ActivityItem>
                <ActivityItem 
                    tab={tab}
                    onClick={() => setTab('Contact')}
                >
                    <Contacts />
                    Contact
                </ActivityItem>
            </ActivityContainer>
            <TabList>
                {tab === 'Peer' && peerList.map((peer, index) => (
                    <TabItem 
                        key={index}
                        onClick={e => renderPeerChat(e, peer)}
                    >
                        <ChatItem>
                            <ChatAvatar>
                                {peer.avatar ||   
                                    <AccountCircle 
                                        style={{fontSize: '2.5em'}}
                                    />
                                }
                                {peer.activityStatus === 'Online'
                                    && <OnlineSign />
                                }
                                {peer.activityStatus === 'Offline'
                                    && <OfflineSign />
                                }
                            </ChatAvatar>
                            <ChatTitle>
                                <ChatName>
                                    {peer.username}
                                </ChatName>
                                <Preview 
                                    notify={peer.notify}
                                >
                                    {peer.preview.paragraph}
                                </Preview>
                            </ChatTitle>
                        </ChatItem>
                    </TabItem>
                ))}
                {/* {tab === 'Group' && groupList.map((group, index) => (
                    <TabItem 
                        key={index}
                        onClick={e => renderGroupChat(e, group)}
                    >
                        {group}
                    </TabItem>
                ))}
                {tab === 'Meeting' && meetingList.map((item, index) => (
                    <TabItem 
                        key={index}
                    >
                        {item}
                    </TabItem>
                ))} */}
                {tab === 'Contact' && contactList.map((contact, index) => (
                    <TabItem 
                        key={index}
                    >
                        {contact.username}
                    </TabItem>
                ))}
                {tab === 'Search' &&
                    (
                        <TabItem 
                            style={{backgroundColor: '#B9E7F9'}}
                            onClick={renderSearchChat}
                        >
                            {result === '404' 
                                ? (
                                    <NotFound>
                                        {'Không tìm thấy'}
                                    </NotFound>
                                ) 
                                : (
                                    <ChatItem>
                                        <ChatAvatar>
                                            {searchChatInfo.avatar || 
                                                <AccountCircle 
                                                    style={{fontSize: '2.5em'}}
                                                />
                                            }
                                        </ChatAvatar>
                                        <ChatTitle>
                                            <ChatName>
                                                {searchChatInfo.username}
                                            </ChatName>
                                            <Preview>
                                                {'Some personal information...'}
                                            </Preview>
                                        </ChatTitle>
                                    </ChatItem>
                                )
                            }
                        </TabItem>
                    )
                }
            </TabList>
        </Container>
    )
}

export default memo(UserBoard)