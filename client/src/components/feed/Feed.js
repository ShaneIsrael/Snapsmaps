import React, { useEffect, useState } from 'react'
import { FeedService } from '../../services'
import Post from '../Post/Post'
import { useAuthed } from '../../hooks/useAuthed'
import { Spinner } from '@nextui-org/react'

function Feed({ type, onOpenPostImage }) {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState()
  const { user, isAuthenticated } = useAuthed()

  async function fetch() {
    try {
      setLoading(true)
      const feed =
        type === 'world' ? (await FeedService.getPublicFeed()).data : (await FeedService.getFollowingFeed()).data
      setPosts(feed)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [])

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

export default Feed
