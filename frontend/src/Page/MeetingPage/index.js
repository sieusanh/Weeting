import {useContext} from 'react'
import MeetingBoard from '../../Component/MeetingBoard'
import LoginAlert from '../../Component/LoginAlert'
import { ThemeContext } from '../../Context/ThemeContext'
import {Container} from './StyledComponent'

function MeetingPage() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext
    return localStorage.getItem('userId')
            ?   
                <Container darkTheme={darkTheme}>
                    <MeetingBoard />
                </Container>
            : 
            <LoginAlert />   
}

export default MeetingPage