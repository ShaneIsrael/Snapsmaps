import { Button, Card, CardBody, CardFooter, CardHeader, Image, Modal, ModalContent, select } from "@heroui/react"
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'

import CloseIcon from '../../assets/icons/CloseIcon'

import { CheckIcon, EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/solid'
import { getAssetUrl } from '../../common/utils'
import { ProfileService } from '../../services'
import clsx from 'clsx'

function SelectCollectionItem({ open, onClose, onSelect, currentSelectedItems }) {
  const [postHistory, setPostHistory] = useState()
  const [selectedItems, setSelectedItems] = useState(currentSelectedItems || [])

  async function fetchHistory() {
    try {
      const history = (await ProfileService.getPostHistory()).data
      setPostHistory(history)
    } catch (err) {}
  }
  useEffect(() => {
    if (open) {
      fetchHistory()
    }
  }, [open])

  function getSelectionItems() {
    return postHistory?.map((post) => (
      <div className="relative">
        {selectedItems.includes(post.id) && (
          <div className="absolute z-10 flex flex-col items-center gap-2 pointer-events-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Button size="lg" isIconOnly variant="flat" className="bg-black/75">
              <CheckIcon className="w-8 h-8 opacity-90" />
            </Button>
          </div>
        )}
        <img
          key={`selectable-item-${post.id}`}
          alt=""
          src={getAssetUrl() + '/thumb/120x120/' + post.image.reference.split('/')[2]}
          className={clsx('w-[117px] h-[117px] object-cover rounded-none cursor-pointer', {
            'blur-sm': post.nsfw,
          })}
          onClick={() => {
            if (!selectedItems.includes(post.id)) {
              setSelectedItems([...selectedItems, post.id])
            } else {
              setSelectedItems(selectedItems.filter((id) => id !== post.id))
            }
          }}
          loading="lazy"
        />
      </div>
    ))
  }

  return (
    <Modal
      className="dark transform-gpu rounded-none m-0 p-0"
      isOpen={open}
      placement="top"
      size={isMobile ? 'full' : 'lg'}
    >
      <ModalContent>
        {() => (
          <Card className="h-full w-full rounded-none bg-black">
            <CardHeader className="flex flex-col items-center gap-2 pt-1">
              <h2 className="font-bold text-2xl">Add / Remove Items</h2>
            </CardHeader>
            <CardBody className="pb-2 pt-0 px-4">
              <div className=" flex flex-wrap gap-1">{getSelectionItems()}</div>
            </CardBody>
            <CardFooter className="flex flex-col px-4 pt-2 pb-5 gap-2">
              <div className="w-full flex flex-row align-middle items-center justify-center gap-4">
                <Button size="md" color="default" fullWidth onClick={onClose}>
                  <CloseIcon />
                </Button>

                <Button
                  size="md"
                  color="primary"
                  variant="solid"
                  fullWidth
                  isDisabled={selectedItems.length === 0}
                  onClick={() => onSelect(selectedItems)}
                >
                  <CheckIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </ModalContent>
    </Modal>
  )
}

export default SelectCollectionItem
