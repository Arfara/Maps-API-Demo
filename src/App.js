import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DirectionAPI from './DirectionAPI';
import AirQualityAPI from './AirQualityAPI';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/directions" element={<DirectionAPI />} />
        {/* <Route path="/air-quality" element={<AirQualityAPI />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
