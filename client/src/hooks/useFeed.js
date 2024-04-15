import { useEffect, useState } from 'react'
import { FeedService } from '../services'
import { useAuthed } from './useAuthed'

const useFeed = (type) => {
  const [posts, setPosts] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const { loading, isAuthenticated } = useAuthed()

  const refresh = async () => {
    setDataLoading(true)
    try {
      // dont attempt to fetch following posts when your not logged in.
      if (!isAuthenticated && type === 'following') {
        setPosts([])
      } else {
        const feed =
          type === 'world' ? (await FeedService.getPublicFeed()).data : (await FeedService.getFollowingFeed()).data
        setPosts(feed)
      }
    } catch (err) {
      console.error(err)
    }
    setDataLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [loading])

  return [dataLoading, posts, refresh]
}

export { useFeed }
