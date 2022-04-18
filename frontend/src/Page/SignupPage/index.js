import {useContext} from 'react'
import { ThemeContext } from '../../Context/ThemeContext'
import {Container} from './StyledComponent'
import Signup from '../../Component/Signup'


function SignupPage() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext
    return (
        <Container darkTheme={darkTheme}>
            <Signup />
        </Container>
    )
}

export default SignupPage