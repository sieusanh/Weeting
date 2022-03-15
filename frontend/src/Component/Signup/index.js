import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {Form } from './StyledComponent'

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameExisted, setUsernameExisted] = useState(false)
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
        <div>
            <h1>Signup</h1>
            <Form>
                <input 
                    placeholder='Username...'
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
                <input 
                    placeholder='Password...'
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
            </Form>
        </div>
    )
}

export default Signup