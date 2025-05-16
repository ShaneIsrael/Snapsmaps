import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import MapComponent from './MapComponent'
import { getCookie } from '../../common/utils'

const API_KEY = getCookie('GoogleMapsApiKey')

function SnapMap({ ...rest }) {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapComponent {...rest} />
    </APIProvider>
  )
}

export default SnapMap
