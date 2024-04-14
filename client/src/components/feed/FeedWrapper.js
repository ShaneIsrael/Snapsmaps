import React from 'react'

function FeedWrapper({ children }) {
  return (
    <div className="min-h-screen h-full flex justify-center flex-grow  pb-[44px]">
      <div className="flex flex-col scroll-smooth sm:max-w-[400px] w-full items-center gap-2">{children}</div>
    </div>
  )
}

export default FeedWrapper
