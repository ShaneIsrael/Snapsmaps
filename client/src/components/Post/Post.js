import React, { useCallback, useEffect, useRef } from 'react'
import GoogleMapReact from 'google-map-react'
import clsx from 'clsx'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  Divider,
} from '@nextui-org/react'
import Heart from '../../assets/icons/Heart'
import { GoogleMapDarkMode } from '../../common/themes'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import ChatIcon from '../../assets/icons/ChatIcon'
import Comment from '../Comment/Comment'

function Post({ post, user, defaultFollowed, defaultLiked, onOpenModal, width = '90%' }) {
  const [isFollowed, setIsFollowed] = React.useState(defaultFollowed)
  const [isLiked, setIsLiked] = React.useState(defaultLiked)
  const [selectedTab, setSelectedTab] = React.useState('photo')
  const [tabHeight, setTabHeight] = React.useState(250)

  const handleImageContainerSize = useCallback((node) => {
    if (node !== null && tabHeight) {
      setTabHeight(node?.height)
    }
  }, [])

  const renderMarkers = (map, maps) => {
    new maps.Marker({
      position: post.gps,
      map,
    })
  }

  const getMapOptions = (maps) => {
    return {
      streetViewControl: true,
      scaleControl: true,
      fullscreenControl: true,
      styles: [
        ...GoogleMapDarkMode,
        {
          featureType: 'poi.business',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'off',
            },
          ],
        },
      ],
      gestureHandling: 'greedy',
      disableDoubleClickZoom: true,
      minZoom: 0,
      maxZoom: 25,

      mapTypeControl: false,
      mapTypeId: maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: maps.ControlPosition.TOP_LEFT,
        mapTypeIds: [maps.MapTypeId.ROADMAP, maps.MapTypeId.SATELLITE],
      },
      zoomControl: false,
      clickableIcons: false,
    }
  }

  return (
    <>
      <Card className="sm:max-w-[500px]" style={{ width }}>
        <CardHeader className="justify-between">
          <div className="flex gap-3">
            <Avatar isBordered radius="full" size="md" src="https://i.imgur.com/YHaDQot.png" />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{user.name}</h4>
              <h5 className="text-small tracking-tight text-default-400">{user.mention}</h5>
            </div>
          </div>
          <Button
            className={isFollowed ? 'bg-transparent text-foreground border-default-200' : ''}
            color="primary"
            radius="full"
            size="sm"
            variant={isFollowed ? 'bordered' : 'solid'}
            onPress={() => setIsFollowed(!isFollowed)}
          >
            {isFollowed ? 'Unfollow' : 'Follow'}
          </Button>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-500 font-semibold overflow-y-hidden rounded-b-2xl">
          <p className="mb-2">{post.body}</p>
          <div className={`sm:max-h-[700px] pb-0`}>
            <Tabs
              aria-label="post tabs"
              color="primary"
              // variant="light"
              radius="full"
              selectedKey={selectedTab}
              onSelectionChange={setSelectedTab}
              className="block"
            >
              <Tab
                key="photo"
                title={
                  <div className="flex items-center space-x-2">
                    <PhotoIcon className={clsx({ 'fill-green-500': selectedTab !== 'photo' })} />
                    <span></span>
                  </div>
                }
              >
                <div style={{ height: tabHeight }} className="overflow-hidden rounded-2xl">
                  <Image
                    onClick={() => onOpenModal(post.image)}
                    ref={handleImageContainerSize}
                    width="100%"
                    alt="a post image"
                    src={post.image}
                    className="object-cover cursor-pointer"
                  />
                </div>
              </Tab>
              <Tab
                key="map"
                title={
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className={clsx({ 'fill-red-500': selectedTab !== 'map' })} />
                    <span></span>
                  </div>
                }
              >
                <div style={{ height: tabHeight }} className="overflow-hidden rounded-2xl">
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyA_PPhb-5jcZsLPcTdjoBBvF8CzvIbg4RE' }}
                    defaultCenter={post.gps}
                    defaultZoom={14}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
                    options={getMapOptions}
                  />
                </div>
              </Tab>
              <Tab
                key="discuss"
                title={
                  <div className="flex items-center space-x-2">
                    <ChatIcon className={clsx({ 'fill-blue-500': selectedTab !== 'discuss' })} />
                    <span></span>
                  </div>
                }
              >
                <div style={{ minHeight: tabHeight }} className="max-h-[489px] h-max flex flex-col">
                  <div className="overflow-y-scroll">
                    <div className="flex flex-col gap-2 scroll-">
                      <Comment
                        comment={{
                          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Blandit cursus risus at ultrices mi tempus imperdiet nulla.',
                          user: { avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', name: 'Billy Jane' },
                        }}
                      />
                      <Comment
                        comment={{
                          body: 'Yep, that is definitely a picture. Please post more :)',
                          user: { avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', name: 'Jessica Jones' },
                        }}
                      />
                      <Comment
                        comment={{
                          body: 'this is a comment on a post',
                          user: { avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d', name: 'Dude Bro' },
                        }}
                      />
                      <Comment
                        comment={{
                          body: 'Let me tell you. This might be the best picture the world has ever seen.',
                          user: {
                            avatar:
                              'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Barack_Obama_profile_picture.jpg/600px-Barack_Obama_profile_picture.jpg',
                            name: 'Barack Obama',
                          },
                        }}
                      />
                      <Comment
                        comment={{
                          body: 'Let me tell you. This might be the best picture the world has ever seen.',
                          user: {
                            avatar:
                              'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Barack_Obama_profile_picture.jpg/600px-Barack_Obama_profile_picture.jpg',
                            name: 'Barack Obama',
                          },
                        }}
                      />
                      <Comment
                        comment={{
                          body: 'Let me tell you. This might be the best picture the world has ever seen.',
                          user: {
                            avatar:
                              'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Barack_Obama_profile_picture.jpg/600px-Barack_Obama_profile_picture.jpg',
                            name: 'Barack Obama',
                          },
                        }}
                      />
                      <Comment
                        comment={{
                          body: 'Let me tell you. This might be the best picture the world has ever seen.',
                          user: {
                            avatar:
                              'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Barack_Obama_profile_picture.jpg/600px-Barack_Obama_profile_picture.jpg',
                            name: 'Barack Obama',
                          },
                        }}
                      />
                    </div>
                  </div>
                  <Textarea
                    variant="faded"
                    labelPlacement="outside"
                    placeholder="Write..."
                    maxRows={2}
                    className="max-w mt-2"
                    classNames={{
                      inputWrapper: 'rounded-lg',
                    }}
                  />
                </div>
              </Tab>
            </Tabs>
          </div>
        </CardBody>
        <CardFooter className="gap-3 pt-0">
          <div className="flex gap-1 ">
            <p className="font-semibold text-default-400 text-small">4</p>
            <p className=" text-default-400 text-small cursor-pointer" onClick={() => setIsLiked((prev) => !prev)}>
              <Heart className={clsx('w-5 h-5 stroke-red-500', { 'fill-red-500': isLiked })} />
            </p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">97.1K</p>
            <p className="text-default-400 text-small">Comments</p>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default Post
