import { Skeleton } from '@heroui/react'
import React, { useState, useEffect } from 'react'

const AspectRatioPlaceholder = ({ width, height, className, children }) => {
  return (
    <div
      className={`mx-auto max-h-screen w-full ${className}`}
      style={{
        aspectRatio: Number(width) / Number(height)
      }}
    >
      {children ? children : <Skeleton className='h-full w-full rounded-lg' />}
    </div>
  )
}

export default AspectRatioPlaceholder
