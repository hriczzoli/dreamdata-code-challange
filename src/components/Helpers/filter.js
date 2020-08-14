// This component is used to filter out a specific list of counties
// to re-render the MAP CHART -> in order to only show specific areas and their events

import React, { useState, useEffect } from 'react';
import { Icon, Drawer, Checkbox } from "@blueprintjs/core";

export const Filter = ({ counties, handleFilterMapData, filteredList, resetMapData }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filterList, setFilterList] = useState([])

    return (
        <div>
            <div className="flex justify-center items-center fixed right-0 p-2 text-white bg-gray-500 z-10 cursor-pointer" style={{borderTopLeftRadius: '3px', borderBottomLeftRadius: '3px'}}>
                <Icon icon="filter" iconSize={20} onClick={() => setIsOpen(true)}/>
            </div>

            <Drawer 
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="pt-4 pl-2 flex flex-col">
                    <p className="font-bold text-3xl">Set filters</p>
                    <p className="font-semibold text-gray-500 text-lg">counties with active events:</p>
                    <ul className="mt-8">
                        {
                            counties.map((co) => {
                                return <li key={co.id} className="flex flex-row justify-between">
                                    <span>
                                        <Icon icon="map-marker" iconSize={15} className="mr-4"/>
                                        {co.name}
                                    </span>
                                    <span>
                                        <CustomCheckBox county={co.name} filterList={filterList} setFilterList={setFilterList} filteredList={filteredList}/>
                                    </span>
                                </li>
                            })
                        }
                    </ul>
                    <div className="flex flex-row w-full justify-end items-center">
                        <button
                            onClick={() => {resetMapData(); setIsOpen(false)}}
                            className="text-red-700"
                        >CLEAR
                        </button>
                        <button
                            className="self-end p-4 text-blue-700 text-semibold"
                            onClick={() => {handleFilterMapData(filterList); setIsOpen(false)}}
                        >FILTER
                        </button>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default Filter;

const CustomCheckBox = ({ county, setFilterList, filterList, filteredList }) => {
    const [isChecked, setIsChecked] = useState(false)

    useEffect(() => {
        if (filteredList.legngth !== 0) {
            filteredList.map((c) => {
                if (c.name === county) {
                    setIsChecked(true)
                }
            })
        }
    }, [filteredList])

    return (
        <Checkbox checked={isChecked} onChange={() => {setIsChecked(!isChecked); setFilterList(() => [...filterList, county])}}/>
    )
}