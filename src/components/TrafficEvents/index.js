// The main component that gets rendered when the application loads
// displaying an interactive MAP CHART and a LIST OF TRAFFIC EVENTS

import React, { useState, useEffect, useContext } from 'react';

import MapChart from '../Charts/mapChart';
import TrafficColumnChart from '../Charts/columnChart';
import Switch from './switch';
import EventListTree from './barchartEventList';
import Filter from '../Helpers/filter';
import { data } from '../../utils/filteredGeoJSON';
import { AppContext } from '../../context/contextProvider';

const Events = () => {
    const { eventList, reducedEvents } = useContext(AppContext);
    const [view, setView] = useState('MAP');
    const [events, setEvents] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    
    useEffect(() => {
        if (eventList.length !== 0) {
            setEvents(eventList)
        }   
    }, [eventList])

    // Filter counties and events when filters are set for the MAP CHART
    const handleFilterMapData = (countiesList) => {
        const localList = [];
        setEvents([])
        const newEventList = [];
        if (countiesList.lenght !== 0) {
            countiesList.map((county) => {
                data.map((d) => {
                    if (county === d.name) {
                        localList.push(d)
                    }
                })
                events.map((e) => {
                    if (e.name === county) {
                        newEventList.push(e)
                    }
                })
            })
            setFilteredList(localList)
            setEvents(newEventList)
        }
    }

    const resetMapData = () => {
        setFilteredList(data)
        setEvents(eventList)
    }

    return (
        <div>
            <Switch setView={setView} view={view} className={"md:w-1/2 ml-auto mr-auto md:mr-0 md:w-2/3 md:left-auto"}/>
            {
                view === 'MAP' ?
                    <>
                        <Filter counties={reducedEvents || []} handleFilterMapData={handleFilterMapData} filteredList={filteredList} resetMapData={resetMapData}/>
                        <MapChart events={events} filteredCounties={filteredList} data={data}/>
                    </>
                :
                    <div className="md:flex-row-reverse">
                        <p className="text-center text-xl md:w-2/3 md:ml-auto md:mt-4">SF Bay Area</p>
                        <TrafficColumnChart />
                        <EventListTree reducedEvents={reducedEvents} />                        
                    </div>
            }
        </div>
    )
}

export default Events;