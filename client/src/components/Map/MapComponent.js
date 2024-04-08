import React, { useEffect, useState } from 'react'
import { GoogleMapDarkMode } from '../../common/themes'
import { Map, Marker, useMap } from '@vis.gl/react-google-maps'

function MapComponent({ markers, defaultZoom, streetViewControl }) {
  const map = useMap()
  const [mapOptions, setMapOptions] = useState()

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

      mapTypeControl: true,
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

  useEffect(() => {
    if (map) {
      if (!defaultZoom) {
        const bounds = new google.maps.LatLngBounds()
        markers.forEach((position) => {
          bounds.extend({ lat: parseFloat(position.lat), lng: parseFloat(position.lng) })
        })
        map.fitBounds(bounds)
      }

      setMapOptions({
        mapControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE],
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
      })
    }
  }, [map])

  return (
    <Map
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      defaultZoom={defaultZoom}
      streetViewControl={streetViewControl}
      {...(defaultZoom ? { defaultCenter: markers[0] } : {})}
      mapTypeControl
      mapTypeControlOptions={mapOptions?.mapControlOptions}
      styles={[
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
      ]}
    >
      {markers.map((marker, index) => (
        <Marker key={index} position={marker} onClick={marker.onClick} />
      ))}
    </Map>
  )
}

export default MapComponent
