import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './config';

// Initialize Firestore
const db = getFirestore(app);

function App() {
  const [housesPoints, setHousesPoints] = useState([]);
  const [latestData, setLatestData] = useState({});

  async function fetchHousesPoints() {
    try {
      const houses = ['Discoverers', 'Explorers', 'Voyagers', 'Pioneers'];
      const housesWithPoints = await Promise.all(
        houses.map(async (house) => {
          const houseCollection = collection(db, house);
          const querySnapshot = await getDocs(houseCollection);

          let sum = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            sum += data.points || data.customPoints || 0;
          });

          return { house, points: sum };
        })
      );
      setHousesPoints(housesWithPoints);
    } catch (error) {
      console.error('Error fetching houses points:', error);
    }
  }

  async function fetchLatestFileData() {
    try {
      const fileDataCollection = collection(db, 'FileData');
      const querySnapshot = await getDocs(fileDataCollection);

      // Store the latest document with respect to the date field
      let latestDoc = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!latestDoc || new Date(data.date) > new Date(latestDoc.date)) {
          latestDoc = data;
        }
      });

      if (latestDoc) {
        setLatestData({
          Discoverers: latestDoc.Discoverers || 0,
          Explorers: latestDoc.Explorers || 0,
          Voyagers: latestDoc.Voyagers || 0,
          Pioneers: latestDoc.Pioneers || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching latest file data:', error);
    }
  }

  useEffect(() => {
    fetchHousesPoints();
    fetchLatestFileData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="winners">
          {housesPoints.map(({ house, points }) => (
            <div className={`house ${house.toLowerCase()}`} key={house}>
              <span>{house}</span>
              <span>Points: {points}</span>
            </div>
          ))}
        </div>
        <div className="latest-data">
          <h3>Latest Data from FileData:</h3>
          {Object.keys(latestData).length > 0 ? (
            <div>
              {Object.entries(latestData).map(([house, points]) => (
                <div key={house} className={`house ${house.toLowerCase()}`}>
                  <span>{house} Latest Points: {points}</span>
                </div>
              ))}
            </div>
          ) : (
            <span>No latest data available</span>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
