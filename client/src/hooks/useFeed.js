import { useEffect, useState } from 'react'
import { FeedService } from '../services'

const useFeed = (type) => {
  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const feed =
        type === 'world' ? (await FeedService.getPublicFeed()).data : (await FeedService.getFollowingFeed()).data
      setPosts(feed)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return [loading, posts, refresh]
}

export { useFeed }
