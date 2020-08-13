import React, { useState, useEffect } from 'react';

import MapChart from '../Charts/mapChart';
import TrafficColumnChart from '../Charts/columnChart';
import { Switch } from './switch';
import EventListTree from './barchartEventList';
import Filter from '../Helpers/filter';
import { data } from '../../utils/filteredGeoJSON';

export const Events = () => {
    const [view, setView] = useState('MAP');
    const [events, setEvents] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

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

    // Filter counties
    const handleFilterMapData = (countiesList) => {
        const localList = [];
        if (countiesList.lenght !== 0) {
            countiesList.map((county) => {
                data.map((d) => {
                    if (county === d.name) {
                        localList.push(d)
                    }
                })
            })
            setFilteredList(localList)
        }
    }

    const resetMapData = () => {
        setFilteredList(data)
    }

    return (
        <div>
            <Switch setView={setView} view={view} className={"md:w-1/2 ml-auto mr-auto md:mr-0 md:w-2/3 md:left-auto"}/>
            {
                view === 'MAP' ?
                    <>
                        <Filter counties={reducedEvents} handleFilterMapData={handleFilterMapData} filteredList={filteredList} resetMapData={resetMapData}/>
                        <MapChart events={events} filteredCounties={filteredList} data={data}/>
                    </>
                :
                    <div className="md:flex-row-reverse">
                        <p className="text-center text-xl md:w-2/3 md:ml-auto md:mt-4">SF Bay Area</p>
                        <TrafficColumnChart events={events}/>
                        <EventListTree reducedEvents={reducedEvents} />                        
                    </div>
            }
        </div>
    )
}

export default Events;