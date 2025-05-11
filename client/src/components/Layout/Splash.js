import React from 'react'

import logo from '../../assets/logo/dark/logo_with_wordmark.svg'
import logo_no_wordmark from '../../assets/logo/dark/logo.svg'
import wordmark from '../../assets/logo/dark/wordmark_no_slogan.svg'

import { useAuthed } from '../../hooks/useAuthed'

import splash1 from '../../assets/splash/splash-1.webp'
import splash2 from '../../assets/splash/splash-2.webp'
import splash3 from '../../assets/splash/splash-3.webp'
import splash4 from '../../assets/splash/splash-4.webp'
import splash5 from '../../assets/splash/splash-5.webp'
import splash6 from '../../assets/splash/splash-6.webp'
import splash7 from '../../assets/splash/splash-7.webp'
import splash8 from '../../assets/splash/splash-8.webp'
import splash9 from '../../assets/splash/splash-9.webp'
import splash10 from '../../assets/splash/splash-10.webp'
import splash11 from '../../assets/splash/splash-11.webp'
import splash12 from '../../assets/splash/splash-12.webp'
import splash13 from '../../assets/splash/splash-13.webp'
import splash14 from '../../assets/splash/splash-14.webp'

const SPLASH_IMAGES = [
  splash1,
  splash2,
  splash3,
  splash4,
  splash5,
  splash6,
  splash7,
  splash8,
  splash9,
  splash10,
  splash11,
  splash12,
  splash13,
  splash14,
]

// Shuffle function
function shuffle(array) {
  let currentIndex = array.length

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}

shuffle(SPLASH_IMAGES)

const Splash = ({ children }) => {
  const { loading } = useAuthed()

  if (loading) return <div />

  const splash1 = SPLASH_IMAGES[0]
  const splash2 = SPLASH_IMAGES[1]
  const splash3 = SPLASH_IMAGES[2]
  const splash4 = SPLASH_IMAGES[3]

  return (
    <div className="h-screen md:px-2 md:pt-2 md:pb-4 bg-gray-950">
      <div className="flex flex-col h-full md:flex-row items-center justify-center align-middle w-full gap-5 md:gap-0">
        <div className="flex flex-col h-full w-full items-center justify-center md:items-end md:bg-gray-950 md:pr-2 max-w-[520px]">
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={splash1} className="h-full w-full object-cover" />
            <div className="absolute md:-bottom-[450px]  w-[150%] bg-gray-950 skew-y-[15deg] -bottom-[400px] h-[500px]" />
          </div>
          <img src={logo} className="max-h-[60px] sm:max-h-[80px] my-4 hidden md:block" />
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <div className="absolute md:-top-[450px] -top-[400px] h-[500px] w-[150%] bg-gray-950 -skew-y-[15deg]" />
            <img src={splash2} className="w-full h-full object-cover " />
          </div>
        </div>

        <div className="flex-col gap-4 h-full w-full items-center justify-center bg-gray-950 hidden md:flex max-w-[520px]">
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={splash3} className="w-full h-full object-cover overflow-hidden" />
            <div className="absolute w-[150%] bg-gray-950 -skew-y-[30deg] -bottom-[400px] h-[785px] " />
          </div>
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={splash4} className="w-full h-full object-cover overflow-hidden" />
            <div className="absolute -top-[400px] h-[785px] w-[150%] bg-gray-950 skew-y-[30deg]" />
          </div>

          <div className="absolute flex w-[350px] flex-col gap-4 items-center justify-center ">{children}</div>
        </div>

        <div className="absolute flex w-[350px] flex-col gap-4 items-center justify-center md:hidden">
          <img src={logo_no_wordmark} className="max-h-[60px]" />
          <img src={wordmark} className="h-[30px]" />
          {children}
        </div>
      </div>
    </div>
  )
}

export default Splash
