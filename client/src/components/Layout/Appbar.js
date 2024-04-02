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
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/solid'

export default function Appbar({ noProfile, backButton, pageName, allowPost }) {
  const navigate = useNavigate()

  const profile = getSessionUser()

  const { logout } = useAuth()

  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        {!backButton && (
          <NavbarBrand className="mr-4">
            <AcmeLogo />
            <p className="hidden sm:block font-bold text-2xl">SnapsMaps</p>
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

      {!noProfile ? (
        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown backdrop="blur" placement="bottom-end" className="dark bg-neutral-900 text-foreground">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                size="md"
                src={profile?.image ? `${getAssetUrl('profile')}/${profile.image}` : ''}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="signin-info" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{profile?.email}</p>
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
          <Tooltip color="primary" content="Login" className="capitalize">
            <div className="cursor-pointer" onClick={() => navigate('/login')}>
              <ArrowRightEndOnRectangleIcon width="32" height="32" />
            </div>
          </Tooltip>
        </NavbarContent>
      )}
    </Navbar>
  )
}
