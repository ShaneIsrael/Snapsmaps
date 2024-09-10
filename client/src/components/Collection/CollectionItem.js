import React from 'react'
import { getAssetUrl } from '../../common/utils'
import clsx from 'clsx'

function CollectionItem({ collection, onClick }) {
  return (
    <div
      className="relative rounded-xl border-large border-solid border-neutral-200 h-40 max-w-[478px] w-full bg-gray-900 cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute w-full bottom-0 flex items-end text-4xl font-lobster pl-2 pb-2 pt-2 rounded-b-xl bg-black/50">
        {collection.title}
      </div>
      <img
        src={getAssetUrl() + collection.image.reference}
        className={clsx('object-cover rounded-lg w-full h-full')}
        loading="lazy"
      />
    </div>
  )
}

export default CollectionItem
