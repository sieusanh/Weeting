
import Navbar from './Component/Navbar'
import Footer from './Component/Footer'
import HomePage from './Page/HomePage'
import LoginPage from './Page/LoginPage'
import SignupPage from './Page/SignupPage'
import ChatPage from './Page/ChatPage'
import PageNotFound from './Page/PageNotFound'
import { Routes, Route } from 'react-router-dom'
import './style.css'

function App() {
  return (
    <div className="container">
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/chat' element={<ChatPage />} />
		    <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
