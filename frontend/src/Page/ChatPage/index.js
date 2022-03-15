import UserBoard from '../../Component/UserBoard'
import Chat from '../../Component/Chat'
import LoginAlert from '../../Component/LoginAlert'
import {Container} from './StyledComponent'

function ChatPage() {
    return localStorage.getItem('userId')
            ? (
                <Container>
                    <UserBoard />
                    <Chat />
                </Container>
            ) 
            : (<LoginAlert />)   
}

export default ChatPage