import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import {app} from './config'
// Initialize Firestore
const db = getFirestore(app);

async function sumUpPointsForAllHouses() {
  const db = getFirestore();
  const houses = ['Discoverers', 'Explorers', 'Voyagers', 'Pioneers'];
  const totalPoints = {};

  try {
    for (const house of houses) {
      const houseCollection = collection(db, house);
      const querySnapshot = await getDocs(houseCollection);

      let sum = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sum += data.points || 0;
      });

      totalPoints[house] = sum;
    }

    return totalPoints;
  } catch (error) {
    console.error('Error summing up points:', error);
    throw error;
  }
}

function App() {
  const [housesPoints, setHousesPoints] = useState([]);

  useEffect(() => {
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
              sum += data.points || 0;
            });

            return { house, points: sum };
          })
        );
        setHousesPoints(housesWithPoints);
      } catch (error) {
        console.error('Error fetching houses points:', error);
      }
    }

    fetchHousesPoints();
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
      </header>
    </div>
  );
}

export default App;
