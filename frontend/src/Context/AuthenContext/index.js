
import { useState, useEffect, createContext, memo } from 'react'

const AuthenContext = createContext()

function AuthenProvider({ children }) {
    const [authen, setAuthen] = useState(false)
    const [reload, setReload] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('userId'))
            setReload(true)
    }, [authen])
    
    return (
        <AuthenContext.Provider value={{authen, setAuthen}}>
            {children}
        </AuthenContext.Provider>
    )
}

export { AuthenContext }
export default memo(AuthenProvider)

