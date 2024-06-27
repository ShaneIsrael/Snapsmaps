import React from 'react'

import logo from '../../assets/logo/dark/logo_with_wordmark.svg'
import splash1 from '../../assets/splash/splash-1.webp'
import splash2 from '../../assets/splash/splash-2.webp'
import splash3 from '../../assets/splash/splash-3.webp'
import splash4 from '../../assets/splash/splash-4.webp'
import { useAuthed } from '../../hooks/useAuthed'

function shuffle(array) {
  let currentIndex = array.length

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}

const SPLASH_IMAGES = [splash1, splash2, splash3, splash4]
shuffle(SPLASH_IMAGES)

const Splash = ({ children }) => {
  const { loading, isAuthenticated } = useAuthed()

  if (loading) return <div />

  return (
    <div className="h-screen md:p-4 bg-zinc-950">
      <div className="flex flex-col h-full md:flex-row items-center justify-center align-middle w-full gap-5 md:gap-0">
        <div className="flex flex-col h-full w-full items-center justify-center md:items-end md:bg-zinc-950 md:pr-4 max-w-[692px]">
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={SPLASH_IMAGES[0]} className="w-full h-full object-cover" />
            <div className="absolute md:-bottom-[450px]  w-[150%] bg-zinc-950 skew-y-[15deg] -bottom-[400px] h-[500px]" />
          </div>
          <img src={logo} className="max-h-[60px] sm:max-h-[80px] my-4 hidden md:block" />
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <div className="absolute md:-top-[450px] -top-[400px] h-[500px] w-[150%] bg-zinc-950 -skew-y-[15deg]" />
            <img src={SPLASH_IMAGES[1]} className="w-full h-full object-cover " />
          </div>
        </div>
        <div className="flex-col gap-4  h-full w-full items-center justify-center md:bg-gradient-to-tr md:from-sky-900 md:to-purple-900 md:px-4 hidden md:flex">
          {children}
        </div>
        <div className="absolute flex w-[350px] flex-col gap-4 items-center justify-center md:hidden">
          <img src={logo} className="max-h-[70px] mb-8" />
          {children}
        </div>
        <div className="absolute bottom-0 text-xs opacity-40">© 2024 Snapsmaps by Shane Israel</div>
      </div>
    </div>
  )
}

export default Splash
