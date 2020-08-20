// Highcharts ColumnChart configuration
export const createColumnChart = (constructions, incidents) => {
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

    return columnOpt;
}