// The comopnent we use to take user input in order to find
// schedule (bus/train) for a specific provider on a specific line that it operates

import React from 'react';
import { Icon, Spinner } from "@blueprintjs/core";

import Timetable from './timetable';

const TransitForm = ({ view, setSelectedOperator, setStep, operators, lines, lineID, setLineId, timetable, setView, pattern, selectedTable }) => {
    return (
      <div className="md:flex md:flex-row md:items-center">
        <form className="p-4 md:w-1/3 md:shadow-lg md:rounded md:ml-4">
          <div className="flex flex-col mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Operator:
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onChange={(e) => {
                setSelectedOperator(e.target.value);
                setStep('lines');
              }}
            >
              <option value="" selected disabled hidden>
                Choose preferred operator
              </option>
              {operators.map((op) => (
                <option key={op.Id} value={op.Id}>
                  {op.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <p className="block text-gray-700 text-sm font-bold mb-2">Lines:</p>
            {lines.length === 0 ? (
              <div className="flex justify-center items-center" style={{ height: '23vh' }}>
                <Icon
                icon="layout-linear"
                iconSize={25}
                className="m-auto text-gray-400"
                />
              </div>
            ) : lines.length !== 0 ? (
              <ul
                className="p-2 shadow-inner overflow-auto"
                style={{ height: '23vh' }}
              >
                {lines.map((line) => {
                  return (
                    <li
                      key={line.Id}
                      className={
                        line.Id === lineID
                          ? `flex justify-between bg-gray-200 mt-2 mb-2 p-1`
                          : `flex justify-between hover:bg-gray-200 mt-2 mb-2 p-1`
                      }
                      onClick={() => {
                        setLineId(line.Id);
                        setStep('timetable');
                      }}
                    >
                      <span className="font-semibold">{line.Name}</span>
                      <span>{line.TransportMode}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Spinner />
            )}
          </div>
          <div className="flex flex-col mb-4 mt-4">
            <p className="block text-gray-700 text-sm font-bold mb-2">
              Timetable:
            </p>
            {lineID === '' ? (
              <Icon icon="th" iconSize={25} className="m-auto text-gray-400" />
            ) : timetable.length !== 0 && timetable !== undefined ? (
              <div className="flex flex-row flex-wrap">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  onChange={(e) => setView(e.target.value)}
                >
                  <option value="" selected disabled hidden>
                    Choose timeframe for schedule
                  </option>
                  {timetable.map((table) => {
                    return (
                      <option key={table.id} value={table.Name}>
                        {table.Name}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : timetable === undefined ? (
              <p>Could not find schedule for this line</p>
            ) : (
              <Spinner />
            )}
          </div>
        </form>
        {/* Timetable component */}
        {
            view !== "" && <Timetable pattern={pattern} table={selectedTable} />
        }
      </div>
    );
}

export default TransitForm;