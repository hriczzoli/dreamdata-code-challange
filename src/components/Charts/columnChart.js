// This is a component that displays traffic events organized
// and grouped in an interactive COLUMN CHART - using Highcharts

import React, { useState, useEffect, useContext } from 'react';
import Highcharts from 'highcharts';
import ColumnChart from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown.js';
import proj4 from "proj4";
import { Spinner } from "@blueprintjs/core";

import { AppContext } from '../../context/contextProvider';

drilldown(Highcharts);

if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
}


const TrafficColumnChart = () => {
  const { constructions, incidents } = useContext(AppContext);
  const [loading, setLoading] = useState(true)
  const [columnOptions, setColumnOptions] = useState({})

  useEffect(() => {
      createColumnChart()
  }, [])

  // Highcharts ColumnChart configuration
  const createColumnChart = () => {
    // Create drilldown list
    const drilldownList = constructions.concat(incidents)

    const columnOpt = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Number of traffic events in each county',
      },
      subtitle: {
        text: 'Click the columns to see which areas are affected',
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
          data: constructions,
          color: '#ed8936'
        },
        {
          name: 'Incident',
          //colorByPoint: true,
          data: incidents,
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
        <div className="flex items-center overflow-hidden barchart">
          <ColumnChart highcharts={Highcharts} options={columnOptions} id="barChart"/>
        </div>
      )}
    </div>
  );
}

export default TrafficColumnChart;