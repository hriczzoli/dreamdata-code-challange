// This is a component that displays traffic events organized
// and grouped in an interactive COLUMN CHART - using Highcharts

import React, { useState, useEffect, useContext } from 'react';
import Highcharts from 'highcharts';
import ColumnChart from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown.js';
import proj4 from "proj4";
import { Spinner } from "@blueprintjs/core";

import { AppContext } from '../../context/contextProvider';
import { createColumnChart } from './columnChartConfig';

drilldown(Highcharts);

if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
}


const TrafficColumnChart = () => {
  const { constructions, incidents } = useContext(AppContext);
  const [loading, setLoading] = useState(true)
  const [columnOptions, setColumnOptions] = useState({})

  useEffect(() => {
      let options = createColumnChart(constructions, incidents)
      setColumnOptions(options)
      setLoading(false)
  }, [])


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