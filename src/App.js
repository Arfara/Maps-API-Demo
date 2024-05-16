import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import MainMenu from './MainMenu';
import DirectionAPI from './DirectionAPI';
import AirQualityAPI from './AirQualityAPI';
import MapsTracking from './MapsTracking';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main-menu" element={<MainMenu/>}/>
        <Route path="/directions" element={<DirectionAPI />} />
        <Route path="/air-quality" element={<AirQualityAPI />} />
        <Route path="/maps-tracking" element={<MapsTracking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
