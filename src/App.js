import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DirectionAPI from './DirectionAPI';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/directions" element={<DirectionAPI />} />
      </Routes>
    </Router>
  );
}

export default App;
