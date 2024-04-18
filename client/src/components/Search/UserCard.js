import { Avatar } from '@nextui-org/react'
import React from 'react'
import { getAssetUrl } from '../../common/utils'
import { useNavigate } from 'react-router-dom'

function UserCard({ user }) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/user/${user.mention}`)
  }

  return (
    <div className="w-full flex px-4 py-2 gap-3 hover:bg-slate-950 cursor-pointer" onClick={handleClick}>
      <Avatar radius="full" size="lg" src={user.image?.reference ? getAssetUrl() + user.image?.reference : null} />
      <div className="flex flex-col gap-0.5 items-start justify-center">
        <h4 className="text-md font-bold leading-none text-default-600">{user.displayName}</h4>
        <h5 className="text-small font-semibold text-default-400">@{user.mention}</h5>
      </div>
    </div>
  )
}

export default UserCard
