import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, NavbarBrand, NavbarContent } from '@heroui/react'
import ArrowLeft from '../../assets/icons/ArrowLeft.jsx'
import clsx from 'clsx'

import Logo from '../../assets/logo/dark/Logo.jsx'
import Wordmark from '../../assets/logo/dark/Wordmark.jsx'

export default function Appbar({ backButton, pageName, allowPost, hidden, styles }) {
  const navigate = useNavigate()

  return (
    <Navbar isBordered className={clsx('fixed', { hidden })} style={{ ...styles }}>
      <NavbarContent justify="start" className="align-middle items-center">
        {!backButton && (
          <NavbarBrand className="mr-4 mt-1 cursor-pointer h-full" onClick={() => navigate('/feed')}>
            <div className="flex items-center justify-center h-full">
              <Logo className="h-9 mr-2 sm:block hidden " />
              <Wordmark className="h-8 " />
            </div>
          </NavbarBrand>
        )}
        {backButton && (
          <NavbarBrand className="flex gap-4 align-middle cursor-pointer" onClick={backButton}>
            <ArrowLeft />
            <h2 className="font-bold text-lg">{pageName}</h2>
          </NavbarBrand>
        )}
        <NavbarContent className="hidden sm:flex gap-3"></NavbarContent>
      </NavbarContent>
    </Navbar>
  )
}
