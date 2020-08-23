import React, { useState, useEffect } from "react";

export default (events) => {
    const [eventList, setEventList] = useState([]);

    useEffect(() => {
        const localList = [];

        events.map((event) => 
            localList.push({
                z: 10,
                id: event.id,
                name: event.areas[0].name,
                keyword: event.event_type,
                headline: event.headline,
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

        setEventList(localList);
    }, [events])

    return eventList;
}