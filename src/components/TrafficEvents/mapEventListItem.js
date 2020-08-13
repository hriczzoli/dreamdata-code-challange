// The layout and functionality for each item that is
// being rendered for every traffic event coming from the API

import React from 'react';
import { Icon, Button } from "@blueprintjs/core";

export const EventListItem = ({ e, showEventOnMap, selected, setIsVisible, index, selectEvent, setIsOpen, setCoordinates, setMapData }) => {
    const selectedStyle = selected[index] && "bg-gray-700 text-white"
    const selectedEventStyle = selected[index] && "text-orange-500"

    return (
      <li key={e.id}>
        <div className={`${selectedStyle} flex flex-row items-center shadow-md p-2`}>
          <div className="p-3 rounded-full bg-gray-400 mr-2">
            <Icon
              icon={
                e.event_type === 'INCIDENT'
                  ? 'collapse-all'
                  : e.event_type === 'CONSTRUCTION'
                  ? 'build'
                  : 'ban-circle'
              }
              iconSize="25"
              className={`${selectedEventStyle}`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{e.headline}</span>
            <span>Event type: <span className={`${selectedEventStyle}`}>{e.event_type}</span></span>
            <span>Severity: {e.severity}</span>
            <span>Area: {e.areas[0].name}</span>
            <span>
              Updated:{' '}
              {e.updated
                .substring(0, e.updated.length - 1)
                .replace('T', ' at ')}
            </span>
            <div className="w-full flex items-center justify-end">
              <div
                className="text-blue-600 font-bold mr-4 cursor-pointer"
                onClick={() => {showEventOnMap(e.id); selectEvent(index); setIsVisible(true)}}
              >
                SHOW
              </div>
              <Button icon="map" onClick={() => {setCoordinates({lat:e.geography.coordinates[1], lon:e.geography.coordinates[0]}); setMapData(e); setIsOpen(true); }}/>
            </div>
          </div>
        </div>
      </li>
    );
}

export default EventListItem;