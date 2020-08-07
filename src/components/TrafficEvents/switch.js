import React from 'react';

export const Switch = ({ view, setView }) => {

    return (
        <div className="flex justify-around bg-gray-200 w-full mx-auto mb-3 sm:mt-0 shadow-md">
            <Button color="blue" label="Map" viewName="MAP" view={view} setView={setView} />
            <Button color="blue" label="Stats" viewName="STATS" view={view} setView={setView}/>
        </div>
    )
}

export default Switch;

const Button = ({ color, label, viewName, view, setView }) => {

    const active = viewName === view
    const containerStyles = active ? `border-${color}-600 text-gray-700 border-b-2` : `text-gray-700`

    return (
        <button
            className={`w-full py-2 px-3 font-bold ${containerStyles}`}
            onClick={() => setView(viewName)}
        >
            <span className="mr-1">{label}</span>
        </button>
    )
}