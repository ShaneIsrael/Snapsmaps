import React, { useRef } from 'react'

import L from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

function MapComponent({ markers, maxZoom = 20, minZoom = 2, defaultZoom, mapClassName = "w-full h-full" }) {
  const validMarkers = markers.filter(
    (marker) => Number.isFinite(marker.lat) && Number.isFinite(marker.lng)
  )
  const icon = L.icon({ iconUrl: "/images/map/marker-icon.png" })
  const mapRef = useRef(null)
  const bounds = validMarkers.length > 0 ? validMarkers.map((marker) => [marker.lat, marker.lng]) : null

  return (
    <MapContainer center={bounds ? undefined : bounds[0]} maxZoom={maxZoom} minZoom={minZoom} zoom={bounds ? undefined : defaultZoom} ref={mapRef} className={mapClassName} bounds={bounds || undefined} markerZoomAnimation={true} touchZoom={true} style={{
      zIndex: 0
    }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        validMarkers.map((marker) => (
          <Marker
            key={`marker-${marker.lat}-${marker.lng}`}
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => {
                if (marker.onClick) {
                  marker.onClick()
                }
              },
            }}
            icon={icon}
          />
        ))
      }
    </MapContainer >
  )
}

export default MapComponent
