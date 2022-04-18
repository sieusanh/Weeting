
import { useState, createContext, memo } from 'react'

const NotificationToUserBoard_Context = createContext()

function NotificationToUserBoard_Provider({ children }) {
	const [notifyPeerChatId, setNotifyPeerChatId] = useState('')
	const [notifyContactList, setNotifyContactList] = useState(false)

	const value = {
		notifyPeerChatId, 
		notifyContactList,
        setNotifyPeerChatId,
		setNotifyContactList
	}

	return (
		<NotificationToUserBoard_Context.Provider value={value}>
			{children}
		</NotificationToUserBoard_Context.Provider>
	)
}

export { NotificationToUserBoard_Context }
export default memo(NotificationToUserBoard_Provider)