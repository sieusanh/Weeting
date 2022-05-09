import styled from 'styled-components'

const Container = styled.div`
    width: 100%;
    height: 700px;


    // transform: translateY(-60px);
`

const BlurBackground = styled.div`
    witdh: 100%;
    height: 100%;
    filter: blur(8px);
    -webkit-filter: blur(8px);
    background-color: lightgray;
`

const Alert = styled.div`
    width: 300px;
    height: 200px;
    margin: auto;
    border: 2px solid gray;
    border-radius: 4px;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #F1F1F1;
    z-index: 1;
    transform: translateY(-570px);
`

const Text = styled.p`
    color: red;
`

const AgreeButton = styled.div`
    width: 50px;
    height: 20px;
    border: 1px solid lightgray;
    border-radius: 4px;
    cursor: pointer;
`

export {Container, BlurBackground, Alert, Text, AgreeButton}