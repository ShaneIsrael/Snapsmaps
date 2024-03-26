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
} from '@nextui-org/react'
import { AcmeLogo } from './AcmeLogo.js'
import ArrowLeft from '../../assets/icons/ArrowLeft.js'

export default function Appbar({ noProfile, backButton, pageName }) {
  const navigate = useNavigate()
  return (
    <Navbar isBordered>
      <NavbarContent justify="start">
        {!backButton && (
          <NavbarBrand className="mr-4">
            <AcmeLogo />
            <p className="hidden sm:block font-bold text-2xl">Snapmapz</p>
          </NavbarBrand>
        )}
        {backButton && (
          <NavbarBrand className="flex gap-4 align-middle cursor-pointer" onClick={() => navigate(backButton)}>
            <ArrowLeft />
            <h2 className="font-bold text-lg">{pageName}</h2>
          </NavbarBrand>
        )}
        <NavbarContent className="hidden sm:flex gap-3">
          {/* <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link href="#" aria-current="page" color="secondary">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem> */}
        </NavbarContent>
      </NavbarContent>

      {!noProfile && (
        <NavbarContent as="div" className="items-center" justify="end">
          <Dropdown backdrop="blur" placement="bottom-end" className="dark bg-neutral-900 text-foreground">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name="Shane Israel"
                size="md"
                src="https://i.imgur.com/YHaDQot.png"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="signin-info" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">shanemisrael@gmail.com</p>
              </DropdownItem>
              <DropdownItem key="profile" onClick={() => navigate('/profile')}>
                My Profile
              </DropdownItem>
              <DropdownItem key="settings" onClick={() => navigate('/profile')}>
                Settings
              </DropdownItem>
              <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      )}
    </Navbar>
  )
}
