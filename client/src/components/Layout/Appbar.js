import React from 'react'
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

export default function Appbar({ noProfile, backButton, pageName, allowPost, hidden }) {
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAuthed()

  const { logout } = useAuth()

  return (
    <Navbar isBordered className={clsx({ hidden })}>
      <NavbarContent justify="start">
        {!backButton && (
          <NavbarBrand className="mr-4 cursor-pointer" onClick={() => navigate('/')}>
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

      {/* {!noProfile ? (
        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown backdrop="blur" placement="bottom-end" className="dark bg-neutral-900 text-foreground">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                size="md"
                src={user?.image ? getAssetUrl() + user.image : ''}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="signin-info" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="profile" onClick={() => navigate('/profile')}>
                My Profile
              </DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger" onClick={logout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent as="div" className="items-center" justify="end">
          <Tooltip
            color={isAuthenticated ? 'danger' : 'primary'}
            content={isAuthenticated ? 'Logout' : 'Login'}
            className="capitalize"
          >
            {isAuthenticated ? (
              <div className="cursor-pointer" onClick={logout}>
                <ArrowLeftEndOnRectangleIcon className="fill-red-600" width="32" height="32" />
              </div>
            ) : (
              <div className="cursor-pointer" onClick={() => navigate('/login')}>
                <ArrowRightEndOnRectangleIcon width="32" height="32" />
              </div>
            )}
          </Tooltip>
        </NavbarContent>
      )} */}
    </Navbar>
  )
}
