import {useContext} from 'react'
import { ThemeContext } from '../../Context/ThemeContext'
import styled from 'styled-components'

const Container = styled.div`
    ${props => 
        props.darkTheme && 
        `
        background-color: #424242; 
        color: #FFF;
        `
    }
`

function PageNotFound() {
    const themeContext = useContext(ThemeContext)
    const {darkTheme} = themeContext
    return (
        <Container darkTheme={darkTheme}>
            <h1>404</h1>
            <h1>Page not found</h1>
        </Container>
    )
}

export default PageNotFound