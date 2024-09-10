import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalContent,
  Tab,
  Tabs,
  Textarea,
  useDisclosure,
  Progress,
  Switch,
  Tooltip,
  Input,
} from '@nextui-org/react'
import React, { useEffect, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { PhotoIcon } from '../../assets/icons/PhotoIcon'
import { TbPhotoPlus } from 'react-icons/tb'
import { MapPinIcon } from '../../assets/icons/MapPinIcon'
import clsx from 'clsx'
import CloseIcon from '../../assets/icons/CloseIcon'
import SendIcon from '../../assets/icons/SendIcon'
import { CollectionService, PostService, ProfileService } from '../../services'
import { toast } from 'sonner'
import SnapMap from '../Map/SnapMap'
import { EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/solid'
import Nsfw from '../../assets/icons/Nsfw'
import Sfw from '../../assets/icons/Sfw'
import Nsfw2 from '../../assets/icons/Nsfw2'
import { XCircleIcon } from '@heroicons/react/24/outline'
import SelectCollectionItem from './SelectCollectionItem'
import { getAssetUrl } from '../../common/utils'

function CreateCollection({ open, onClose, onSubmitted }) {
  const abortControllerRef = useRef(new AbortController())
  const [publicCollection, setPublicCollection] = useState(true)
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [headerImageData, setHeaderImageData] = useState()
  const [postHistory, setPostHistory] = useState()
  const [selectedItems, setSelectedItems] = useState([])
  const [selectCollectionItemOpen, setSelectCollectionItemOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInput = useRef(null)

  // abort the post upload if unmounted
  useEffect(() => {
    const controller = abortControllerRef.current
    return () => controller.abort()
  }, [])

  const handleFileChange = async (e) => {
    if (!e.target.files[0].name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return toast.warning('Selection must be an image.')
    }
    const fileBuffer = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      reader.onerror = (err) => {
        reject(err)
      }
      reader.readAsArrayBuffer(e.target.files[0])
    })

    const file = new Uint8Array(fileBuffer)
    const base64file = btoa(new Uint8Array(file).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    return setHeaderImageData({
      file: e.target.files[0],
      buffer: file,
      base64: base64file,
    })
  }

  const handleCancel = () => {
    setHeaderImageData(null)
    setTitle('')
    setPublicCollection(true)
    setSelectedItems([])
    setSubmitting(false)
    setUploadProgress(0)
    onClose()
  }

  const submit = async () => {
    setSubmitting(true)
    try {
      const collection = (
        await CollectionService.create(
          title,
          publicCollection,
          headerImageData.file,
          selectedItems,
          (progress) => setUploadProgress(progress),
          abortControllerRef.current.signal,
        )
      ).data
      onSubmitted()
      toast.success(`${title} collection has been created.`)
    } catch (err) {
      if (err.response?.status === 413) {
        return toast.error(err.response.data)
      }
      if (err.response?.data) {
        return toast.error(err.response.data)
      }
    }
    handleCancel()
    setSubmitting(false)
  }

  async function fetchHistory() {
    try {
      const history = (await ProfileService.getPostHistory()).data
      setPostHistory(history)
    } catch (err) {}
  }
  useEffect(() => {
    fetchHistory()
  }, [selectCollectionItemOpen])

  function getSelectionItems() {
    return postHistory
      ?.filter((post) => selectedItems.includes(post.id))
      .map((post) => (
        <img
          key={`selectable-item-${post.id}`}
          alt=""
          src={getAssetUrl() + '/thumb/120x120/' + post.image.reference.split('/')[2]}
          className={clsx('w-[56px] h-[56px] rounded-lg object-cover cursor-pointer', {
            'blur-sm': post.nsfw,
          })}
          onClick={() => setSelectCollectionItemOpen(true)}
          loading="lazy"
        />
      ))
  }

  return (
    <>
      <SelectCollectionItem
        open={selectCollectionItemOpen}
        onClose={() => setSelectCollectionItemOpen(false)}
        currentSelectedItems={selectedItems}
        onSelect={(items) => {
          setSelectedItems(items)
          setSelectCollectionItemOpen(false)
        }}
      />
      <Modal
        className="dark transform-gpu rounded-none m-0 p-0"
        isOpen={open}
        onClose={onClose}
        placement="top"
        size={isMobile ? 'full' : 'lg'}
      >
        <input
          id="image-input"
          type="file"
          accept={!!window.chrome ? 'image/*' : '*'}
          ref={fileInput}
          onChange={handleFileChange}
          className="hidden"
        />
        <ModalContent>
          {(onClose) => (
            <Card className="h-full w-full rounded-none bg-black">
              <CardHeader className="flex flex-col items-center gap-2 pt-1">
                <h2 className="font-bold text-2xl">New Collection</h2>
                <Input
                  color={title ? 'primary' : 'default'}
                  placeholder="..."
                  label="Collection Title"
                  value={title}
                  onValueChange={(value) => setTitle(value.slice(0, process.env.REACT_APP_MAX_COLLECTION_TITLE_LENGTH))}
                  className="w-full"
                  classNames={{
                    input: 'text-lg font-semibold text-center',
                    label: 'text-lg font-bold mt-2',
                  }}
                  isDisabled={submitting}
                />
                <div className="flex mt-1 items-center">
                  <div className="mr-2 w-full items-center">
                    <div className=" text-sm font-bold ">{publicCollection ? 'PUBLIC' : 'PRIVATE'}</div>
                  </div>
                  <div className="flex gap-0 items-center">
                    <Tooltip content={publicCollection ? 'public post' : 'private post'} color="primary">
                      <div>
                        <Switch
                          color={publicCollection ? 'primary' : 'default'}
                          isSelected={publicCollection}
                          onValueChange={setPublicCollection}
                          size="lg"
                          startContent={<EyeIcon />}
                          endContent={<EyeSlashIcon />}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pb-2 pt-0 px-4 relative w-full h-full">
                <div className="relative w-full rounded-xl border border-solid border-neutral-200 h-48 bg-gray-900 [&>div>button]:hover:flex">
                  <div className="absolute w-full h-fit flex justify-center pt-5 ">
                    {!headerImageData && (
                      <Tooltip content="Upload header photo" placement="bottom" color="default">
                        <Button
                          isIconOnly
                          className="w-14 h-14"
                          color="default"
                          aria-label="upload photo"
                          onClick={() => fileInput.current.click()}
                        >
                          <TbPhotoPlus className="w-9 h-9" />
                        </Button>
                      </Tooltip>
                    )}
                    {headerImageData && (
                      <Tooltip content="remove header photo" placement="bottom" color="default">
                        <Button
                          isIconOnly
                          variant="flat"
                          className="w-14 h-14 hidden"
                          color="default"
                          aria-label="remove photo"
                          onClick={() => setHeaderImageData(null)}
                        >
                          <XCircleIcon className="w-9 h-9" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                  {title && (
                    <div className="absolute w-full bottom-0 flex items-end text-4xl font-lobster pl-2 pb-2 pt-2 rounded-b-xl bg-black/50">
                      {title}
                    </div>
                  )}
                  {headerImageData && (
                    <img
                      src={`data:image/png;base64,${headerImageData?.base64}`}
                      className={clsx('object-cover rounded-xl w-full h-full')}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-1 items-center mt-2 border border-solid border-gray-700 p-2 rounded-xl bg-black">
                  {getSelectionItems()}
                  <Button
                    isIconOnly
                    className="w-14 h-14"
                    color="default"
                    aria-label="add post to collection"
                    onClick={() => setSelectCollectionItemOpen(true)}
                  >
                    <PlusIcon className="w-9 h-9" />
                  </Button>
                </div>
              </CardBody>
              <CardFooter className="flex flex-col px-4 pt-2 pb-5 gap-2">
                {submitting && (
                  <div className="relative align-middle justify-center w-full">
                    <p className="absolute bottom-0 text-center text-sm font-extrabold tracking-widest w-full z-10">
                      {uploadProgress}%...
                    </p>
                    <Progress
                      isStriped
                      size="lg"
                      aria-label="Uploading..."
                      color="primary"
                      value={uploadProgress}
                      className="max-w-md"
                    />
                  </div>
                )}
                <div className="w-full flex flex-row align-middle items-center justify-center gap-4">
                  <Button size="md" color="danger" variant="flat" fullWidth onClick={handleCancel}>
                    <CloseIcon />
                  </Button>

                  <Button
                    size="md"
                    color="primary"
                    variant="solid"
                    fullWidth
                    onClick={submit}
                    isDisabled={submitting || !title || selectedItems.length === 0 || !headerImageData?.file}
                  >
                    {submitting ? 'Posting...' : <SendIcon />}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateCollection
