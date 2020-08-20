import React, { useState } from "react";

import getTrafficEvents from "../lib/getTrafficEvents";
import constructEventList from "../lib/constructEventList";
import getReducedEvents from "../lib/getReducedEvents";
import getConstructionsListList from "../lib/getConstructionList";
import getIncidentList from "../lib/getIncidentList";

export const AppContext = React.createContext();

export default (props) => {
    const tEvents = getTrafficEvents();
    const eventList = constructEventList(tEvents);
    const reducedEvents = getReducedEvents(eventList);
    const constructions = getConstructionsListList(eventList);
    const incidents = getIncidentList(eventList);

    return (
        <AppContext.Provider
            value={{
                tEvents,
                eventList,
                reducedEvents,
                constructions,
                incidents
            }}
        >
            {props.children}
        </AppContext.Provider>
    )
}