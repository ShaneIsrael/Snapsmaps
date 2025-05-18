import React from 'react'

import { useAuthed } from '../../hooks/useAuthed'

const splash1 = '/images/splash/splash-1.webp'
const splash2 = '/images/splash/splash-2.webp'
const splash3 = '/images/splash/splash-3.webp'
const splash4 = '/images/splash/splash-4.webp'
const splash5 = '/images/splash/splash-5.webp'
const splash6 = '/images/splash/splash-6.webp'
const splash7 = '/images/splash/splash-7.webp'
const splash8 = '/images/splash/splash-8.webp'
const splash9 = '/images/splash/splash-9.webp'
const splash10 = '/images/splash/splash-10.webp'
const splash11 = '/images/splash/splash-11.webp'
const splash12 = '/images/splash/splash-12.webp'
const splash13 = '/images/splash/splash-13.webp'
const splash14 = '/images/splash/splash-14.webp'

import Logo from '../../assets/logo/dark/Logo'
import LogoWithWordmark from '../../assets/logo/dark/LogoWithWordmark'
import WordmarkNoSlogan from '../../assets/logo/dark/WordmarkNoSlogan'

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
    const randomIndex = Math.floor(Math.random() * currentIndex)
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
    <div className='h-screen bg-gray-950 md:px-2 md:pt-2 md:pb-4'>
      <div className='flex h-full w-full flex-col items-center justify-center gap-5 align-middle md:flex-row md:gap-0'>
        <div className='flex h-full w-full max-w-[520px] flex-col items-center justify-center md:items-end md:bg-gray-950 md:pr-2'>
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={splash1} className="h-full w-full object-cover" />
            <div className='md:-bottom-[450px] -bottom-[400px] absolute h-[500px] w-[150%] skew-y-[15deg] bg-gray-950' />
          </div>
          <LogoWithWordmark className='my-4 hidden h-full max-h-[80px] md:block' />
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <div className='md:-top-[450px] -top-[400px] -skew-y-[15deg] absolute h-[500px] w-[150%] bg-gray-950' />
            <img src={splash2} className='h-full w-full object-cover ' />
          </div>
        </div>

        <div className='hidden h-full w-full max-w-[520px] flex-col items-center justify-center gap-4 bg-gray-950 md:flex'>
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={splash3} className='h-full w-full overflow-hidden object-cover' />
            <div className='-skew-y-[30deg] -bottom-[400px] absolute h-[785px] w-[150%] bg-gray-950 ' />
          </div>
          <div className="relative h-[200%] w-full overflow-hidden md:block">
            <img src={splash4} className='h-full w-full overflow-hidden object-cover' />
            <div className='-top-[400px] absolute h-[785px] w-[150%] skew-y-[30deg] bg-gray-950' />
          </div>

          <div className='absolute flex w-[350px] flex-col items-center justify-center gap-4 '>{children}</div>
        </div>

        <div className='absolute flex w-[350px] flex-col items-center justify-center gap-4 md:hidden'>
          <Logo className="max-h-[60px]" />
          <WordmarkNoSlogan className="h-[30px]" />
          {children}
        </div>
      </div>
    </div>
  )
}

export default Splash
