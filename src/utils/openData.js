// Fetch traffic data
// export const trafficData = 
// async function getTrafficData() {
//     await fetch('http://api.511.org/Traffic/Events?api_key=${key}')
//         .then(res => res.json())
//         .then(data => console.log(data))
// };

// Fetch transit data
// export const transitData = 
// async function getTransitData() {
//     let result = {}
//     await fetch(`http://api.511.org/transit/timetable?api_key=${process.env.REACT_APP_API_KEY}&operator_id=BA&line_id=YL-S`)
//         .then(res => res.json())
//         .then(data => {console.log(data); result = data})
//     return result
// }

//operators list - endpoint example
//http://api.511.org/transit/operators?api_key=${process.env.REACT_APP_API_KEY}

//specific oparator stops - endpoint example
//http://api.511.org/transit/stops?api_key=${process.env.REACT_APP_API_KEY}&operator_id=CC

//IDs for the 4 major bus agencies: AC, SM, SC, SF
// Major transportation providers/hubs: CT, BA, SF
// select provider, use prov. id to display Lines, 