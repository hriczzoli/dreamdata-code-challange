// Component is used for displaying a list of traffic events
// underneath/next to (depending on device ratio) the chart

import React from 'react';
import Tree from '../Collapse/index';

const EventListTree = ({ reducedEvents }) => {
    return (
        <div className="flex flex-col fixed bottom-0 w-full shadow-lg overflow-auto bg-gray-100 md:w-1/3 md:l-0 md:shadow-lg md:mr-auto md:mt-12 md:top-0 barchart-event-list">
            <p className="text-lg font-semibold pl-4 sticky top-0 bg-blue-700 text-white z-10 pt-4 pb-4 shadow-lg">Counties</p>
                <div className="p-4">
                    <Tree name="Counties" defaultOpen hasIcon={false}>
                        {
                            reducedEvents.map((event) => {
                                return <Tree key={event.id} name={`${event.name} - ${event.y}`} hasIcon={true}>
                                    {
                                        event.data.map((data) => {
                                            return <Tree key={data.id} name={`${data.name} - ${data.keyword}`}>
                                                    <div className="flex flex-col pb-4">
                                                        <span>{data.headline}</span>
                                                        <span><span className="font-semibold">Conditions:</span> {data.roadsState}</span>
                                                        <span><span className="font-semibold">Direction:</span> {data.direction}</span>
                                                        <span><span className="font-semibold">From:</span> {data.from}</span>
                                                        <span><span className="font-semibold">To:</span> {data.to}</span>
                                                        <span><span className="font-semibold mb-4">Updated:</span> {data.updated}</span>
                                                    </div>
                                                </Tree>
                                        })
                                    }
                                        </Tree>
                            })
                        }
                    </Tree>
                </div>
        </div>
    )
}

export default EventListTree;