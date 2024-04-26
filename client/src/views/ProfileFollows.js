import { Tabs, Tab } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getSessionUser } from '../common/utils'
import { ProfileService } from '../services'
import ListEndCard from '../components/Search/ListEndCard'
import PageLayout from '../components/Layout/PageLayout'
import UserCard from '../components/Follows/UserCard'

const PAGE_SIZE = 25

function ProfileFollows() {
  const location = useLocation()
  const { hash } = location
  const { mention } = useParams()

  const navigate = useNavigate()
  const [lastDate, setLastDate] = React.useState()
  const [loading, setLoading] = React.useState(false)
  const [followResults, setFollowResults] = React.useState([])
  const [reachedLastPage, setReachedLastPage] = React.useState(false)

  async function fetch(date) {
    setLoading(true)
    try {
      let results
      if (hash === '#following') {
        results = (await ProfileService.getFollowing(mention, date)).data
      } else {
        results = (await ProfileService.getFollowers(mention, date)).data
      }
      console.log(results)
      if (results.length < PAGE_SIZE) {
        setReachedLastPage(true)
      }
      setLastDate(results[results.length - 1]?.createdAt)
      setFollowResults(results || [])
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
  }, [hash, mention])

  const profile = getSessionUser()

  return (
    <PageLayout
      noProfile
      backButton={() => navigate(mention ? `/user/${mention}` : '/profile')}
      pageName={mention || profile?.mention}
    >
      {({ user, isAuthenticated }) => (
        <div className="flex flex-col flex-grow items-center mx-0 mt-2 pt-16 overflow-y-auto">
          <Tabs aria-label="follows tabs" variant="underlined" selectedKey={hash}>
            <Tab key="#followers" title="Followers" href="#followers" className="w-full px-6">
              {followResults.map((follow) => (
                <UserCard key={follow.id} user={follow.follower} />
              ))}
              {reachedLastPage && <ListEndCard label="No more results" />}
              {!reachedLastPage && <ListEndCard label="Load more" onClick={() => fetch(lastDate)} />}
            </Tab>
            <Tab key="#following" title="Following" href="#following" className="w-full px-6">
              {followResults.map((follow) => (
                <UserCard key={follow.id} user={follow.followed} />
              ))}
              {reachedLastPage && <ListEndCard label="No more results" />}
              {!reachedLastPage && <ListEndCard label="Load more" onClick={() => fetch(lastDate)} />}
            </Tab>
          </Tabs>
        </div>
      )}
    </PageLayout>
  )
}

export default ProfileFollows
