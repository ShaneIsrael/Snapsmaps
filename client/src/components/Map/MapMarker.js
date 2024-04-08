import { MapPinIcon } from '@heroicons/react/24/solid'
import React from 'react'

const MapMarker = ({ text, tooltip, onClick }) => {
  return <MapPinIcon className="relative fill-red-500 w-10 h-10" onClick={onClick} />
}

export default MapMarker
