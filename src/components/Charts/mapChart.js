import React, { useState, useEffect } from 'react';
import Highcharts, { mapChart, chart } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import mapDataCA from "@highcharts/map-collection/countries/us/us-ca-all.geo.json";
import { Spinner, Icon, Button, Dialog } from "@blueprintjs/core";

import CustomMap from '../Map/index';

highchartsMap(Highcharts);

if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
}


export const MapChart = ({ events, data, filteredCounties }) => {
    const [loading, setLoading] = useState(true)
    const [mapOptions, setMapOptions] = useState({})
    const [selected, setSelected] = useState(Array(events.length).fill(false))
    const [isVisible, setIsVisible] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [coordinates, setCoordinates] = useState({})
    const [mapData, setMapData] = useState({})


    useEffect(() => {
        if (events.length !== 0) {
            createMapChart(events, data)
        }
    }, [events])

    useEffect(() => {
        if (filteredCounties.length !== 0) {
            const cEvents = [];
            filteredCounties.map((fc) => {
                events.map((ev) => {
                    if (fc.name === ev.areas[0].name) {
                        cEvents.push(ev)
                    }
                })
            })
            createMapChart(cEvents, filteredCounties)
        }
    }, [filteredCounties])

    // Highcharts map chart configuration
    function createMapChart(events, mapData) {
        const eventList = [];
        events.map((event) => 
            eventList.push({
                z: 10,
                id: event.id,
                name: event.areas[0].name,
                keyword: event.event_type,
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

        const mapOpt = {
            chart: {
                panning: true,
                pinchType: 'x'
            },
            title: {
              text: 'SF Bay Area'
            },
            credits: {
                enabled: false
            },
            mapNavigation: {
              enabled: true
            },
            tooltip: {
                headerFormat: '',
                pointFormat: 'County: {point.name}',
                style: {
                    fontWeight: 'bold'
                }
            },
            series: [{
              name: 'SF Bay map',
              mapData: mapDataCA,
              borderColor: '#A0A0A0',
              color: '#a0aec0',
              nullColor: 'rgba(200, 200, 200, 0.3)',
              showInLegend: false,
              data: mapData,
              allAreas: false,
              joinBy: 'hc-key',
              allowPointSelect: true,
                cursor: 'pointer',
                events: {
                    click: function (e) {
                        e.point.zoomTo();
                    }
                },
              dataLabels: {
                    enabled: true,
                    format: '{point.hc-a2}'
                }
            }, {
              // Specify points using lat/lon
              type: 'mappoint',
              name: 'Events',
              color: '#ed8936',
              data: eventList,
              dataLabels: {
                enabled: true,
                format: '{point.keyword}',
                style: {
                    color: '#ed8936'
                }
              },
              tooltip: {
                headerFormat: '',
                pointFormat: `<div><span>{point.keyword}</span><br><span>Status: {point.status}</span> <br><span>State: {point.roadsState}</span> <br><span>From: {point.from}</span> <br><span>To: {point.to}</span> <br><span>Direction: {point.direction}</span> <br><span>Updated: {point.updated}</span></div>`
              },
              cursor: 'pointer',
            }]
        }

        setMapOptions(mapOpt)
        setLoading(false)
    }

    const showEventOnMap = (id) => {
        const filteredList = events.filter((e) => {
            return e.id === id
        })
        createMapChart(filteredList, data)
    }

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
            <div>
                <HighchartsReact
                    constructorType ={'mapChart'}
                    highcharts={Highcharts}
                    options={mapOptions}
                />
                <div className="w-full flex flex-row justify-between items-center bg-blue-700 text-white font-semibold p-4 shadow-lg">
                    <p className="text-lg">Latest events</p>
                    <span className={isVisible ? 'hidden' : `text-sm text-gray-400`}>total: {events.length}</span>
                    <button className={!isVisible ? 'hidden' : 'block'} onClick={() => {createMapChart(events, data); selectEvent(); setIsVisible(false)}}><Icon icon="reset" size="15" className="text-white"/></button>
                </div>
                <div className="w-full text-xs">
                    <ul className="m-auto overflow-auto shadow-inner"  style={{maxHeight: '43vh'}}>
                    {
                        events.map((e, index) => <EventListItem key={e.id} e={e} showEventOnMap={showEventOnMap} selected={selected} setSelected={setSelected} index={index} selectEvent={selectEvent} setIsVisible={setIsVisible} setIsOpen={setIsOpen} setCoordinates={setCoordinates} setMapData={setMapData}/>)
                    }
                    </ul>
                </div>
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
                className="text-blue-600 font-bold mr-4"
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