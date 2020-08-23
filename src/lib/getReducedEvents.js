import React, { useState, useEffect } from "react";

export default (eventList) => {
    const [reducedEvents, setReducedEvents] = useState();

    useEffect(() => {
            if (!eventList) return;
            
            // Reduce events to display organized list of data - with count of number of events in the same area
            const countedEvents = Object.values(eventList.reduce((a, {name, keyword, roadsState}) => {
                a[name] = a[name] || {name, y: 0, keyword, roadsState, drilldown: name, id: name, data: []};
                a[name].y++;
                return a;
            }, Object.create(null)))
        
            // If name of events is a match -> add info of event to array called 'data'
            countedEvents.map((re) => {
                eventList.map((event) => {
                if (re.name === event.name) {
                    re.data.push(event)
                }
                })
            })

            setReducedEvents(countedEvents);
        

    }, [eventList])

    return reducedEvents;
}