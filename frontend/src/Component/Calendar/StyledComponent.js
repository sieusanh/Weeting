import styled from 'styled-components'

const Container = styled.div`
    width: 240px;
    // height: 300px;
    height: 96.8%;
    border: 2px solid black;
    display: flex;
    flex-direction: column;
    padding: 1px;
    background-color: aquamarine;
`

const HeadLine = styled.div`
    /* width: 100%; */
    width: 98%;
    /* width: auto; */
    // height: 30px;
    height: 10%;
    /* flex: 1; */
    display: flex;
    border: 1px solid black;
    justify-content: space-between;
    align-items: center;
    margin: 1px;
`

const Prev = styled.div`
    font-weight: 500;
    cursor: pointer;
    &:hover {
        color: orange;
    }
`

const Month = styled.div`
    font-weight: 500;
`

const Next = styled.div`
    font-weight: 500;
    cursor: pointer;
    &:hover {
        color: rgb(127, 0, 139);
    }
`

const DateList = styled.div`
    width: 100%;
    /* width: auto; */
    /* flex: 5; */
    // height: 88%;
`

const Day = styled.div`
    width: 100%;
    /* width: auto; */
    display: flex;
`

const Square = styled.div`
    /* flex: 1; */
    /* min-width: 23px; */
    padding: 2px;
    border: 1px solid black;
    margin: 1px;
    text-align: center;
    flex: 0 0 auto;
    width: 26.2px;
    font-weight: 500;
    cursor: pointer;
    &:focus {
        color: red;
    }
    &:hover {
        background-color: red;
    }
`

const DaySquare = styled(Square)`
    &:hover {
        background-color: pink;
    }
`

const Dates = styled.div`
    width: 100%;
    /* width: auto; */
    display: flex;
    flex-wrap: wrap;
`

const VirtualSquare = styled.div`
    text-align: center;
    flex: 0 0 auto;
    width: 34.2px;
`

export {Container, HeadLine, Prev, Month, Next, DateList, 
    Day, DaySquare, Dates, VirtualSquare, Square}