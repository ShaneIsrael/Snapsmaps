import { Divider, Skeleton } from '@nextui-org/react'
import React from 'react'

function ProfilePageSkeleton({ appbar, footer }) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full sm:max-w-[1024px] h-screen">
        {appbar}
        <div className="flex-grow mx-0 pb-[50px] pt-20 overflow-y-auto">
          <div className="flex px-4 gap-5 max-w-[500px] justify-start items-start">
            <div className="flex flex-col gap-4">
              <Skeleton className="rounded-full w-20 h-20" />
              <Skeleton className="rounded-md w-20 h-8" />
            </div>
            <div className="w-full flex flex-col gap-4 items-start justify-center">
              <div className="h-[125px] w-full">
                <Skeleton className="rounded-md w-44 h-8" />
                <Skeleton className="rounded-md w-28 h-5 mt-2" />
                <Skeleton className="rounded-md w-72 h-3 mt-3" />
                <Skeleton className="rounded-md w-72 h-3 mt-1" />
                <Skeleton className="rounded-md w-72 h-3 mt-1" />
                <Skeleton className="rounded-md w-72 h-3 mt-1" />
              </div>
              <div className="flex gap-5 items-end">
                <div className="flex gap-5 justify-center">
                  <div className="flex flex-col items-center">
                    <Skeleton className="rounded-md w-16 h-12 mt-1" />
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('follows#followers')}
                  >
                    <Skeleton className="rounded-md w-16 h-12 mt-1" />
                  </div>
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => navigate('follows#following')}
                  >
                    <Skeleton className="rounded-md w-16 h-12 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Divider className="my-5" />
          <div className="flex flex-wrap justify-center gap-2">
            <Skeleton className="h-40 max-w-[478px] w-full" />
            <Skeleton className="h-40 max-w-[478px] w-full" />
            <Skeleton className="h-40 max-w-[478px] w-full" />
          </div>
          <Divider className="my-5" />
          <div className="grid grid-cols-[repeat(auto-fill,120px)] justify-center">
            <Skeleton className="w-[120px] h-[120px] border-1 border-black" />
            <Skeleton className="w-[120px] h-[120px] border-1 border-black" />
            <Skeleton className="w-[120px] h-[120px] border-1 border-black" />
            <Skeleton className="w-[120px] h-[120px] border-1 border-black" />
          </div>
          <Divider className="my-5" />
          <div className="flex flex-row h-64">
            <Skeleton className="w-full h-full" />
          </div>
        </div>
        {appbar}
      </div>
    </div>
  )
}

export default ProfilePageSkeleton
