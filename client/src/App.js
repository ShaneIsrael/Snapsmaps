import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Route, Routes } from 'react-router-dom'

import Login from './views/Login'

import { useAuthed } from './hooks/useAuthed'
import Welcome from './views/Welcome'
import Signup from './views/Signup'
import Profile from './views/Profile'

const router = createBrowserRouter([{ path: '*', Component: Root }])

function RequireAuth({ children, redirectTo }) {
  const { loading, isAuthenticated } = useAuthed()
  if (loading) return <div />
  return isAuthenticated ? children : <Navigate to={redirectTo} />
}

function Root() {
  const [appearance, setAppearance] = useState('dark')

  const toggle = () => {
    setAppearance(appearance === 'dark' ? 'light' : 'dark')
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome modeToggle={toggle} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/profile"
        element={
          <RequireAuth redirectTo={'/login'}>
            <Profile isSelf />
          </RequireAuth>
        }
      />
      <Route path="/user/:mention/" element={<Profile />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function App() {
  return <RouterProvider router={router} />
}

export default App
