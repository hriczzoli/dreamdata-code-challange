import React, { useState, useEffect } from "react";

export default () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Function for requesting traffic information from API
        const getTrafficData = async () => {
            await fetch(`http://api.511.org/Traffic/Events?api_key=${process.env.REACT_APP_API_KEY}`)
                .then(res => res.json())
                .then(data => {
                    setEvents(data.events)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        getTrafficData();
    }, [])

    return events;
};