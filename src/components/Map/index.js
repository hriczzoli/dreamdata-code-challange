import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { Icon, Button, Intent, Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";

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
        const windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
        window.open("https://www.google.com/maps/search/"+ lat + "," + lng +"?hl=en")
    }

    return (
        <div>
            <Popover position={Position.TOP}>
                <Icon icon="map-marker" className="text-red-600"/>
                <div className="flex flex-col p-2" style={{minWidth: '70vw'}}>
                    <p className="text-xl mb-2">{mapData.areas[0].name}</p>
                    <span>{mapData.event_type}</span>
                    <span>Status: {mapData.status}</span>
                    <span>State: {mapData.roads[0].state}</span>
                    <span>From: {mapData.roads[0].from}</span>
                    <span>Direction: {mapData.roads[0].direction}</span>
                    <div className="flex justify-end w-full mt-6">
                        <Button onClick={openGoogleMaps} style={{background: '#4299e1', color: 'white', marginRight: '1rem'}}>OPEN in GMap</Button>
                        <Button className="bp3-popover-dismiss" style={{background: '#e53e3e', color: 'white'}}>Dismiss</Button>
                    </div>
                </div>
            </Popover>
        </div>
    )
}