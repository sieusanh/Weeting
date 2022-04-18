import styled from 'styled-components'
import {Link} from 'react-router-dom'

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid lightgray;
    ${props => 
        props.darkTheme && 
        `
        background-color: #424242; 
        color: #FFF;
        `
    }
`

const MainLogoLink = styled(Link)`
    text-decoration: none;
    font-size: 32px;
    font-weight: bold;
    // font-style: oblique;
    // color: var(--mainBlue);
    color: var(--textBlack);
`

const IconHoverDisplay = styled.div`
    display: none;
    position: absolute;
    top: 100x;
    right: 100px;    
    width: 100px
    height: 20px;
    background-color: gray;
    color: #000;
    text-align: center;
    line-height: 20px;
    border: 1px solid;
    // &::after {
    //     content: ${props => props.note};
    // }
`

const NavbarIcon = styled.div`
    cursor: pointer;
    // &:hover:after {
    // }
    &:hover {
        ${IconHoverDisplay} {
            display: block;
        }
    }
`

const GeneralIconContainer = styled.div`
    margin-left: 1290px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const CalendarIcon = styled(NavbarIcon)`
`

const CalendarBoard = styled.div`
    position: absolute;
    top: 94px;
    right: 324px;
    color: #000;
    box-shadow: 1px 1px 8px 2px #F8F9F9, -1px -1px 8px 2px #F8F9F9 ;
`

const BrightSwitcherIcon = styled(NavbarIcon)`
`

const NotificationIcon = styled(NavbarIcon)`
`

const UserContainer = styled.div`
    display: flex;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const UserAccountIcon = styled(NavbarIcon)`
`

const AccountBoard = styled.div`
`

const LogOut = styled.div`
    cursor: pointer;
    &:hover {
        color: lightgray;
    }
`

const LoginContainer = styled.div`
    width: 100px;
    height: 42px;
    background-color: #424242;
    border: 1px solid lightgray;
    border-radius: 4px;
    text-align: center;
    line-height: 42px;
    cursor: pointer;
    &:hover {
        // background-color: #B9C7D0;
        background-color: #363636;
    }
`

const LoginLink = styled(Link)`

    // Container
    width: 100px;
    height: 42px;
    background-color: #424242;
    border: 1px solid lightgray;
    border-radius: 4px;
    text-align: center;
    line-height: 42px;
    cursor: pointer;
    &:hover {
        // background-color: #B9C7D0;
        background-color: #363636;
    }

    text-decoration: none;
    font-size: 16px;
    color: #FFF;
`

export { Container, MainLogoLink, GeneralIconContainer, CalendarIcon, 
    CalendarBoard, BrightSwitcherIcon, NotificationIcon, 
    UserContainer, UserAccountIcon, AccountBoard, 
    LogOut, LoginLink }