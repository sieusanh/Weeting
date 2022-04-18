import {useContext} from 'react'
import UserBoardToChat_Provider 
from '../../Context/UserBoardToChat_Context'
import UserBoard from '../../Component/UserBoard'
import ChatBoard from '../../Component/ChatBoard'
import LoginAlert from '../../Component/LoginAlert'
import { ThemeContext } from '../../Context/ThemeContext'
import {Container} from './StyledComponent'

function ChatPage() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext
    return localStorage.getItem('userId')
            ?   
            <UserBoardToChat_Provider>
                <Container darkTheme={darkTheme}>
                    <UserBoard />
                    <ChatBoard />
                </Container>
            </UserBoardToChat_Provider>
            : 
            <LoginAlert />   
}

export default ChatPage