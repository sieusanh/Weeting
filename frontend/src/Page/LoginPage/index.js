import {useContext} from 'react'
import {Container} from './StyledComponent'
import Login from '../../Component/Login'
import { ThemeContext } from '../../Context/ThemeContext'

function LoginPage() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext
    return (
        <Container darkTheme={darkTheme}>
            <Login />
        </Container>
    )
}

export default LoginPage