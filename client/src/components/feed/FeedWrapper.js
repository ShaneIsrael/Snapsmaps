import React from 'react'

function FeedWrapper({ size, children }) {
  return (
    <div className="flex flex-col scroll-smooth sm:max-w-[450px] items-center gap-2 pb-[40px]" style={{ height: size }}>
      {children}
    </div>
  )
}

export default FeedWrapper
