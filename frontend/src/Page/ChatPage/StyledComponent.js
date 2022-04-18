import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    color: var(--textBlack);
    ${props => 
        props.darkTheme && 
        `
        background-color: #424242; 
        color: #FFF;
        `
    }
`

export {Container}