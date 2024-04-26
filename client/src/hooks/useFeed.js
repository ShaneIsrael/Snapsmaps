import { useEffect, useState } from 'react'
import { FeedService } from '../services'
import { getSessionUser } from '../common/utils'

// make sure you update PAGE_SIZE on the backend as well.
const PAGE_SIZE = 5

/**
 * @typedef {Object} Feed
 * @property {boolean} isRefreshing - If the feed is being refreshed.
 * @property {boolean} isPageLoading - If the next page is loading.
 * @property {boolean} noMoreResults - If there are no more results to load.
 * @property {object} posts - Array of posts.
 * @property {Function} setPosts - Sets the posts.
 * @property {Function} refresh - Refreshes the feed completely.
 * @property {Function} nextPage - Fetches the next page of posts and appends to the current post data.
 *
 * @returns {Feed}
 */
const useFeed = (type) => {
  const [posts, setPosts] = useState([])
  const [lastDate, setLastDate] = useState()
  const [hasReachedLastPage, setHasReachedLastPage] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const hasSession = !!getSessionUser()

  const refresh = async () => {
    setDataLoading(true)
    setLastDate(null)
    try {
      // dont attempt to fetch following posts when your not logged in.
      if (!hasSession && type === 'following') {
        return
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

  const nextPage = async () => {
    try {
      if (pageLoading) return

      // dont attempt to fetch following posts when your not logged in.
      if (!hasSession && type === 'following') {
        return
      } else {
        if (!hasReachedLastPage) {
          setPageLoading(true)
          const feed =
            type === 'world'
              ? (await FeedService.getPublicFeed(lastDate)).data
              : (await FeedService.getFollowingFeed(lastDate)).data
          setPosts((prev) => prev.concat(feed))
          if (feed.length === PAGE_SIZE) {
            setLastDate(feed[feed.length - 1].createdAt)
          } else {
            setHasReachedLastPage(true)
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
    setPageLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  return {
    isRefreshing: dataLoading,
    isPageLoading: pageLoading,
    noMoreResults: hasReachedLastPage,
    posts,
    setPosts,
    refresh,
    nextPage,
  }
}

export { useFeed }
