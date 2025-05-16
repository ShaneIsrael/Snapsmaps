import React from 'react'
import Post from '../Post/Post'
import { Spinner } from "@heroui/react"

function Feed({ loading, posts, onOpenPostImage, user, isAuthenticated, ...rest }) {
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
      defaultLiked={post.postLikes?.length > 0}
      post={post}
      onOpenModal={onOpenPostImage}
      user={user}
      isAuthenticated={isAuthenticated}
      {...rest}
    />
  ))
}

Feed.refresh = () => {}

export default Feed
