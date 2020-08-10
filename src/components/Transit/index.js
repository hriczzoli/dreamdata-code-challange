import React, { useState, useEffect } from 'react';
import { Icon, Tab, Tabs, Spinner } from "@blueprintjs/core";
import { Cell, Column, Table } from "@blueprintjs/table"; 

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
    const [loading, setLoading] = useState(false)

    // To fetch PATTERN - time chedule with stops
    // useEffect(() => {
    //     fetch(`http://api.511.org/transit/pattern?api_key=${process.env.REACT_APP_API_KEY}&operator_id=BA&pattern_id=676390`)
    //                 .then(res => res.json())
    //                 .then(data => {console.log(data)})
    // }, [])

    useEffect(() => {
        getTransitData(step, selectedOperator)
        console.log(lines)
    }, [selectedOperator])

    useEffect(() => {
        if (lineID !== "") {
            console.log(lineID)
            getTransitData(step, selectedOperator, lineID)
        }
    }, [lineID])

    useEffect(() => {
        if (timetable.length !== 0) {
            setLoading(true)
        }
    }, [timetable])

    
    async function getTransitData(step, operator_id = "", line_id = "", pattern_id) {
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
            case "pattern":
                await fetch(`http://api.511.org/transit/${step}?api_key=${process.env.REACT_APP_API_KEY}&operator_id=${operator_id}&&pattern_id=${pattern_id}`)
                    .then(res => res.json())
                    .then(data => {console.log(data)})
                break;
        }
    }

    const showTimeTable = () => {

    }

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
                        <ul className="p-2 shadow-inner overflow-auto" style={{height: '32vh'}}>
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
                            <Timetable view={view || ""} timetable={timetable}/>
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

const Timetable = ({ view, timetable }) => {
    const [table, setTable] = useState({})

    useEffect(() => {
        if (view !== "") {
            timetable.map((t) => {
                if (view === t.Name) {
                    setTable(t)
                }
            })
        }
    }, [view])

    return (
        <div>
            <Table numRows={4}>
                <Column name="Dollars"/>
            </Table>
        </div>
    )
}