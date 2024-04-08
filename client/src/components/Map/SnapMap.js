import React from 'react'
import { APIProvider } from '@vis.gl/react-google-maps'
import MapComponent from './MapComponent'

const API_KEY = 'AIzaSyA_PPhb-5jcZsLPcTdjoBBvF8CzvIbg4RE'

function SnapMap({ markers }) {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapComponent markers={markers} />
    </APIProvider>
  )
}

export default SnapMap
