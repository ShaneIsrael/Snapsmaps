import React, { useState } from 'react'
import Splash from '../components/Layout/Splash'
import Login from '../components/Login/Login'
import Signup from '../components/Signup/Signup'

function Landing() {
  const [showLogin, setShowLogin] = useState(true)
  return (
    <Splash>
      {showLogin ? <Login onSignup={() => setShowLogin(false)} /> : <Signup onLogin={() => setShowLogin(true)} />}
    </Splash>
  )
}

export default Landing
