// This is a custom map component that uses Google Maps
// to display a MARKER on the map indicating an affected area

import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon, Button, Popover, Position } from "@blueprintjs/core";

const apiKey = process.env.REACT_APP_GOOGLE_MAP_KEY

const CustomMap = ({ lat, lon, mapData }) => {
    const [zoom, setZoom] = useState(8)
    const center = {
        lat: 37.7500,
        lng: -122.2833
    }

    return (
        <div style={{width: '100vw', height: '60vh'}}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: apiKey }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker
            lat={lat}
            lng={lon}
            mapData={mapData}
          />
        </GoogleMapReact>
      </div>
    )
}

export default CustomMap;

const Marker = ({ lat, lng, mapData }) => {

    const openGoogleMaps = () => {
        window.open("https://www.google.com/maps/search/"+ lat + "," + lng +"?hl=en")
    }

    return (
        <div>
            <Popover position={Position.TOP}>
                <Icon icon="map-marker" className="text-red-600"/>
                <div className="flex flex-col p-2 map-popover-content">
                    <p className="text-xl mb-2">{mapData.name}</p>
                    <span>{mapData.keyword}</span>
                    <span>Status: {mapData.status}</span>
                    <span>State: {mapData.roadsState}</span>
                    <span>From: {mapData.from}</span>
                    <span>Direction: {mapData.direction}</span>
                    <div className="flex justify-end w-full mt-6">
                        <Button onClick={openGoogleMaps} style={{background: '#4299e1', color: 'white', marginRight: '1rem'}}>OPEN in GMap</Button>
                        <Button className="bp3-popover-dismiss" style={{background: '#e53e3e', color: 'white'}}>Dismiss</Button>
                    </div>
                </div>
            </Popover>
        </div>
    )
}