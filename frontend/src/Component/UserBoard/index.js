import {useEffect, useState, useContext, memo} from 'react'
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
    console.log('UserBoard Component')
    const [tab, setTab] = useState('Peer') // Chat | Group | Meeting | Contact
    const [peerList, setPeerList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [meetingList, setMeetingList] = useState([])
    const [contactList, setContactList] = useState([])
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
    const { setPeerChatInfo, setUserId2, setChatName, setGroupChatId, 
        notifyPeerChatId: notifyChatId } = userBoardToChat_Context
    const { notifyPeerChatId: notificationId, 
        notifyContactList } = notificationContext
    useEffect(() => {
        switch(tab) {
            case 'Peer': {
                axios.get('/peer/get-peer-info-list/' + localStorage.getItem('userId'))
                .then(res => {
                    if (res.status === 200)
                        setPeerList(res.data.peerChatInfoList)
                })
                .catch(err => console.log(err))
                return 
            }
            case 'Group':
                return
            case 'Meeting':
                return
            case 'Contact':
                axios.get('/user/get-contact-list/' + localStorage.getItem('userId'))
                .then(res => {
                    if (res.status === 200)
                        setContactList(res.data.contactList)
                })
                .catch(err => console.log(err))
                return 
        }
    }, [tab])
    
    if (socket) {
        socket.on('Notify-online', ({fromUsername, message}) => {
            setPeerList(prev => {
                for (const peer of prev) {
                    if (peer.username === fromUsername) {
                        peer.activityStatus = 'Online'
                        return prev
                    }
                }
            })
        })
        socket.on('Notify-offline', ({fromUsername, message}) => {
            setPeerList(prev => {
                for (const peer of prev) {
                    if (peer.username === fromUsername) {
                        peer.activityStatus = 'Offline'
                        return prev
                    }
                }
            })
        })
    }

    useEffect(() => {
        axios.get('/notify/get-notify-peer-list/' + 
            localStorage.getItem('username')
        )
        .then(res => {
            setNotifyPeerList(res.data.notifyPeerList)
        })
    }, [])

    useEffect(() => {
        setNotifyPeerList([...notifyPeerList, notifyChatId])
    }, [notifyChatId])

    useEffect(() => {
        setNotifyPeerList([...notifyPeerList, notificationId])
    }, [notificationId])
    // Notify Peer List
    // Everytime user send accept connect to invitor, a new peer
    // chat square must be automatically added to peer chat list 

    useEffect(() => {
        axios.get('/peer/get-peer-info-list/' + localStorage.getItem('userId'))
        .then(res => {
            if (res.status === 200) {
                setPeerList(prev => {
                    const newArr = [...res.data.peerChatInfoList]
                    for (const peer of newArr) {
                        if (notifyPeerList.includes(peer.peerChatId)) {
                            peer.notify = true
                        } else {
                            peer.notify = false
                        }
                    }
                    return newArr
                })
            }
        })
        .catch(err => console.log(err))
    }, [notifyPeerList])

    // Notify Contact List
    useEffect(() => {
        axios.get('/user/get-contact-list/' + localStorage.getItem('userId'))
        .then(res => {
            if (res.status === 200) 
                setContactList(res.data.contactList)
        })
        .catch(err => console.log(err))
    }, [notifyContactList])

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
    
    function renderSearchChat(e) {
        e.preventDefault()
        axios.post('/peer/check-chat-exist', {
            userId1: localStorage.getItem('userId'),
            userId2: searchChatInfo.userId2
        })
        .then(res => {
            if (res.data.message === 'Chat not found') {
                setUserId2(searchChatInfo.userId2)
                // setPeerChatId('')
                setPeerChatInfo(prev => ({
                        ...prev,
                        peerChatId: ''
                    })
                ) 
            }
            else {
                setPeerChatInfo(prev => ({
                        ...prev,
                        peerChatId: res.data.peerChatId
                    }) 
                )
            } 
            
            const found = contactList.find(element => 
                element.username === searchChatInfo.username
            )
            if (found)
                setPeerChatInfo(prev => ({
                        ...prev,
                        chatName: searchChatInfo.username,
                        chatAvatar: searchChatInfo.avatar,
                        contactStatus: 'Friend'
                    })
                )
            else 
                setPeerChatInfo(prev => ({
                        ...prev,
                        chatName: searchChatInfo.username,
                        chatAvatar: searchChatInfo.avatar,
                        contactStatus: 'Stranger'
                    })
                )
        })
        .catch(err => console.log(err))
    }

    function renderPeerChat(e, peer) {
        e.preventDefault()
        const found = contactList.find(element => 
            element.username === peer.username
        )
        if (found)
            setPeerChatInfo({
                peerChatId: peer.peerChatId,
                chatName: peer.username,
                chatAvatar: peer.avatar,
                contactStatus: 'Friend'
            })
        else 
            setPeerChatInfo({
                peerChatId: peer.peerChatId,
                chatName: peer.username,
                chatAvatar: peer.avatar,
                contactStatus: 'Stranger'
            })
        
        // Remove Notify item
        setNotifyPeerList(prev => 
            prev.filter(notify => 
                notify.peerChatId !== peer.peerChatId
            )
        )
        axios.patch('/notify/remove-notify', {
            username: localStorage.getItem('username'),
            peerChatId: peer.peerChatId,
            type: 'Peer-message'
        })
    }

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