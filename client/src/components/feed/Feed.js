import React from 'react'
import Post from '../Post/Post'
import { useAuthed } from '../../hooks/useAuthed'
import { Spinner } from '@nextui-org/react'

function Feed({ loading, posts, onOpenPostImage }) {
  const { user, isAuthenticated } = useAuthed()

  if (loading)
    return (
      <div className="flex w-full justify-center">
        <Spinner size="lg" color="default" />
      </div>
    )
  return posts?.map((post) => (
    <Post
      key={`post-${post.id}`}
      isSelf={user?.mention === post.user.mention}
      post={post}
      onOpenModal={onOpenPostImage}
    />
  ))
}

Feed.refresh = () => {}

export default Feed
