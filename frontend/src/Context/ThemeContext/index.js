
import {useState, createContext, memo} from 'react'

const ThemeContext = createContext()

function ThemeProvider({ children }) {
	
    const [darkTheme, setDarkTheme] = useState(false)
	
    return (
      <ThemeContext.Provider value={{darkTheme, setDarkTheme}}>
              {children}
      </ThemeContext.Provider>
    )
}

export {ThemeContext}
export default memo(ThemeProvider)

