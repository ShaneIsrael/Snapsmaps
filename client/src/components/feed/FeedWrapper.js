import React from 'react'

function FeedWrapper({ children }) {
  return <div className="flex flex-col scroll-smooth sm:max-w-[450px] items-center gap-2 pb-[31px]">{children}</div>
}

export default FeedWrapper
