import styled from 'styled-components'
import {Link} from 'react-router-dom'


const Container = styled.div`
    height: 700px;
    border: 1px solid;
    color: var(--textBlack);
    font-size: 42px;
    background-color: #F9FAFC;
    ${props => 
        props.darkTheme && 
        `
        background-color: #333333; 
        color: #FFF;
        `
    }
`
// #FAFAFA
// #F9FAFC

const GoChatingLink = styled(Link)`
    text-decoration: none;
    font-size: 32px;
    font-weight: bold;
    color: var(--textBlack);
`

const GoMeetingLink = styled(Link)`
    text-decoration: none;
    font-size: 32px;
    font-weight: bold;
    color: var(--textBlack);
`

export {Container, GoChatingLink, GoMeetingLink}
