
import { useState, createContext, memo } from 'react'

const NotificationToChat_Context = createContext()

function NotificationToChat_Provider({ children }) {
	const [contactInfo, setContactInfo] = useState({
		contactStatus: 'Stranger',
		fromUsername: '',
		peerChatId: ''
	})

	const value = {
		contactInfo, 
		setContactInfo
	}

	return (
		<NotificationToChat_Context.Provider value={value}>
			{children}
		</NotificationToChat_Context.Provider>
	)
}

export { NotificationToChat_Context }
export default memo(NotificationToChat_Provider)