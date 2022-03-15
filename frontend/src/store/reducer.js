import { SET_USER_ID_2, SET_CHAT_NAME, SET_CHAT_AVATAR, 
    SET_PEER_CHAT_ID, SET_GROUP_CHAT_ID, SET_SEARCH_CHAT, 
    SET_AUTHEN } from './constants'

const initState = {
    userId2: '',
    chatName: '',
    chatAvatar: '',
    peerChatId: '',
    groupChatId: '',
    searchChat: false,
    authen: localStorage.getItem('userId')
}

function reducer(state, action) {
    switch (action.type) {
        case SET_USER_ID_2:
            return {
                ...state,
                userId2: action.payload
            }
        case SET_CHAT_NAME:
            return {
                ...state,
                chatName: action.payload
            }
        case SET_CHAT_AVATAR:
            return {
                ...state,
                chatAvatar: action.payload
            }
        case SET_PEER_CHAT_ID:
            return {
                ...state,
                peerChatId: action.payload
            }
        case SET_GROUP_CHAT_ID:
            return {
                ...state,
                groupChatId: action.payload
            }
        case SET_SEARCH_CHAT:
            return {
                ...state,
                searchChat: action.payload
            }
        case SET_AUTHEN:
            return {
                ...state,
                authen: action.payload
            }
        default:
            throw new Error('Invalid action')
    }
} 

export { initState }
export default reducer