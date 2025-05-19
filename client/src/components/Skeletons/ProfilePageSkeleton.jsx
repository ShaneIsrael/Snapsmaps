import { Divider, Skeleton } from '@heroui/react'
import React from 'react'

function ProfilePageSkeleton({ appbar, footer }) {
  return (
    <div className="flex justify-center">
      <div className='flex h-screen w-full flex-col sm:max-w-[1024px]'>
        {appbar}
        <div className='mx-0 flex-grow overflow-y-auto pt-20 pb-[50px]'>
          <div className='flex max-w-[500px] items-start justify-start gap-5 px-4'>
            <div className="flex flex-col gap-4">
              <Skeleton className='h-20 w-20 rounded-full' />
              <Skeleton className='h-8 w-20 rounded-md' />
            </div>
            <div className='flex w-full flex-col items-start justify-center gap-4'>
              <div className="h-[125px] w-full">
                <Skeleton className='h-8 w-44 rounded-md' />
                <Skeleton className='mt-2 h-5 w-28 rounded-md' />
                <Skeleton className='mt-3 h-3 w-72 rounded-md' />
                <Skeleton className='mt-1 h-3 w-72 rounded-md' />
                <Skeleton className='mt-1 h-3 w-72 rounded-md' />
                <Skeleton className='mt-1 h-3 w-72 rounded-md' />
              </div>
              <div className='flex items-end gap-5'>
                <div className='flex justify-center gap-5'>
                  <div className="flex flex-col items-center">
                    <Skeleton className='mt-1 h-12 w-16 rounded-md' />
                  </div>
                  <div
                    className='flex cursor-pointer flex-col items-center'
                    onClick={() => navigate('follows#followers')}
                  >
                    <Skeleton className='mt-1 h-12 w-16 rounded-md' />
                  </div>
                  <div
                    className='flex cursor-pointer flex-col items-center'
                    onClick={() => navigate('follows#following')}
                  >
                    <Skeleton className='mt-1 h-12 w-16 rounded-md' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider className="my-5" />
          <div className="flex flex-wrap justify-center gap-2">
            <Skeleton className='h-40 w-full max-w-[478px]' />
            <Skeleton className='h-40 w-full max-w-[478px]' />
            <Skeleton className='h-40 w-full max-w-[478px]' />
          </div>
          <Divider className="my-5" />
          <div className="grid grid-cols-[repeat(auto-fill,120px)] justify-center">
            <Skeleton className='h-[120px] w-[120px] border-1 border-black' />
            <Skeleton className='h-[120px] w-[120px] border-1 border-black' />
            <Skeleton className='h-[120px] w-[120px] border-1 border-black' />
            <Skeleton className='h-[120px] w-[120px] border-1 border-black' />
          </div>
          <Divider className="my-5" />
          <div className='flex h-64 flex-row'>
            <Skeleton className='h-full w-full' />
          </div>
        </div>
        {appbar}
      </div>
    </div>
  )
}

export default ProfilePageSkeleton
