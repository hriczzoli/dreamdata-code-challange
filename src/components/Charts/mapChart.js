// This is a component that displays traffic events organized
// and grouped in an interactive MAP CHART - using Highcharts

import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import mapDataCA from "@highcharts/map-collection/countries/us/us-ca-all.geo.json";
import { Spinner, Icon, Dialog } from "@blueprintjs/core";

import CustomMap from '../Map/index';
import EventList from '../TrafficEvents/mapEventList';

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
            createMapChart(events, data)
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
            createMapChart(cEvents, filteredCounties)
        }
    }, [filteredCounties])

    // Highcharts map chart configuration
    const createMapChart = (events, mapData) => {
        // Filter out CONSTRUCTIONS for chart
        const constructions = events.filter((ev) => {
          return ev.keyword === 'CONSTRUCTION'
        })

        // Filter out INCIDENTS for chart
        const incidents = events.filter((ev) => {
          return ev.keyword === 'INCIDENT'
        })

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
              name: 'Constructions',
              color: '#ed8936',
              data: constructions,
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
            }, {
              // Specify points using lat/lon
              type: 'mappoint',
              name: 'Incidents',
              color: '#e53e3e',
              data: incidents,
              dataLabels: {
                enabled: true,
                format: '{point.keyword}',
                style: {
                    color: '#e53e3e'
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