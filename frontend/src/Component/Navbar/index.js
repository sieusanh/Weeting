import {useNavigate} from 'react-router-dom'
import {useState, useContext} from 'react'
import { TodayOutlined, Brightness4, Brightness7, 
    AccountCircle, ExitToApp} from '@material-ui/icons'
import axios from 'axios'
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Calendar from '../Calendar'
import { ThemeContext } from '../../Context/ThemeContext'
import NotificationButton from '../NotificationButton'
import { Container, MainLogoLink, GeneralIconContainer, CalendarIcon, 
    CalendarBoard, BrightSwitcherIcon, NotificationIcon, 
    UserContainer, UserAccountIcon, AccountBoard, 
    LogOut, LoginLink } from './StyledComponent'

function Navbar() {
    const navigate = useNavigate()
    const [toggleCalendar, setToggleCalendar] = useState(false)
    const [toggleNotification, setToggleNotification] = useState(false)
    const [toggleAccount, setToggleAccount] = useState(false)
    const themeContext = useContext(ThemeContext)
    const {darkTheme, setDarkTheme} = themeContext
    function handleLogout(e) {
        e.preventDefault()
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

    function handleCalendarClick(e) {
        e.preventDefault()
        setToggleCalendar(!toggleCalendar)
        setToggleNotification(false)
        setToggleAccount(false)
    }

    function handleThemeClick(e) {
        e.preventDefault()
        setDarkTheme(!darkTheme)
        setToggleCalendar(false)
        setToggleNotification(false)
        setToggleAccount(false)
    }

    function handleNotificationClick(e) {
        e.preventDefault()
        setToggleNotification(!toggleNotification)
        setToggleCalendar(false)
        setToggleAccount(false)
    }

    function handleAccountClick(e) {
        e.preventDefault()
        setToggleAccount(!toggleAccount)
        setToggleNotification(false)
        setToggleCalendar(false)
    }

    return (
        <Container darkTheme={darkTheme}>
            <MainLogoLink to='/'>
                <span
                    style={{color: 'var(--mainBlue)'}}
                >
                    We
                </span>
                {darkTheme 
                ? 
                <span 
                    style={{color: '#FFF'}}
                >
                    eting
                </span>
                : 
                <span>eting</span>
                }
                <span
                    style={{color: 'var(--mainBlue)'}}
                >
                    !
                </span>
            </MainLogoLink>
            {/* <ToggleCalendar /> */}
            {/* {!localStorage.getItem('username') && (
                <UserContainer>
                    <Link to='/login'>Login</Link>
                    <Link to='/signup'>Signup</Link>
                </UserContainer>
            )}
            {localStorage.getItem('username') && (
                <button onClick={handleLogout}>Logout</button>
            )} */}
            <GeneralIconContainer>
                <CalendarIcon 
                    onClick={handleCalendarClick}
                    note={'Xem lịch'}
                >
                    <TodayOutlined
                        style={{fontSize: '2em'}}
                    />
                </CalendarIcon>
                {toggleCalendar && 
                    <CalendarBoard>
                        <Calendar />
                    </CalendarBoard>
                }
                <BrightSwitcherIcon
                    onClick={handleThemeClick}
                    note={'Sáng / Tối'}
                >
                    {darkTheme
                    ?
                    <Brightness7 
                        style={{fontSize: '2em'}}
                    />
                    :
                    <Brightness4 
                        style={{fontSize: '2em'}}
                    />
                    }
                </BrightSwitcherIcon>
            </GeneralIconContainer>
            {localStorage.getItem('username')
            ?
            <UserContainer>
                {/* <NotificationIcon
                    onClick={handleNotificationClick}
                >
                    <NotificationButton />
                </NotificationIcon> */}
                {/* {toggleNotification && 
                    <NotificationBoard>

                    </NotificationBoard>
                } */}
                <NotificationIcon
                    onClick={handleNotificationClick}
                >
                    <NotificationButton 
                        toggle={toggleNotification}
                    />
                </NotificationIcon>
                <UserAccountIcon
                    onClick={handleAccountClick}
                >
                    <AccountCircle 
                        style={{fontSize: '2em'}}
                    />
                </UserAccountIcon>
                {toggleAccount && 
                    <AccountBoard>
                        <LogOut onClick={handleLogout}>
                            <ExitToApp />
                            Log out
                        </LogOut>
                    </AccountBoard>
                }
            </UserContainer>
            :
            <UserContainer>
                <LoginLink to='/login'>Login</LoginLink>
            </UserContainer>
            }
        </Container>
    )
}

export default Navbar