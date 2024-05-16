import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc } from 'firebase/firestore';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import logo from './Assets/magna.png';

const Admin = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      const locationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLocations(locationsData);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const deleteAllLocations = async () => {
    try {
      await Promise.all(locations.map(async (location) => {
        const locationRef = doc(db, 'locations', location.id);
        await deleteDoc(locationRef);
      }));
      console.log("All locations deleted successfully");
    } catch (error) {
      console.error("Error deleting locations: ", error);
    }
  };

  const viewLocationOnMaps = (latitude, longitude) => {
    console.log("Viewing location on maps:", latitude, longitude);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc' }}>
        <img src={logo} alt="Company Logo" style={{ width: '100px', marginRight: 'auto' }} />
      </div>
      <div style={{ padding: '20px' }}>
        <button style={{ backgroundColor: '#4CAF50', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '0 0 20px 0', cursor: 'pointer', borderRadius: '5px' }} onClick={deleteAllLocations}>Delete All Locations</button>
        {locations.length > 0 ? (
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', color: '#333' }}>Latitude</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', color: '#333' }}>Longitude</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', color: '#333' }}>Place Name</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', color: '#333' }}>Timestamp</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', paddingTop: '12px', paddingBottom: '12px', textAlign: 'left', backgroundColor: '#f2f2f2', color: '#333' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => (
                <tr key={location.id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{location.latitude}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{location.longitude}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{location.placeName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(location.timestamp.seconds * 1000).toLocaleString()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    <button style={{ backgroundColor: '#4CAF50', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer', borderRadius: '5px' }} onClick={() => viewLocationOnMaps(location.latitude, location.longitude)}>
                      View Location on Maps
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No locations found</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
