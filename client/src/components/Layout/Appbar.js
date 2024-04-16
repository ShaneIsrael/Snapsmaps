import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Tooltip,
} from '@nextui-org/react'
import { AcmeLogo } from './AcmeLogo.js'
import ArrowLeft from '../../assets/icons/ArrowLeft.js'
import { getAssetUrl, getSessionUser } from '../../common/utils.js'
import { useAuth } from '../../hooks/useAuth.js'
import { ArrowLeftEndOnRectangleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid'
import { useAuthed } from '../../hooks/useAuthed.js'
import Logo1 from '../../assets/icons/Logo1.js'
import clsx from 'clsx'

export default function Appbar({ backButton, pageName, allowPost, hidden, styles }) {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthed()
  const { logout } = useAuth()

  return (
    <Navbar isBordered className={clsx('fixed', { hidden })} style={{ ...styles }}>
      <NavbarContent justify="start" className="align-middle items-center">
        {!backButton && (
          <NavbarBrand className="mr-4 mt-1 cursor-pointer" onClick={() => navigate('/')}>
            <Logo1 className="w-9 h-9 mr-2 mb-2" />
            <p className="text-center text-neutral-200 tracking-wider text-3xl font-bold font-vibes">Snapsmaps</p>
          </NavbarBrand>
        )}
        {backButton && (
          <NavbarBrand className="flex gap-4 align-middle cursor-pointer" onClick={() => navigate(backButton)}>
            <ArrowLeft />
            <h2 className="font-bold text-lg">{pageName}</h2>
          </NavbarBrand>
        )}
        <NavbarContent className="hidden sm:flex gap-3"></NavbarContent>
      </NavbarContent>
    </Navbar>
  )
}
