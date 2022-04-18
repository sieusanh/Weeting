
import { useState, createContext, memo } from 'react'

const NotificationToChat_Context = createContext()

function NotificationToChat_Provider({ children }) {
	const [contactStatus, setContactStatus] = useState('Stranger')

	const value = {
		contactStatus, 
		setContactStatus
	}

	return (
		<NotificationToChat_Context.Provider value={value}>
			{children}
		</NotificationToChat_Context.Provider>
	)
}

export { NotificationToChat_Context }
export default memo(NotificationToChat_Provider)