
import {useState, createContext, memo} from 'react'

const UserBoardToChat_Context = createContext()

function UserBoardToChat_Provider({ children }) {
	const [userId2, setUserId2] = useState('')
	const [peerChatInfo, setPeerChatInfo] = useState({ 
		peerChatId: '',
		chatName: '',
		chatAvatar: '',
		contactStatus: 'Stranger' // Stranger || Wait-for-accept || Friend
	})
	const [groupChatId, setGroupChatId] = useState('')
	const [notifyPeerChatId, setNotifyPeerChatId] = useState('')
	// Stranger || Wait-for-accept || Friend
	const [contactStatus, setContactStatus] = useState('Stranger') 
	
	const value = {
		userId2,
		peerChatInfo,
		groupChatId,
		notifyPeerChatId,
		contactStatus,
		setUserId2,
		setPeerChatInfo,
		setGroupChatId,
		setNotifyPeerChatId,
		setContactStatus
	}
	
    return (
		<UserBoardToChat_Context.Provider value={value}>
            {children}
		</UserBoardToChat_Context.Provider>
    )
}

export {UserBoardToChat_Context}
export default memo(UserBoardToChat_Provider)