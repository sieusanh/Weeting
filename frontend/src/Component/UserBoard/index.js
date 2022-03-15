import {useEffect, useState} from 'react'
import { Search, MoreVert, Chat, Group, VoiceChat, Contacts } from '@material-ui/icons'
// import ChatIcon from '@material-ui/icons/Chat'
import axios from 'axios'
import { useStore, actions } from '../../store'
import {Container, TopContainer, SearchContainer, SearchLabel, 
    SearchInput, SettingIcon, ActivityContainer, ActivityItem, 
    TabList, TabItem, NotFound,Title, ChatAvatar, ChatName, Description} from './StyledComponent'

function UserBoard() {
    const [tab, setTab] = useState('Peer') // Chat | Group | Meeting | Contact
    const [peerList, setPeerList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [meetingList, setMeetingList] = useState([])
    const [contactList, setContactList] = useState([])
    const [result, setResult] = useState('404')
    const [chatName, setChatName] = useState('')
    const [chatAvatar, setChatAvatar] = useState('')
    const [userId2, setUserId2] = useState('')
    const [state, dispatch] = useStore()
    // const {chatName, chatAvatar, peerChatId, groupChatId} = state

    useEffect(() => {
        switch(tab) {
            case 'Peer':
                axios.get('/peer/get-peer-list/' + localStorage.getItem('userId'))
                .then(res => {
                    if (res.status === 200)
                        console.log('res data: ', res.data)
                        setPeerList(res.data.peerChatIdList)
                })
                .catch(err => console.log(err.response.data))
                return 
            case 'Group':
                return
            case 'Meeting':
                return
            case 'Contact':
                return
        }
    }, [tab])
    function handleSearchInput(e) {
        e.preventDefault()
        setTab('Search')
        axios.get('/user/find/username/' + e.target.value)
        .then(res => {
            if (res.data.message && res.data.message === '404')
                setResult('404')
            else {
                setResult('Found')
                setChatName(e.target.value)
                setChatAvatar(res.data.avatar)
                setUserId2(res.data.id)
            }
        })
        .catch(err => console.log(err.response.data))
    }
    
    function renderSearchChat(e) {
        e.preventDefault()
        dispatch(actions.setUserId2(userId2))
        dispatch(actions.setChatName(chatName))
        dispatch(actions.setChatAvatar(chatAvatar))
        dispatch(actions.setSearchChat(true))
    }
    function renderPeerChat(e, peer) {
        e.preventDefault()
        dispatch(actions.setPeerChatId(peer.id))
        dispatch(actions.setChatName(peer.name))
        dispatch(actions.setChatAvatar(peer.avatar))
    }
    function renderGroupChat(e, group) {
        e.preventDefault()
        dispatch(actions.setGroupChatId(group.id))
        dispatch(actions.setChatName(group.name))
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
                {tab === 'Peer' && peerList.map((item, index) => (
                    <TabItem 
                        key={index}
                        onClick={() => renderPeerChat(item)}
                    >
                        {item}
                    </TabItem>
                ))}
                {tab === 'Group' && groupList.map((item, index) => (
                    <TabItem 
                        key={index}
                        onClick={renderGroupChat}
                    >
                        {item}
                    </TabItem>
                ))}
                {tab === 'Meeting' && meetingList.map((item, index) => (
                    <TabItem 
                        key={index}
                    >
                        {item}
                    </TabItem>
                ))}
                {tab === 'Contact' && contactList.map((item, index) => (
                    <TabItem 
                        key={index}
                    >
                        {item}
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
                                    <Title>
                                        <ChatAvatar>
                                            {chatAvatar || 'Avatar'}
                                        </ChatAvatar>
                                        <ChatName>
                                            {chatName}
                                        </ChatName>
                                        <Description>
                                            {'Abc...'}
                                        </Description>
                                    </Title>
                                )
                            }
                        </TabItem>
                    )
                }
            </TabList>
        </Container>
    )
}

export default UserBoard