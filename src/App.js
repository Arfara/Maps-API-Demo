import { Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, SkeletonText, Text } from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaCaretDown } from 'react-icons/fa'
import CompanyLogo from './Assets/magna.png';

import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: -6.241193693118617, lng: 106.834407451799 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  const originRef = useRef()
  const destinationRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (!originRef.current.value || !destinationRef.current.value) {
      return
    }
    const directionsService = new window.google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
      overflowX='hidden'
    >
      {/* Header */}
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
            <MenuItem>Geocoding API (under development)</MenuItem>
            <MenuItem>Geolocation API (under development)</MenuItem>
            <MenuItem>Streetview API (under development)</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Google Map Box */}
      <Box position='relative' flex='1' width='100%' maxWidth='100%' overflow='hidden'>
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      {/* Form untuk input origin dan destination */}
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minWidth='90%'
        maxWidth='90%'
      >
        <Flex flexDirection={['column', 'row']} gap='5'>
          <Box flex={['none', '1']}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flex={['none', '1']} mt={[4, 0]}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>
          <Box mt={[4, 0]}>
            <ButtonGroup>
              <Button colorScheme='blue' type='submit' onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label='center back'
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>
          </Box>
        </Flex>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
