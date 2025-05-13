import React, { useState } from 'react'
import { canBrowserShareData, getAssetUrl } from '../../common/utils'
import clsx from 'clsx'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { EllipsisVerticalIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { toast } from 'sonner'
import ConfirmationDialog from '../Dialog/ConfirmationDialog'
import { CollectionService } from '../../services'

function CollectionItem({ collection, onClick, isAuthenticated, isSelf }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleted, setDeleted] = useState(false)

  if (deleted) return null

  const handleShareCollection = async () => {
    const shareLink = `${window.location.origin}/share/collection/${collection.id}`
    try {
      if (canBrowserShareData({ url: shareLink })) {
        await navigator.share({ url: shareLink })
      } else {
        await navigator.clipboard.writeText(shareLink)
        toast.info('Link copied to clipboard.')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    setConfirmDelete(false)
    setTimeout(async () => {
      try {
        await CollectionService.delete(collection.id)
        setDeleted(true)
      } catch (err) {
        console.error(err)
      }
    }, 750)
  }

  return (
    <>
      <ConfirmationDialog
        open={confirmDelete}
        title="Are you sure?"
        body="This action is not reversible."
        actionText="Delete Collection"
        actionColor="danger"
        cancelColor="default"
        onAction={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <div
        className="relative rounded-xl border-medium border-solid border-neutral-200 h-40 max-w-[478px] w-full bg-gray-900 cursor-pointer"
        onClick={onClick}
      >
        {isAuthenticated && (
          <Dropdown className="dark absolute min-w-0 p-[1px] w-fit bg-black -left-36">
            <DropdownTrigger>
              <Button variant="light" size="sm" className="absolute top-0 right-0" isIconOnly>
                <EllipsisVerticalIcon className="w-5 h-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="collection actions">
              <DropdownItem
                showDivider={isSelf}
                key="share"
                className="text-neutral-100"
                onClick={handleShareCollection}
                startContent={<ShareIcon className="h-4 w-4" />}
              >
                Share
              </DropdownItem>
              {isSelf && (
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  onClick={() => setConfirmDelete(true)}
                  startContent={<XMarkIcon className="h-4 w-4" />}
                >
                  Delete Collection
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        )}
        <div className="absolute w-fit top-0 flex items-end text-2xl font-lobsterTwo px-2 py-1 rounded-tl-xl rounded-br-xl bg-black/75">
          {collection.title}
        </div>
        <img
          src={getAssetUrl() + collection.image.reference}
          className={clsx('object-cover rounded-lg w-full h-full')}
          loading="lazy"
        />
      </div>
    </>
  )
}

export default CollectionItem
