import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../config';

const db = getFirestore(app);

const HousePointsTable = () => {
  const [events, setEvents] = useState([]);
  const houses = ["Discoverers", "Explorers", "Voyagers", "Pioneers"];

  const tableStyles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      color: '#332e63',
    },
    th: {
      border: "1px solid #ccc",
      textAlign: "center",
      padding: "8px",
      fontWeight: 'bold',
    },
    td: {
      border: "1px solid #ccc",
      textAlign: "center",
      padding: "8px",
      fontWeight: "normal",
      color:'#332e63'
    },
    firstColumn: {
      textAlign: "left",
    },
  };

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
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={{ ...tableStyles.th, ...tableStyles.firstColumn }}>Event</th>
            <th style={tableStyles.th}>Place 1 (20 Points)</th>
            <th style={tableStyles.th}>Place 2 (15 Points)</th>
            <th style={tableStyles.th}>Place 3 (10 Points)</th>
            <th style={tableStyles.th}>Place 4 (05 Points)</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={index}>
              <td style={{ ...tableStyles.td, ...tableStyles.firstColumn }}>{event.event}</td>
              <td style={tableStyles.td}>{event[1] || "N/A"}</td>
              <td style={tableStyles.td}>{event[2] || "N/A"}</td>
              <td style={tableStyles.td}>{event[3] || "N/A"}</td>
              <td style={tableStyles.td}>{event[4] || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HousePointsTable;
