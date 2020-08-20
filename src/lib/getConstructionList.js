export default (events) => {
    const constructions = events.filter((ev) => {
        return ev.keyword === 'CONSTRUCTION'
    })

    // Reduce event list and create count attribute
    const reducedConstructions = Object.values(constructions.reduce((a, {name, keyword, roadsState}) => {
        a[name] = a[name] || {name, y: 0, keyword, roadsState, drilldown: name, id: name, data: []};
        a[name].y++;
        return a;
      }, Object.create(null)))
  
      reducedConstructions.map((re) => {
        events.map((event) => {
          if (re.name === event.name) {
            const info = {
              keyword: event.keyword,
              road_state: event.roadState,
            };
            if (re.keyword === event.keyword) {
              re.data.push([event.from, 1, info]);
            }
          }
        });
      });

    return reducedConstructions;
}