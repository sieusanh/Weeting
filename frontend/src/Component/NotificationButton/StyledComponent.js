import styled from 'styled-components'

const Container = styled.div`
    cursor: pointer;
`

const Icon = styled.div`
    cursor: pointer;
`

const NotificationBoard = styled.div`
    position: absolute;
    top: 84px;
    right: 190px;

    width: 280px;
    height: 340px;
    padding: 5px;

    display: flex;
    flex-direction: column;
    // align-item: center;

    border: 1px solid lightgray;
    border-radius: 7px;
    // box-shadow: 1px 1px 8px 32px #F8F9F9, -1px -1px 8px 2px #F8F9F9;
    // box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    box-shadow: #0000003D 0px 3px 8px;

    // text-align: center;
    // line-height: 200px;
    color: red;
`

const NotificationItem = styled.div`
    width: 96%;;
    height: 60px;
    border-bottom: 1px solid lightgray;
    display: flex;
    flex-direction: column;
    text-align: center;
`

const Confirmation = styled.div`
    display: flex;
`

const Confirm = styled.div`
    width: 60px;
    height: 30px;
    border: 1px solid lightgray;
    border-radius: 10px;
    text-align: center;
    line-height: 30px;
    &:hover {
        background-color: var(--mainBlue);
    }
`

const Accept = styled(Confirm)`

`

const Decline = styled(Confirm)`

`

export {Container, Icon, NotificationBoard, 
    NotificationItem, Confirmation, Accept, 
    Decline}