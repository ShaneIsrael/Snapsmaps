import {
  Button,
  Image,
  Avatar,
  Divider,
  useDisclosure,
  Modal,
  ModalContent,
  Input,
  Textarea,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tabs,
  Tab,
} from '@nextui-org/react'
import React, { useEffect } from 'react'
import Appbar from '../components/Layout/Appbar'
import Post from '../components/Post/Post'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getAssetUrl, getSessionUser } from '../common/utils'
import { PostService, ProfileService } from '../services'
import ImageCropProvider from '../providers/ImageCropProvider'
import ImageCrop from '../components/Cropper/ImageCrop'
import { useAuthed } from '../hooks/useAuthed'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import SnapMap from '../components/Map/SnapMap'
import Footer from '../components/Layout/Footer'
import UserCard from '../components/Follows/UserCard'
import ListEndCard from '../components/Search/ListEndCard'

const PAGE_SIZE = 25

function ProfileFollows() {
  const location = useLocation()
  const { hash } = location
  const { mention } = useParams()

  const { isAuthenticated } = useAuthed()
  const navigate = useNavigate()
  const [profile, setProfile] = React.useState()
  const [tabClickCount, setTabClickCount] = React.useState(1)
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

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full sm:max-w-[1024px] h-screen">
        <Appbar noProfile backButton={() => navigate(-tabClickCount)} pageName={mention || profile?.mention} />
        <div className="flex flex-col flex-grow items-center mx-0 mt-2 pt-16 overflow-y-auto">
          <Tabs
            aria-label="follows tabs"
            variant="underlined"
            onSelectionChange={() => setTabClickCount((prev) => prev + 1)}
            selectedKey={hash}
          >
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
        <Footer
          handleOnHome={() => navigate('/')}
          handleOnSubmit={() => navigate('/')}
          noProfile={!isAuthenticated}
          hideProfileSelect
        />
      </div>
    </div>
  )
}

export default ProfileFollows
