// The main component that is rendered when navigating to the TRANSIT page
// in the application. -> it renders the FORM and the TIMETABLE components

import React, { useState, useEffect } from 'react';

import TransitForm from './transitForm';

export const Transit = () => {
    const [step, setStep] = useState("")
    const [operators, setOperators] = useState([])
    const [selectedOperator, setSelectedOperator] = useState("")
    const [lines, setLines] = useState([])
    const [lineID, setLineId] = useState("")
    const [timetable, setTimetable] = useState([])
    const [view, setView] = useState("")
    const [selectedTable, setSelectedTable] = useState({})
    const [pattern, setPattern] = useState()
    const [loading, setLoading] = useState(false)
    const [failed, setFailed] = useState(false)

    // Fetch list of operators
    useEffect(() => {
        getTransitData("operators")
        setLines([])
    }, [])

    // When operator has been selected -> we fetch available lines for
    // that specific operator
    useEffect(() => {
        if (selectedOperator !== "") {
            getTransitData(step, selectedOperator)
            console.log(lines)
            setLoading(false)
        }
    }, [selectedOperator])

    // Once we selected the prefferred line as well
    // then we fetch the TIMETABLE and the ServiceJourneyPatterns
    // to put together a proper schedule
    useEffect(() => {
        if (lineID !== "") {
            console.log(lineID)
            getTransitData(step, selectedOperator, lineID)
            getTransitData("patterns", selectedOperator, lineID)
        }
    }, [lineID])

    // Fetching different aspects of TRANSIT data - according to the 4 main steps in our flow
    // to put together a schedule for a specific line
    async function getTransitData(step, operator_id = "", line_id = "") {
        switch (step){
            case "operators":
                await fetch(`http://api.511.org/transit/${step}?api_key=${process.env.REACT_APP_API_KEY}`)
                    .then(res => res.json())
                    .then(data => {console.log(data); setOperators(data)})
                    .catch(error => {console.log(error); setLoading(false); setFailed(true)})
                    break;
            case "lines":
                setLoading(true)
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
                    .then(data => {console.log(data.journeyPatterns, 'pattern'); setPattern(data.journeyPatterns)})
                break;
        }
    }

    // Finally when the preferred TIMETABLE is selected we set the state
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
        <div className="transit-containerdiv">
            <p className="text-xl p-4 font-semibold md:my-6">Find transit options</p>
            <TransitForm 
                setSelectedOperator={setSelectedOperator} 
                setStep={setStep} 
                operators={operators}
                lines={lines}
                lineID={lineID}
                setLineId={setLineId}
                timetable={timetable}
                setView={setView}
                pattern={pattern} 
                selectedTable={selectedTable}
                view={view}
                loading={loading}
                failed={failed}
            />
        </div>
    )
}

export default Transit;