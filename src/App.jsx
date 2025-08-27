import { useState, useEffect } from 'react'
import Login from './Components/Login/Login'
import Mainpage from './Components/Mainpage.jsx'
function App() {
  const [logged, setLogged] = useState("");
  

  return (
    <div>
      {!logged ? (
      <Login onLogin={() => setLogged(true)} />
      ) : (
        <Mainpage/>
      )}    
    </div>
  )
}

export default App
