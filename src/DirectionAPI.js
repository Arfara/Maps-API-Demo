import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, SkeletonText, Text } from '@chakra-ui/react';
import { FaLocationArrow, FaTimes, FaPlus, FaBars, FaMapMarkerAlt } from 'react-icons/fa'; 
import CompanyLogo from './Assets/magna.png';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, TrafficLayer } from '@react-google-maps/api';
import { useRef, useState, useEffect } from 'react';

function DirectionAPI() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [additionalWaypoint, setAdditionalWaypoint] = useState('');
  const [rightPaneOpen, setRightPaneOpen] = useState(true);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [heading, setHeading] = useState(null);
  const originRef = useRef();
  const destinationRef = useRef();

  useEffect(() => {
    if (map) {
      const trafficLayerInstance = new window.google.maps.TrafficLayer();
      trafficLayerInstance.setMap(map);
      setTrafficLayer(trafficLayerInstance);
    }
  }, [map]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setHeading(heading);
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
          }
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map]);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (!originRef.current.value && !currentPosition) {
      return;
    }
    if (!destinationRef.current.value) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const waypointsLocations = waypoints.map(waypoint => ({ location: waypoint }));

    const origin = originRef.current.value || currentPosition;

    const results = await directionsService.route({
      origin,
      destination: destinationRef.current.value,
      waypoints: waypointsLocations,
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);
    updateDistanceAndDuration(results);
  }

  function updateDistanceAndDuration(results) {
    let totalDistance = 0;
    let totalDuration = 0;

    results.routes[0].legs.forEach(leg => {
      totalDistance += leg.distance.value;
      totalDuration += leg.duration.value;
    });

    const totalDistanceInKm = (totalDistance / 1000).toFixed(2);
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const totalDurationFormatted = `${hours} hours ${minutes} minutes`;

    setDistance(totalDistanceInKm + ' km');
    setDuration(totalDurationFormatted);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
    setWaypoints([]);
  }

  function addWaypoint() {
    if (additionalWaypoint.trim() !== '') {
      setWaypoints([...waypoints, additionalWaypoint.trim()]);
      setAdditionalWaypoint('');
    }
  }

  function removeWaypoint(index) {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
      
        const latLng = new window.google.maps.LatLng(latitude, longitude);

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK') {
            if (results[0]) {
              const formattedAddress = results[0].formatted_address;
              originRef.current.value = formattedAddress;
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      });
    }
  }

  return (
    <Flex flexDirection='row' h='100vh' w='100vw' overflowX='hidden'>
      <Flex flexDirection='column' alignItems='center' w={rightPaneOpen ? 'calc(100vw - 350px)' : '100vw'} overflowX='hidden'>
        <Flex alignItems='center' justifyContent='space-between' w='100%' p={4} maxWidth='100%'>
          <Box>
            <img src={CompanyLogo} alt="Company Logo" style={{ width: '80px', height: '50px' }} />
          </Box>
          <IconButton aria-label='Toggle Right Pane' icon={<FaBars />} onClick={() => setRightPaneOpen(!rightPaneOpen)} />
        </Flex>

        <Box position='relative' flex='1' width='100%' maxWidth='100%' overflow='hidden'>
          <GoogleMap
            center={currentPosition || { lat: -34.397, lng: 150.644 }}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
            onLoad={map => setMap(map)}
          >
            {currentPosition && (
              <Marker position={currentPosition} icon={{
                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 5,
                rotation: heading,
                fillColor: '#0000ff',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff',
              }} />
            )}
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
            {waypoints.map((waypoint, index) => (
              <Marker key={index} position={waypoint} />
            ))}
            {trafficLayer && <TrafficLayer onLoad={trafficLayer => setTrafficLayer(trafficLayer)} />}
          </GoogleMap>
        </Box>
      </Flex>

      {rightPaneOpen && (
        <Box p={4} borderRadius='lg' m={4} bgColor='white' shadow='base' max-width='300px'>
          <Flex flexDirection='column' mt={4}>
            <Flex flexDirection='row'>
              <Box flex='1' mr={2}>
                <Autocomplete>
                  <Input type='text' placeholder='Origin' ref={originRef} />
                </Autocomplete>
              </Box>
              <Box>
                <IconButton
                  aria-label='Use Current Location'
                  icon={<FaMapMarkerAlt />}
                  onClick={getCurrentLocation}
                  />
              </Box>
            </Flex>
            <Box flex='1' mt={4}>
              <Autocomplete>
                <Input type='text' placeholder='Destination' ref={destinationRef} />
              </Autocomplete>
            </Box>
            <Flex flexDirection='column' mt={4} mb={4}>
              {waypoints.map((waypoint, index) => (
                <Flex key={index} alignItems='center' mb={2}>
                  <Text>{waypoint}</Text>
                  <IconButton aria-label='Remove Waypoint' icon={<FaTimes />} ml={2} onClick={() => removeWaypoint(index)} />
                </Flex>
              ))}
              <Flex flexDirection='row'>
                <Box flex='1'>
                  <Autocomplete>
                    <Input
                      type='text'
                      placeholder='Add Waypoint'
                      value={additionalWaypoint}
                      onChange={e => setAdditionalWaypoint(e.target.value)}
                    />
                  </Autocomplete>
                </Box>
                <IconButton aria-label='Add Waypoint' icon={<FaPlus />} ml={2} onClick={addWaypoint} />
              </Flex>
            </Flex>
            <Box>
              <ButtonGroup>
                <Button colorScheme='blue' type='submit' onClick={calculateRoute}>Calculate Route</Button>
                <IconButton aria-label='clear route' icon={<FaTimes />} onClick={clearRoute} />
              </ButtonGroup>
            </Box>
            <HStack spacing={4} mt={4} justifyContent='space-between'>
              <Text>Distance: {distance}</Text>
              <Text>Duration: {duration}</Text>
              <IconButton
                aria-label='center back'
                icon={<FaLocationArrow />}
                isRound
                onClick={() => {
                  map.panTo(currentPosition);
                  map.setZoom(15);
                }}
              />
            </HStack>
          </Flex>
        </Box>
      )}
    </Flex>
  );
}

export default DirectionAPI;
