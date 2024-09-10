import React, { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Route, Routes } from 'react-router-dom'

import Dashboard from './views/Dashboard'
import Signup from './components/Signup/Signup'
import Profile from './views/Profile'
import VerifyEmail from './views/VerifyEmail'
import UserSearch from './views/UserSearch'
import ProfileFollows from './views/ProfileFollows'
import PostLikes from './views/PostLikes'
import AdminDashboard from './views/AdminDashboard'

import PushNotificationHandler from './firebase/PushNotificationHandler'
import Landing from './views/Landing'
import Collection from './views/Collection'

const router = createBrowserRouter([
  { path: '/user/*', Component: UserRoot },
  { path: '/profile/*', Component: ProfileRoot },
  { path: '/post/*', Component: PostRoot },
  { path: '/search/*', Component: SearchRoot },
  { path: '/admin/*', Component: AdminRoot },
  { path: '*', Component: Root },
])

function Root() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feed" element={<Dashboard />} />
      <Route path="/verify/:email/:token" element={<VerifyEmail />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function UserRoot() {
  return (
    <Routes>
      <Route path="/:mention" element={<Profile isMention />} />
      <Route path="/:mention/follows" element={<ProfileFollows />} />
      <Route path="/:mention/collection/:collectionId" element={<Collection />} />
      <Route path="/:mention/:postId" element={<Profile isMention />} />
      <Route path="/:mention/:postId/:tabId" element={<Profile isMention />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function ProfileRoot() {
  return (
    <Routes>
      <Route path="/" element={<Profile isSelfProfile />} />
      <Route path="/follows" element={<ProfileFollows />} />
      <Route path="/collection/:collectionId" element={<Collection />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function PostRoot() {
  return (
    <Routes>
      <Route path="/:postId/likes" element={<PostLikes />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function SearchRoot() {
  return (
    <Routes>
      <Route path="/" element={<UserSearch />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function AdminRoot() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="*" element={<div>not found</div>} />
    </Routes>
  )
}

function App() {
  return (
    <>
      <PushNotificationHandler />
      <RouterProvider router={router} />
    </>
  )
}

export default App
