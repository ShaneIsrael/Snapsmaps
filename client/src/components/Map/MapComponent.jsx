import React, { useEffect, useState, useRef } from 'react'

import L from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

function MapComponent({ markers, maxZoom = 20, minZoom = 0, defaultZoom, mapClassName = "w-full h-full" }) {
  const validMarkers = markers.filter((marker) => marker.lat !== null && marker.lng !== null)
  const icon = L.icon({ iconUrl: "/images/map/marker-icon.png" })
  const mapRef = useRef(null)
  const bounds = validMarkers.map((marker) => [marker.lat, marker.lng])

  return (
    // Make sure you set the height and width of the map container otherwise the map won't show
    <MapContainer center={bounds[0]} maxZoom={maxZoom} minZoom={minZoom} zoom={defaultZoom} ref={mapRef} className={mapClassName} bounds={bounds} markerZoomAnimation={true} touchZoom={true} style={{
      zIndex: 0
    }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        validMarkers.map((marker) => (
          <Marker key={`marker-${marker.lat}-${marker.lng}`} position={[marker.lat, marker.lng]} eventHandlers={{
            click: () => {
              if (marker.onClick) {
                marker.onClick()
              }
            },
          }} icon={icon} />
        ))
      }
    </MapContainer >
  )
}

export default MapComponent
