import React, { useState, useEffect } from 'react';
import { Icon, Tab, Tabs, Spinner } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table"; 

import Tree from '../Collapse/index';

export const Transit = () => {
    const [step, setStep] = useState("")
    const [operators, setOperators] = useState(
        [{"id": "CT",
         "name": "CalTrain",
        },
        {
          "id": "BA",
          "name": "BART" 
        },
        {
          "id": "SF",
          "name": "Muni"
        }]
    )
    const [selectedOperator, setSelectedOperator] = useState("")
    const [lines, setLines] = useState([])
    const [lineID, setLineId] = useState("")
    const [timetable, setTimetable] = useState([])
    const [view, setView] = useState("")
    const [selectedTable, setSelectedTable] = useState({})
    const [pattern, setPattern] = useState()

    useEffect(() => {
        getTransitData(step, selectedOperator)
        console.log(lines)
    }, [selectedOperator])

    useEffect(() => {
        if (lineID !== "") {
            console.log(lineID)
            getTransitData(step, selectedOperator, lineID)
            getTransitData("patterns", selectedOperator, lineID)
        }
    }, [lineID])

    
    async function getTransitData(step, operator_id = "", line_id = "") {
        switch (step){
            case "lines":
                await fetch(`http://api.511.org/transit/${step}?api_key=${process.env.REACT_APP_API_KEY}&operator_id=${operator_id}`)
                    .then(res => res.json())
                    .then(data => setLines(data))
                break;
            case "timetable":
                await fetch(`http://api.511.org/transit/${step}?api_key=${process.env.REACT_APP_API_KEY}&operator_id=${operator_id}&line_id=${line_id}`)
                    .then(res => res.json())
                    .then(data => {setTimetable(data.Content.TimetableFrame); console.log(data)})
                break;
            case "patterns":
                await fetch(`http://api.511.org/transit/patterns?api_key=${process.env.REACT_APP_API_KEY}&operator_id=${operator_id}&line_id=${line_id}`)
                    .then(res => res.json())
                    .then(data => {console.log(data.journeyPatterns); setPattern(data.journeyPatterns)})
                break;
        }
    }

    useEffect(() => {
        if (view !== "") {
            timetable.map((t) => {
                if (view === t.Name) {
                    setSelectedTable(t)
                }
            })
        }
    }, [view])

    return (
        <div>
            <p className="text-xl p-4 font-semibold">Find transit options</p>
            <form className="p-4">
                <div className="flex flex-col mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Operator:</label>
                    <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        onChange={(e) => {setSelectedOperator(e.target.value); setStep("lines")}}
                    >
                        <option value="" selected disabled hidden>Choose preferred operator</option>
                        {
                            operators.map((op) => <option key={op.id} value={op.id}>{op.name}</option>)
                        }
                    </select>
                </div>
                <div className="flex flex-col mb-4">
                    <p className="block text-gray-700 text-sm font-bold mb-2">Lines:</p>
                    {
                        lines.length === 0 ?
                            <Icon icon="layout-linear" iconSize={25} className="m-auto text-gray-400"/>
                        :
                        lines.length !== 0 ?
                        <ul className="p-2 shadow-inner overflow-auto" style={{height: '23vh'}}>
                        {
                            lines.map((line) => {
                                return <li 
                                            key={line.Id}
                                            className={line.Id === lineID ? `flex justify-between bg-gray-200 mt-2 mb-2 p-1` : `flex justify-between hover:bg-gray-200 mt-2 mb-2 p-1`}
                                            onClick={() => {setLineId(line.Id); setStep("timetable")}}
                                        >
                                            <span className="font-semibold">{line.Name}</span>
                                            <span>{line.TransportMode}</span>
                                        </li>
                            })
                        }
                        </ul>
                        :
                        <Spinner />
                    }
                </div>
                <div className="flex flex-col mb-4 mt-4">
                    <p className="block text-gray-700 text-sm font-bold mb-2">Timetable:</p>
                    {
                        lineID === "" ?
                        <Icon icon="th" iconSize={25} className="m-auto text-gray-400"/>
                        :
                        timetable.length !== 0 && timetable !== undefined ?
                        <div className="flex flex-row flex-wrap">
                            <select
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                onChange={(e) => setView(e.target.value)}
                            >
                            <option value="" selected disabled hidden>Choose timeframe for schedule</option>
                            {
                                timetable.map((table) => {
                                    return <option 
                                                key={table.id}
                                                value={table.Name}
                                            >
                                            {table.Name}
                                            </option>
                                })
                            }
                            </select>
                            {/* Timetable component */}
                            <Timetable pattern={pattern} table={selectedTable}/>
                        </div>
                        :
                        timetable === undefined ?
                        <p>Could not find schedule for this line</p>
                        :
                        <Spinner />
                    }
                </div>
            </form>
        </div>
    )
}

export default Transit;

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

    useEffect(() => {
        if (!isEmpty(table)) {
            setSchedule(table)
        }
    }, [table])

    useEffect(() => {
        setLoading(true)
        if (!isEmpty(schedule) && pattern.lenght !== 0) {
            pattern.map((p) => {
                p.PointsInSequence.TimingPointInJourneyPattern.map((point) => {
                        schedule.vehicleJourneys.ServiceJourney.map((j) => {
                            j.calls.Call.map((c) => {
                                if (c.ScheduledStopPointRef.ref === point.ScheduledStopPointRef) {
                                    point.arrival = c.Arrival
                                    point.departure = c.Departure
                                    console.log("done")
                                }
                            })
                        })
                })
            })
            setPat(pattern)
        }
    }, [pattern, schedule])

    useEffect(() => {
        if (pat.length !== 0) {
            console.log(pat, "from tree")
            setLoading(false)
        }
    }, [pat])

    return (
      <div
        className="flex flex-col fixed bottom-0 w-full shadow-lg overflow-auto bg-gray-100"
        style={{ height: '15rem' }}
      >
        {loading ? (
          <Spinner className="m-auto" />
        ) : (
          <div className="p-4">
            <Tree name="Stops" defaultOpen hasIcon={false}>
              { Array.isArray(pat) && (
                pat.map((p) => {
                    return (
                      <Tree
                        key={p.serviceJourneyPatternRef}
                        name={`${p.Name} - ${p.LineRef}`}
                      >
                        {p.TimingPointInJourneyPattern.map((point) => {
                          return (
                            <Tree
                              key={point.TimingPointInJourneyPatternId}
                              name={`${point.name} - ${point.ScheduledStopPointRef}`}
                              hasIcon={true}
                            >
                              <div className="flex flex-col">
                                <span>Schedule</span>
                                <span>
                                  <span className="font-semibold">Arrival:</span>{' '}
                                  {point.arrival.Time}
                                </span>
                                <span>
                                  <span className="font-semibold">Departure:</span>{' '}
                                  {point.departure.Time}
                                </span>
                              </div>
                            </Tree>
                          );
                        })}
                      </Tree>
                    );
                })
              )}
            </Tree>
          </div>
        )}
      </div>
    );
}