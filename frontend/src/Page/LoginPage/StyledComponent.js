import styled from 'styled-components'

const Container = styled.div`
    height: 770px;
    color: var(--textBlack);
    border: 1px solid lightgray;
    
    background: url('Blue_Wallpaper.jpg') no-repeat;
    background-size: cover;
    ${props => 
        props.darkTheme && 
        `
        background-color: #424242; 
        color: #FFF;
        `
    }
`

export {Container}