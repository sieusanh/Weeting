import styled from 'styled-components'

const Container = styled.div`
    position: absolute;
    right: 208px;
    top: 18px;
    width: 250px;
    height: 344px;
    border: 2px solid;
    // border-top: 0px;
    border-radius: 0px 0px 20px 20px;
    background-color: pink;
    line-height: 30px;
    text-align: center;
    padding: 3px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 1s;
    transform: ${props => !props.toggle && 'translateY(-320px)'}; 
`

const Icon = styled.div`
    cursor: pointer;
    margin-top: 16px;
    &:hover {
        transform: scale(1.1);
    }
`

export {Container, Icon}