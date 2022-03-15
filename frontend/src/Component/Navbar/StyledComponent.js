import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content: space-between;
`

const Logo = styled.img`
    border: 1px solid gray;
`

const UserContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

export { Container, Logo, UserContainer }