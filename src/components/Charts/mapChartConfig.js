import mapDataCA from "@highcharts/map-collection/countries/us/us-ca-all.geo.json";

// Highcharts map chart configuration
export const createMapChart = (events, mapData) => {
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

    return mapOpt;
}