import {useState} from 'react'
import TodayOutlinedIcon from '@material-ui/icons/TodayOutlined'
import Calendar from '../Calendar'
import {Container, Icon} from './StyledComponent'

function ToggleCalendar() {
    const [toggle, setToggle] = useState(false)
    return (
        <Container toggle={toggle}>
            <Calendar />
            <Icon onClick={() => {
                setToggle(!toggle)
            }}>
                <TodayOutlinedIcon />
            </Icon>
        </Container>
    )
}

export default ToggleCalendar