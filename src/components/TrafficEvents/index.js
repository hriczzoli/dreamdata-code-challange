import React, { useState, useEffect } from 'react';

import MapChart from '../Charts/mapChart';
import TrafficColumnChart from '../Charts/columnChart';
import { Switch } from './switch';
import Tree from '../Collapse/index';

export const Events = () => {
    const [view, setView] = useState('MAP')
    const [events, setEvents] = useState([])

    // Fetch traffic info on component mount
    useEffect(() => {
        getTrafficData()
    }, [])

    // Function for requesting traffic information from API
    async function getTrafficData() {
        await fetch(`http://api.511.org/Traffic/Events?api_key=${process.env.REACT_APP_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                setEvents(data.events)
            })
    };

    // Construct event objects to be used
    const eventList = [];
        events.map((event) => 
            eventList.push({
                z: 10,
                id: event.id,
                name: event.areas[0].name,
                keyword: event.event_type,
                headline: event.headline,
                lat: event.geography.coordinates[1],
                lon: event.geography.coordinates[0],
                severity: event.severity,
                updated: event.updated.substring(0, event.updated.length - 1).replace('T', ' at '),
                status: event.status,
                roadsState: event.roads[0].state,
                from: event.roads[0].from,
                to: event.roads[0].to,
                direction: event.roads[0].direction
            })
        );

        console.log(eventList)

    // Reduce events to display organized list of data
    const reducedEvents = Object.values(eventList.reduce((a, {name, keyword, roadsState}) => {
        a[name] = a[name] || {name, y: 0, keyword, roadsState, drilldown: name, id: name, data: []};
        a[name].y++;
        return a;
      }, Object.create(null)))
  
    reducedEvents.map((re) => {
        eventList.map((event) => {
          if (re.name === event.name) {
            re.data.push(event)
          }
        })
    })

    console.log(reducedEvents)

    return (
        <div>
            <Switch setView={setView} view={view} />
            {
                view === 'MAP' ?
                    <MapChart events={events}/>
                :
                    <>
                        <p className="text-center text-xl">SF Bay Area</p>
                        <TrafficColumnChart events={events}/>

                        <div className="flex flex-col fixed bottom-0 w-full shadow-lg overflow-auto bg-gray-100" style={{height: '19rem'}}>
                            <p className="text-lg font-semibold pl-4 sticky top-0 bg-blue-600 text-white z-10 pt-4 pb-4">Counties</p>
                            <div className="p-4">
                                <Tree name="Counties" defaultOpen>
                                    {
                                        reducedEvents.map((event) => {
                                            return <Tree key={event.id} name={`${event.name} - ${event.y}`}>
                                                {
                                                    event.data.map((data) => {
                                                        return <Tree key={data.id} name={`${data.name} - ${data.keyword}`}>
                                                            <div className="flex flex-col">
                                                                <span>{data.headline}</span>
                                                                <span><span className="font-semibold">Conditions:</span> {data.roadsState}</span>
                                                                <span><span className="font-semibold">Direction:</span> {data.direction}</span>
                                                                <span><span className="font-semibold">From:</span> {data.from}</span>
                                                                <span><span className="font-semibold">To:</span> {data.to}</span>
                                                                <span><span className="font-semibold">Updated:</span> {data.updated}</span>
                                                            </div>
                                                        </Tree>
                                                    })
                                                }
                                            </Tree>
                                        })
                                    }
                                </Tree>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}

export default Events;