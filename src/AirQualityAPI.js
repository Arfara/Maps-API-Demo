import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { FaCaretDown } from 'react-icons/fa'
import CompanyLogo from './Assets/magna.png';
import { Link } from 'react-router-dom';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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

  return (
    <div>
      <Flex
        alignItems='center'
        justifyContent='space-between'
        w='100%'
        p={4}
        maxWidth='100%'
      >
        <Box>
          <img src={CompanyLogo} alt="Company Logo" style={{ width: '80px', height: '50px' }} />
        </Box>
        <Menu>
          <MenuButton as={Button} rightIcon={<FaCaretDown />} variant='outline' colorScheme='blue'>
            Try Another APIs
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Link to="/directions">Directions API</Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <div>
        <label htmlFor="latitude">Latitude:</label>
        <input
          type="number"
          id="latitude"
          value={latitude}
          onChange={handleLatitudeChange}
        />
      </div>
      <div>
        <label htmlFor="longitude">Longitude:</label>
        <input
          type="number"
          id="longitude"
          value={longitude}
          onChange={handleLongitudeChange}
        />
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
          {data.indexes && (
            <div>
              <h2>Dominant Pollutant</h2>
              <p>{data.indexes[0].dominantPollutant}</p>
            </div>
          )}
          {data.healthRecommendations && (
            <div>
              <h2>Health Recommendations</h2>
              <p>{data.healthRecommendations.generalPopulation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataFetcher;
