import styled from 'styled-components'

const Container = styled.div`
    margin-top: 30px;
`

const Title = styled.div`
    text-align: center;
    font-size: 34px;
`

const Form = styled.form`
    margin: 10px auto;
    width: 340px;
    height: 450px;
    background-color: #AAB7B8; //#F4F6F6; //#495A97; //#CABFE3; //#B9E7F9; //#EBF5F9; 
    display: flex;
    flex-direction: column;
`

const Input = styled.input`
    width: 86%;
    height: 36px;
    margin: auto;
    color: var(--textBlack);
`

const Submit = styled.div`
    width: 86%;
    height: 36px;
    background-color: #000;
    margin: auto;
    color: #FFF;
    cursor: pointer;
`

export {Container, Title, Form, Input, 
    Submit}