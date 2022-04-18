import io from 'socket.io-client'
import { useState, useEffect, useContext, 
	createContext, memo } from 'react'
import {AuthenContext} from '../AuthenContext'

const SocketContext = createContext()

function SocketProvider({ children }) {
	const [socket, setSocket] = useState(null)
	const authenContext = useContext(AuthenContext)
    const {authen} = authenContext
	let newSocket

	useEffect(() => {
		if (!authen)
			return
		newSocket = io('http://localhost:9090', {
			transports: ['websocket'],
			// pingTimeout: 60000
		})

		setSocket(newSocket)
		newSocket.emit('Notify-online', {
			fromUsername: localStorage.getItem('username') 
		})

		return () => newSocket.close()
		
	}, [newSocket, authen])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}

export { SocketContext }
export default memo(SocketProvider)

