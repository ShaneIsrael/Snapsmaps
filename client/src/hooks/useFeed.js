import { useEffect, useState } from 'react'
import { FeedService } from '../services'
import { useAuthed } from './useAuthed'

// make sure you update PAGE_SIZE on the backend as well.
const PAGE_SIZE = 5

const useFeed = (type) => {
  const [posts, setPosts] = useState([])
  const [lastDate, setLastDate] = useState()
  const [dataLoading, setDataLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const { loading, isAuthenticated } = useAuthed()

  const refresh = async () => {
    setDataLoading(true)
    setLastDate(null)
    try {
      // dont attempt to fetch following posts when your not logged in.
      if (!isAuthenticated && type === 'following') {
        setPosts([])
      } else {
        const feed =
          type === 'world' ? (await FeedService.getPublicFeed()).data : (await FeedService.getFollowingFeed()).data
        setPosts(feed)
        setLastDate(feed[feed.length - 1].createdAt)
      }
    } catch (err) {
      console.error(err)
    }
    setDataLoading(false)
  }

  console.log(lastDate)
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
            ? (await FeedService.getPublicFeed(lastDate)).data
            : (await FeedService.getFollowingFeed(lastDate)).data
        setPosts((prev) => prev.concat(feed))
        if (feed.length === PAGE_SIZE) {
          setLastDate(feed[feed.length - 1].createdAt)
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
