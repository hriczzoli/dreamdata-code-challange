// The component that's used for displaying the final timetable
// for the selected provider&line

import React, { useState, useEffect } from 'react';
import { Spinner } from "@blueprintjs/core";

import Tree from '../Collapse/index';

const Timetable = ({ pattern, table }) => {
    const [schedule, setSchedule] = useState({})
    const [pat, setPat] = useState([])
    const [loading, setLoading] = useState(true)
    
    //Check if object is empty
    const isEmpty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    // If TIMETABLE changes, set a new table name
    useEffect(() => {
        if (!isEmpty(table)) {
            setSchedule(table)
        }
    }, [table])

    // When the TIMETABLE is selected we iterate through the ServiceJourneyPattern
    // and the TIMETABLE's stops to get pair up the stops with the appropriate 
    // ARRIVAL and DEPARTURE times in order to create the schedule
    useEffect(() => {
        setLoading(true)
        if (!isEmpty(schedule) && pattern.lenght !== 0) {
            pattern.map((p) => {
                p.PointsInSequence.TimingPointInJourneyPattern.map((point) => {
                    schedule.vehicleJourneys.ServiceJourney.map((j) => {
                        j.calls.Call.map((c) => {
                            if (c.ScheduledStopPointRef.ref === point.ScheduledStopPointRef) {
                                point.arrival = c.Arrival.Time
                                point.departure = c.Departure.Time
                            }
                        })
                    })
                })
            })
            setPat(pattern)
        }
    }, [schedule])

    // We only render the schedule, once our algorithm is done creating the updated array
    useEffect(() => {
        if (pat.length !== 0 && Array.isArray(pat) && pat !== undefined) {
            setLoading(false)
        }
    }, [pat])

    return (
      <div
        className="flex flex-col fixed bottom-0 w-full shadow-lg overflow-auto bg-gray-100 md:w-1/2 md:relative md:mx-auto transit-timetable-container"
      >
        {loading ? (
          <Spinner className="m-auto" />
        ) : (
          <div className="p-4">
            <Tree name="Stops" defaultOpen hasIcon={false}>
              { 
                pat.map((p) => {
                    return (
                      <Tree
                        key={p.serviceJourneyPatternRef}
                        name={`${p.Name} - ${p.LineRef}`}
                      >
                        {p.PointsInSequence.TimingPointInJourneyPattern.map((point) => {
                          return (
                            <Tree
                              key={point.TimingPointInJourneyPatternId}
                              name={`${point.Name} - ${point.ScheduledStopPointRef}`}
                              hasIcon={true}
                            >
                              <div className="flex flex-col pl-8 pb-4">
                                <span>Schedule</span>
                                <span>
                                  <span className="font-semibold">Arrival:</span>{' '}
                                  {point.arrival}
                                </span>
                                <span>
                                  <span className="font-semibold">Departure:</span>{' '}
                                  {point.departure}
                                </span>
                              </div>
                            </Tree>
                          );
                        })}
                      </Tree>
                    );
                })
              }
            </Tree>
          </div>
        )}
      </div>
    );
}

export default Timetable;