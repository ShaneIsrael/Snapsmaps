import React from 'react'
import Logo from '../assets/logo/dark/Logo'

function NotFound({ object }) {
  function getMessage() {
    if (object === 'post') return 'It would seem that post no longer exists.'
    if (object === 'collection') return 'That collection no longer exists.'
    return 'That resource does not exist.'
  }
  return (
    <div className="h-screen bg-gray-950">
      <div className="flex flex-col h-full items-center justify-center align-middle w-full gap-5">
        <div className="absolute flex flex-col gap-4 items-center justify-center">
          <Logo className="max-h-[60px] animate-bounce" />
          <div className="font-bold text-7xl italic font-lobster">Sorry</div>
          <div className="font-bold text-2xl text-center">{getMessage()}</div>
        </div>
        <div className="absolute bottom-0 text-xs opacity-40">© 2024 Snapsmaps by Shane Israel</div>
      </div>
    </div>
  )
}

export default NotFound
