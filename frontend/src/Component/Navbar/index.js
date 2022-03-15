import {Link, useNavigate} from 'react-router-dom'
import { BrightnessHigh, BrightnessLow} from '@material-ui/icons'
import axios from 'axios'
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ToggleCalendar from '../ToggleCalendar'
import {Container, Logo, UserContainer} from './StyledComponent'

function Navbar() {
    const navigate = useNavigate()

    function handleLogout(event) {
        event.preventDefault()
        axios.get('/auth/logout')
        .then(res => {
            if (res.status === 204) {
                localStorage.clear()
                navigate('/')
                window.location.reload()
            }
        })
        .catch(err => console.log(err))
    }
    return (
        <Container>
            <Link to='/'>
                <Logo 
                    src="../../wee.png" 
                    alt="Main Logo" 
                    width="130" 
                    height="70"
                />
            </Link>
            <ToggleCalendar />
            {!localStorage.getItem('username') && (
                <UserContainer>
                    <Link to='/login'>Login</Link>
                    <Link to='/signup'>Signup</Link>
                </UserContainer>
            )}
            {localStorage.getItem('username') && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </Container>
    )
}

export default Navbar