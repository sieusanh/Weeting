
import styled from 'styled-components'

const Container = styled.div`
    width: 900px;
    height: auto;
    padding: 10px;
    margin-left: 26px;
    // box-shadow: -1px 0px;
    // box-shadow: rgba(149, 157, 165, 0.2) 0px 0px 24px;
    box-shadow: -2px 0px rgba(149, 157, 165, 0.2);
    border-top: 1px solid lightgray;
`

const HeadLine = styled.div`
    width: 90%;
    display: flex;
    align-items: center;
    // justify-content: flex-start;
    border: 1px solid lightgray;
`

const Avatar = styled.div`
`
const Title = styled.div`
    font-weight: bold;
    margin: auto 10px;
`

const Icon = styled.div`
    cursor: pointer;
    &:hover {
        color: var(--mainBlue);
    }
`

const TextScreen = styled.div`
    width: 90%;
    height: 300px;
    font-size: 16px;
    font-weight: 500;
    border: 1px solid lightgray;
`

const TypeBoard = styled.div`
    width: 90%;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid lightgray;
`

const TextInput = styled.input`
    border: none;
    height: 34px;
    width: 70%;
    padding-left: 10px;
    background-color: #F8F9F9;
    // background-color: #F1F1F1;
    font-size: 16px;
    font-weight: 500;
    &:hover {
        background-color: #F1F1F1;
    }
    &:focus {
        outline: none;
    }
    border-radius: 7px;
`

const SendContainer = styled.div`
    margin-left: 7px;
    display: flex;
    align-items: center;
    justify-content: space-around;
`

const UsernameExisted = styled.div`
    position: absolute;
    top: 200px;
    left: 300px;
    width: 300px;
    height: 200px;
    border: 1px solid lightgray;
    border-radius: 7px;
    text-align: center;
    line-height: 200px;
    color: red;
`

export {Container, HeadLine, Avatar, Title, 
    Icon, TextScreen, TypeBoard, TextInput, 
    SendContainer, UsernameExisted}