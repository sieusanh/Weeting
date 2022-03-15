import { SET_USER_ID_2, SET_CHAT_NAME, SET_CHAT_AVATAR, 
    SET_PEER_CHAT_ID, SET_GROUP_CHAT_ID, SET_SEARCH_CHAT, 
    SET_AUTHEN } from './constants'

const setUserId2 = payload => ({
    type: SET_USER_ID_2,
    payload
})

const setChatName = payload => ({
    type: SET_CHAT_NAME,
    payload
})

const setChatAvatar = payload => ({
    type: SET_CHAT_AVATAR,
    payload
})

const setPeerChatId = payload => ({
    type: SET_PEER_CHAT_ID,
    payload
})

const setGroupChatId = payload => ({
    type: SET_GROUP_CHAT_ID,
    payload
})

const setSearchChat = payload => ({
    type: SET_SEARCH_CHAT,
    payload
})

const setAuthen = payload => ({
    type: SET_AUTHEN,
    payload
})

export { setUserId2, setChatName, setChatAvatar, 
    setPeerChatId, setGroupChatId, setSearchChat, 
    setAuthen }