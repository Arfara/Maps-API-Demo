import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import logo from './Assets/magna.png';

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapsTracking = () => {
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    } else {
      console.log("Geolocation is not available");
    }
  };

  const reverseGeocode = async (latitude, longitude) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      const placeName = data.results[0]?.formatted_address || 'Unknown place';
      setPlaceName(placeName);
      saveLocationToFirestore(latitude, longitude, placeName);
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
    }
  };

  const saveLocationToFirestore = async (latitude, longitude, placeName) => {
    try {
      const docRef = await addDoc(collection(db, "locations"), {
        latitude,
        longitude,
        placeName,
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #ccc' }}>
        <img src={logo} alt="Company Logo" style={{ width: '100px', marginRight: 'auto' }} />
      </header>
      <div style={{ padding: '20px' }}>
        <button style={{ backgroundColor: '#4CAF50', border: 'none', color: 'white', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '0 0 20px 0', cursor: 'pointer', borderRadius: '5px' }} onClick={handleGetLocation}>Get Location</button>
        {location && (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <p>Place Name: {placeName}</p>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={14}
            >
              <Marker 
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                }}
              />
            </GoogleMap>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapsTracking;
