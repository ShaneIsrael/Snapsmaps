import React from 'react'

function FeedWrapper({ children }) {
  return (
    <div className="min-h-screen h-full flex justify-center flex-grow  pb-[44px]">
      <div className="flex flex-col scroll-smooth w-screen sm:max-w-[400px] items-center gap-2">{children}</div>
    </div>
  )
}

export default FeedWrapper
