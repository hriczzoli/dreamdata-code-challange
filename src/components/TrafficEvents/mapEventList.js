// The component that renders the list of traffic events
// underneath/next to (depending on device ratio) of the interactive chart

import React from 'react';
import { Icon } from "@blueprintjs/core";

import EventListItem from '../TrafficEvents/mapEventListItem';

const EventList = ({ data, events, showEventOnMap, selectEvent, selected, setSelected, setIsVisible, setIsOpen, setCoordinates, setMapData, isVisible, createMapChart }) => {
    return (
        <div className="flex flex-col md:w-1/3 md:l-0 md:shadow-lg md:mr-auto md:-mt-12">
            <div className="w-full flex flex-row justify-between items-center bg-blue-700 text-white font-semibold p-4 shadow-lg">
                <p className="text-lg">Latest events</p>
                <span className={isVisible ? 'hidden' : `text-sm text-gray-400`}>total: {events.length}</span>
                <button className={!isVisible ? 'hidden' : 'block'} onClick={() => {createMapChart(events, data); selectEvent(); setIsVisible(false)}}><Icon icon="reset" size="15" className="text-white"/></button>
            </div>
            <div className="w-full text-xs">
                <ul className="m-auto overflow-auto shadow-inner event-list-for-map">
                {
                    events.map((e, index) => <EventListItem 
                                                key={e.id} e={e} 
                                                showEventOnMap={showEventOnMap} 
                                                selected={selected} 
                                                setSelected={setSelected} 
                                                index={index} 
                                                selectEvent={selectEvent} 
                                                setIsVisible={setIsVisible} 
                                                setIsOpen={setIsOpen} 
                                                setCoordinates={setCoordinates} 
                                                setMapData={setMapData}
                                            />)
                }
                </ul>
            </div>
        </div>
    )
}

export default EventList;