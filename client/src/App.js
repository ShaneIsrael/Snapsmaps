import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Route, Routes } from 'react-router-dom'

import Login from './views/Login'

import Dashboard from './views/Dashboard'
import Signup from './views/Signup'
import Profile from './views/Profile'
import VerifyEmail from './views/VerifyEmail'
import UserSearch from './views/UserSearch'
import ProfileFollows from './views/ProfileFollows'

const router = createBrowserRouter([{ path: '*', Component: Root }])

function Root() {
  const [appearance, setAppearance] = useState('dark')

  const toggle = () => {
    setAppearance(appearance === 'dark' ? 'light' : 'dark')
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile isSelf />} />
      <Route path="/profile/follows" element={<ProfileFollows />} />
      <Route path="/search" element={<UserSearch />} />
      <Route path="/user/:mention/" element={<Profile isMention />} />
      <Route path="/user/:mention/follows" element={<ProfileFollows />} />
      <Route path="/verify/:email/:token" element={<VerifyEmail />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function App() {
  return <RouterProvider router={router} />
}

export default App
