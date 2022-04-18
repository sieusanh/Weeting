import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {Container, Title, Form, Input, 
    Submit} from './StyledComponent'

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameExisted, setUsernameExisted] = useState(false)
    const [invalidPassword, setInvalidPassword] = useState('')
    const navigate = useNavigate()
    const handleSubmit = event => {
        event.preventDefault()
        axios.post('/auth/check-username-exist', { username })
        .then(res => {
            const data = res.data
            if (data === 'Existed'){
                setUsernameExisted(true)
                setUsername('')
                setPassword('')
                throw 'Cancel'
            }
            if (res.status === 500)
                console.log('Error: ', data)
        })
        .then(res1 => {
            axios.post('/auth/signup', {
                username, password
            })
            .then(res2 => {
                const data = res2.data
                if (res2.status === 201)
                    navigate('/login')
                if (res2.status === 400)
                    console.log('Loi: ', data)
                //err handle
            })
            .catch(error => console.log('loi catch: ', error))
            setUsernameExisted(false)
        })
        .catch(err => console.log(err))
    } 
    return (
        <Container>
            <Title>Signup</Title>
            <Form>
                Email / Username
                <Input 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <div>
                    {
                        usernameExisted &&
                        <span style={{color: 'red'}}>
                            Username existed
                        </span>
                    }
                </div>
                Password
                <Input 
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div>
                    {
                        invalidPassword &&
                        <span style={{color: 'red'}}>
                            Invalid password
                        </span>
                    }
                </div>
                <Submit 
                    onClick={handleSubmit}
                >
                    Submit
                </Submit>
            </Form>
        </Container>
    )
}

export default Signup