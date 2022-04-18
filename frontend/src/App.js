import { useLocation, Routes, Route, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import './style.css'

import Navbar from './Component/Navbar'
import Footer from './Component/Footer'
import HomePage from './Page/HomePage'
import LoginPage from './Page/LoginPage'
import SignupPage from './Page/SignupPage'
import ChatPage from './Page/ChatPage'
import MeetingPage from './Page/MeetingPage'
import PageNotFound from './Page/PageNotFound'

import AuthenProvider from './Context/AuthenContext'
import SocketProvider from './Context/SocketContext'
import ThemeProvider from './Context/ThemeContext'
import NotificationToChat_Provider 
from './Context/NotificationToChat_Context'
import NotificationToUserBoard_Provider 
from './Context/NotificationToUserBoard_Context'


const Container = styled.div`
    margin: 20px 76px;
    padding: 2px;
    border: 1px solid lightgray;
    border-radius: 4px;
`

function WithNav() {
	return (
		<>
			<Navbar />
			<Outlet />
		</>
	)
}

function WithoutNav() {
	return (
		<>
			<Outlet />cd 
		</>
	)
}

function App() {
	const location = useLocation()

    console.log('Location: ', location.pathname)
	if (window.performance) {
		if (performance.getEntriesByType("navigation")[0].type === 'reload') {
		}
	}
	return (
		<AuthenProvider>
			<SocketProvider>
				<ThemeProvider>
					<NotificationToChat_Provider>
						<NotificationToUserBoard_Provider>
							<Container>
								<Navbar />
								<Routes>
									<Route path='/login' element={<LoginPage />} />
									<Route path='/signup' element={<SignupPage />} />
									<Route path="*" element={<PageNotFound />} />
									<Route path='/' element={<HomePage />} />
									<Route path='/chat' element={<ChatPage />} />
									<Route path='/meeting' element={<MeetingPage/>} />
								</Routes>
								<Footer />
							</Container>
						</NotificationToUserBoard_Provider>
					</NotificationToChat_Provider>
				</ThemeProvider>
			</SocketProvider>
		</AuthenProvider>
	)
}

export default App
