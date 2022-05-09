import {useContext} from 'react'
import {Container, Introduction, GoChatingLink, GoMeetingLink} from './StyledComponent'
import { ThemeContext } from '../../Context/ThemeContext'


function HomePage() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext

    return (
        <Container darkTheme={darkTheme}>
            <Introduction>
                Home Page
                <br />
                Make meetings closer and simpler
            </Introduction>
            <GoChatingLink to='/chat'>
                Go Chating
            </GoChatingLink>
            <GoMeetingLink to='/meeting'>
                Go Meeting
            </GoMeetingLink>
        </Container>
    )
}

export default HomePage