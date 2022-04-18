import axios from 'axios'
import {useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {AuthenContext} from '../../Context/AuthenContext'
import {Container, Title, Form, Input, 
    Submit} from './StyledComponent'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidUsername, setInvalidUsername] = useState('')
    const [invalidPassword, setInvalidPassword] = useState('')
    const navigate = useNavigate()
    const authenContext = useContext(AuthenContext)
    const {setAuthen} = authenContext

    function handleSubmit(event) {
        event.preventDefault()
        axios.post('/auth/login', {username, password})
        .then(res => {
            const user = res.data
            if (res.status === 400)
                navigate('/login')
            
            if (res.status === 200){
                if (user) { 
                    localStorage.setItem('userId', user.id)
                    localStorage.setItem('username', user.username)
                    setAuthen(true)
                    navigate('/chat')
                }        
            }
        })
        .catch(err => console.log(err.message))
    }
    return (
        <Container>
            <Title>Login</Title>
            <Form>
                Email / Username
                <Input 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <div>
                    {
                        invalidUsername &&
                        <span style={{color: 'red'}}>
                            Invalid username
                        </span>}
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
                <div>
                    Don't have an account?
                    <Link to='/signup'>
                        Sign up
                    </Link>
                </div>
                <Submit 
                    onClick={handleSubmit}
                >
                    Sign in
                </Submit>
            </Form>
        </Container>
    )
}

export default Login