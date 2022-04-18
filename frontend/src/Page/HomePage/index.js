import {useContext} from 'react'
import {Container, GoChatingLink, GoMeetingLink} from './StyledComponent'
import { ThemeContext } from '../../Context/ThemeContext'


function HomePage() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext

    return (
        <Container darkTheme={darkTheme}>
            <p>Home Page</p>
            <p>Make meetings closer and simpler</p>
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