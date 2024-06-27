import React from 'react'
import { useAuthed } from '../../hooks/useAuthed'
import Appbar from './Appbar'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Spinner } from '@nextui-org/react'

function PageLayout({
  showNav = true,
  fullwidth = false,
  backButton,
  pageName,
  noProfile,
  hideProfileSelect,
  onHome,
  onSubmit,
  AppbarProps,
  FooterProps,
  children,
}) {
  const { loading, user, isAuthenticated } = useAuthed()
  const navigate = useNavigate()

  return (
    <div className="flex justify-center">
      <div className={clsx('flex flex-col  w-full  h-screen', { 'sm:max-w-[1024px]': !fullwidth })}>
        <Appbar
          noProfile={!isAuthenticated || noProfile}
          styles={{
            animation: `${showNav ? 'navbarShow' : 'navbarHide'} 0.2s ease forwards`,
          }}
          pageName={pageName}
          backButton={backButton}
          {...AppbarProps}
        />
        {children({ loading, user, isAuthenticated })}
        <Footer
          handleOnHome={onHome || (() => navigate('/feed'))}
          handleOnSubmit={onSubmit || (() => navigate('/feed'))}
          noProfile={!isAuthenticated}
          user={user}
          isAuthenticated={isAuthenticated}
          hideProfileSelect={hideProfileSelect}
          {...FooterProps}
        />
      </div>
    </div>
  )
}

export default PageLayout
