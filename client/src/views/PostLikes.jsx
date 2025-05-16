import { Tabs, Tab } from "@heroui/react"
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getSessionUser } from '../common/utils'
import { PostService, ProfileService } from '../services'
import ListEndCard from '../components/Search/ListEndCard'
import PageLayout from '../components/Layout/PageLayout'
import UserCard from '../components/Follows/UserCard'

const PAGE_SIZE = 50

function PostLikes() {
  const { postId } = useParams()

  const navigate = useNavigate()
  const [reachedLastPage, setReachedLastPage] = React.useState(false)
  const [lastDate, setLastDate] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [postLikes, setPostLikes] = React.useState([])

  async function fetch() {
    setLoading(true)
    try {
      let results = (await PostService.getPostLikes(postId, lastDate, PAGE_SIZE)).data

      if (results.length < PAGE_SIZE) {
        setReachedLastPage(true)
      }
      setLastDate(results[results.length - 1]?.createdAt)
      setPostLikes((prev) => prev.concat(results))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLastDate(null)
    setLoading(false)
    setReachedLastPage(false)
    fetch(null)
  }, [postId])

  return (
    <PageLayout noProfile backButton={() => navigate(-1)} pageName="Likes">
      {({ user, isAuthenticated }) => (
        <div className="flex flex-col flex-grow items-center mx-0 mt-2 pt-16 overflow-y-auto">
          <div className="w-full px-6">
            {postLikes.map((like) => (
              <UserCard key={like.id} user={like.user} />
            ))}
            {reachedLastPage && <ListEndCard label="No more results" />}
            {!reachedLastPage && <ListEndCard label="Load more" onClick={() => fetch(lastDate)} />}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default PostLikes
