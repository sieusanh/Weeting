import axios from 'axios'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {Form} from './StyledComponent'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [invalidUsername, setInvalidUsername] = useState('')
    const [invalidPassword, setInvalidPassword] = useState('')
    const navigate = useNavigate()
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
                    navigate('/chat')
                }        
            }
        })
        .catch(err => console.log(err.response.data))
    }
    return (
        <div>
            <h1>Login</h1>
            <Form>
                <input 
                    placeholder='Username...'
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
                <input 
                    placeholder='Password...'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div>
                    {
                        invalidPassword &&
                        <span style={{color: 'red'}}>
                            Invalid password
                        </span>}
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </Form>
        </div>
    )
}

export default Login