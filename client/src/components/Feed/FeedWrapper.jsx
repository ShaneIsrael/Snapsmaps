import React from 'react'

const FeedWrapper = ({ size, children }, ref) => {
  return (
    <div
      ref={ref}
      className="flex flex-col scroll-smooth sm:max-w-[450px] items-center gap-2 pb-[40px]"
      style={{ height: size }}
    >
      {children}
    </div>
  )
}

export default React.forwardRef(FeedWrapper)
