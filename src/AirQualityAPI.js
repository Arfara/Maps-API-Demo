import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, SkeletonText, Text } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaCaretDown } from 'react-icons/fa'
import CompanyLogo from './Assets/magna.png';
import { Link } from 'react-router-dom';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(-6.2320011148718315);
  const [longitude, setLongitude] = useState(106.82226076371295);
  const [activeTab, setActiveTab] = useState('airQuality');

  const apiKey = 'AIzaSyDXiinNcPuEv1S1T4rtpeF-mwVp-HOk9yY';
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          'https://airquality.googleapis.com/v1/currentConditions:lookup?key=' + apiKey,
          {
            universalAqi: true,
            location: {
              latitude,
              longitude,
            },
            extraComputations: [
              'HEALTH_RECOMMENDATIONS',
              'DOMINANT_POLLUTANT_CONCENTRATION',
              'POLLUTANT_CONCENTRATION',
              'LOCAL_AQI',
              'POLLUTANT_ADDITIONAL_INFO',
            ],
            languageCode: 'id',
          }
        );

        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  const handleLatitudeChange = (e) => {
    setLatitude(parseFloat(e.target.value));
  };

  const handleLongitudeChange = (e) => {
    setLongitude(parseFloat(e.target.value));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleBackToDirections = () => {
    // Logic untuk kembali ke rute /directions
  };

  return (
    <div>
      <Flex
        alignItems='center'
        justifyContent='space-between'
        w='100%'
        p={4}
        maxWidth='100%'
      >
        {/* Logo */}
        <Box>
          <img src={CompanyLogo} alt="Company Logo" style={{ width: '80px', height: '50px' }} />
        </Box>
        {/* Dropdown Try Another APIs */}
        <Menu>
          <MenuButton as={Button} rightIcon={<FaCaretDown />} variant='outline' colorScheme='blue'>
            Try Another APIs
          </MenuButton>
          <MenuList>
            {/* Gunakan Link untuk mengarahkan ke rute baru */}
            <MenuItem>
              <Link to="/directions">Directions API</Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <div style={{ display: "flex"}}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="latitude" style={{ marginRight: '0.5rem' }}>Latitude:</label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={handleLatitudeChange}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="longitude" style={{ marginRight: '0.5rem' }}>Longitude:</label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={handleLongitudeChange}
          />
        </div>
      </div>
      {isLoading && <p>Loading air quality data...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <div style={{ height: '400px', width: '100%' }}>
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            />
          </div>
          <div>
            <button onClick={() => handleTabChange('airQuality')}>Air Quality Data</button>
          </div>
          <div>
            {activeTab === 'airQuality' && (
              <div>
                <h2>Air Quality Data</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataFetcher;
