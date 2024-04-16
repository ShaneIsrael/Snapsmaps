import { useEffect, useState } from 'react'
import { FeedService } from '../services'
import { useAuthed } from './useAuthed'

// make sure you update PAGE_SIZE on the backend as well.
const PAGE_SIZE = 5

const useFeed = (type) => {
  const [page, setPage] = useState(0)
  const [posts, setPosts] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const { loading, isAuthenticated } = useAuthed()

  const refresh = async () => {
    setDataLoading(true)
    setPage(0)
    try {
      // dont attempt to fetch following posts when your not logged in.
      if (!isAuthenticated && type === 'following') {
        setPosts([])
      } else {
        const feed =
          type === 'world' ? (await FeedService.getPublicFeed(0)).data : (await FeedService.getFollowingFeed(0)).data
        setPosts(feed)
      }
    } catch (err) {
      console.error(err)
    }
    setDataLoading(false)
  }

  const nextPage = async () => {
    try {
      if (pageLoading) return

      // dont attempt to fetch following posts when your not logged in.
      if (!isAuthenticated && type === 'following') {
        return
      } else {
        setPageLoading(true)
        const feed =
          type === 'world'
            ? (await FeedService.getPublicFeed(page + 1)).data
            : (await FeedService.getFollowingFeed(page + 1)).data
        setPosts((prev) => prev.concat(feed))
        if (feed.length === PAGE_SIZE) {
          setPage((prev) => prev + 1)
        }
      }
    } catch (err) {
      console.error(err)
    }
    setPageLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [loading])

  return [dataLoading, pageLoading, posts, refresh, nextPage]
}

export { useFeed }
