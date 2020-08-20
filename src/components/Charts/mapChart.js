// This is a component that displays traffic events organized
// and grouped in an interactive MAP CHART - using Highcharts

import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import { Spinner, Icon, Dialog } from "@blueprintjs/core";

import CustomMap from '../Map/index';
import EventList from '../TrafficEvents/mapEventList';
import { createMapChart } from './mapChartConfig';

highchartsMap(Highcharts);

if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
}


const MapChart = ({ events, data, filteredCounties }) => {
    const [loading, setLoading] = useState(true)
    const [mapOptions, setMapOptions] = useState({})
    const [selected, setSelected] = useState(Array(events.length).fill(false))
    const [isVisible, setIsVisible] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [coordinates, setCoordinates] = useState({})
    const [mapData, setMapData] = useState({})

    // Create the chart on component mount
    useEffect(() => {
        if (events.length !== 0) {
            let options = createMapChart(events, data)
            setMapOptions(options)
            setLoading(false)
        }
    }, [events])

    // When the list of couties changes -> filter the list of events
    // displayed on the map as well
    useEffect(() => {
        if (filteredCounties.length !== 0) {
            const cEvents = [];
            filteredCounties.map((fc) => {
                events.map((ev) => {
                    if (fc.name === ev.name) {
                        cEvents.push(ev)
                    }
                })
            })
            let options = createMapChart(cEvents, filteredCounties)
            setMapOptions(options)
        }
    }, [filteredCounties])

    // Clear events from map and only display marker for the selected event
    const showEventOnMap = (id) => {
        const filteredList = events.filter((e) => {
            return e.id === id
        })
        let options = createMapChart(filteredList, data)
        setMapOptions(options)
    }

    // Select a specific event -> set it's state to 'selected' so it changes visual appearance
    const selectEvent = (index) => {
        for (let i = 0; i < selected.length; i++){
            selected[i] = false
        }
        const selectedCopy = [...selected]
        selectedCopy[index] = !selected[index]
        setSelected(selectedCopy)
    }

    return (
        <div className="flex justify-center">
        {
            loading ?
            <Spinner className="mt-32"/>
            :
            <div className="flex flex-col md:flex-row-reverse">
                <HighchartsReact
                    constructorType ={'mapChart'}
                    highcharts={Highcharts}
                    options={mapOptions}
                    className="m-auto"
                />
                <EventList 
                  events={events}
                  showEventOnMap={showEventOnMap} 
                  selected={selected} 
                  setSelected={setSelected}
                  selectEvent={selectEvent} 
                  setIsVisible={setIsVisible} 
                  setIsOpen={setIsOpen} 
                  setCoordinates={setCoordinates} 
                  setMapData={setMapData}
                  createMapChart={createMapChart}
                  isVisible={isVisible}
                  data={data}
                  setMapOptions={setMapOptions}
                />
                <Dialog
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    <div className="flex w-full bg-white p-2 justify-end">
                      <Icon icon="cross" iconSize={25} onClick={() => setIsOpen(false)}/>
                    </div>
                    <CustomMap lat={coordinates.lat} lon={coordinates.lon} mapData={mapData}/>
                </Dialog>
            </div>   
        }
        </div>
    )
}

export default MapChart;