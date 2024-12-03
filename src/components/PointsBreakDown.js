import React, { Component,useState,useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../config';

const db = getFirestore(app);
const HousePointsTable = () => {
  const [events, setEvents] = useState([]);
  const houses = ["Discoverers", "Explorers", "Voyagers", "Pioneers"];

  useEffect(() => {
    const fetchData = async () => {
      const eventsMap = {};

      for (const house of houses) {
        const querySnapshot = await getDocs(collection(db, house));
        querySnapshot.forEach((doc) => {
          const { event, place } = doc.data();

          if (!eventsMap[event]) {
            eventsMap[event] = { event, 1: null, 2: null, 3: null, 4: null };
          }
          eventsMap[event][place] = house; // Assign house name to corresponding place
        });
      }

      // Convert the map into an array for rendering
      const eventsArray = Object.values(eventsMap);
      setEvents(eventsArray);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "40%", border: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Event</th>
            <th style={{ width: "10%", border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>Place 1 (20 Points) </th>
            <th style={{ width: "10%", border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>Place 2 (15 Points) </th>
            <th style={{ width: "10%", border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>Place 3 (10 Points) </th>
            <th style={{ width: "10%", border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>Place 4 (05 Points) </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{event.event}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{event[1] || "N/A"}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{event[2] || "N/A"}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{event[3] || "N/A"}</td>
              <td style={{ border: "1px solid #ccc", textAlign: "center", padding: "8px" }}>{event[4] || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HousePointsTable;