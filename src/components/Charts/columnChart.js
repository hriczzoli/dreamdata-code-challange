import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import ColumnChart from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown.js';
import proj4 from "proj4";
import { Spinner, Icon } from "@blueprintjs/core";

drilldown(Highcharts);

if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
}


export const TrafficColumnChart = ({ events }) => {
  const [loading, setLoading] = useState(true)
  const [columnOptions, setColumnOptions] = useState({})

  useEffect(() => {
    if (events.length !== 0) {
      createColumnChart(events)
    }
  }, [events])

  // Highcharts ColumnChart configuration
  const createColumnChart = (events) => {
    const eventList = [];
    events.map((event) =>
      eventList.push({
        id: event.areas[0].name,
        name: event.areas[0].name,
        keyword: event.event_type,
        updated: event.updated.substring(0, event.updated.length - 1).replace('T', ' at '),
        status: event.status,
        roadsState: event.roads[0].state,
        from: event.roads[0].from,
        to: event.roads[0].to,
        direction: event.roads[0].direction,
      })
    );

    const constructions = eventList.filter((ev) => {
      return ev.keyword === 'CONSTRUCTION'
    })
    // Reduce event list and create count attribute
    const reducedEvents = Object.values(constructions.reduce((a, {name, keyword, roadsState}) => {
      a[name] = a[name] || {name, y: 0, keyword, roadsState, drilldown: name, id: name, data: []};
      a[name].y++;
      return a;
    }, Object.create(null)))

    reducedEvents.map((re) => {
      eventList.map((event) => {
        if (re.name === event.name) {
          const info = {
            keyword: event.keyword,
            road_state: event.roadState
          }
          if (re.keyword === event.keyword) {
            re.data.push([event.from, 1, info])
          }
        }
      })
    })

    // Filter out INCIDENTS for chart
    const incidents = eventList.filter((ev) => {
      return ev.keyword === 'INCIDENT'
    })
    
    const reducedIncidents = Object.values(incidents.reduce((a, {name, keyword, roadsState}) => {
      a[name] = a[name] || {name, y: 0, keyword, roadsState, drilldown: name, id: name, data: []};
      a[name].y++;
      return a;
    }, Object.create(null)))

    reducedIncidents.map((re) => {
      eventList.map((event) => {
        if (re.name === event.name) {
          const info = {
            keyword: event.keyword,
            road_state: event.roadState
          }
          if (re.keyword === event.keyword) {
            re.data.push([event.from, 1, info])
          }
        }
      })
    })

    // Create drilldown list
    const drilldownList = reducedEvents.concat(reducedIncidents)
    console.log(drilldownList)

    const columnOpt = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Number of traffic events in each county',
      },
      subtitle: {
        text: 'Click the columns to which areas are affected',
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'Number of events',
      },
      legend: {
        enabled: true,
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span>{point.name}</span>: <b>{point.y}</b> <span>{point.keyword}</span><br/>',
      },

      series: [
        {
          name: 'Construction',
          //colorByPoint: true,
          data: reducedEvents,
          color: '#ed8936'
        },
        {
          name: 'Incident',
          //colorByPoint: true,
          data: reducedIncidents,
          color: '#e53e3e'
        },
      ],
      drilldown: {
        series: drilldownList,
      },
    };

    setColumnOptions(columnOpt);
    setLoading(false);
  }

  return (
    <div className="flex justify-center md:w-2/3 md:ml-auto">
      {loading ? (
        <Spinner className="mt-24" />
      ) : (
        <div className="flex items-center overflow-hidden barchart" style={{ maxHeight: '300px', maxWidth: '100vw' }}>
          <ColumnChart highcharts={Highcharts} options={columnOptions} id="barChart"/>
        </div>
      )}
    </div>
  );
}

export default TrafficColumnChart;