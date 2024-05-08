import React, { useState } from 'react';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import CompanyLogo from './Assets/magna.png';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const staticUser = { username: 'magnaglobal', password: 'M@gn@1234' };
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); 
    try {
      await new Promise((resolve) => setTimeout(resolve, 900)); 
      if (formData.username === staticUser.username && formData.password === staticUser.password) {
        navigate('/directions');
      } else {
        setErrorMessage('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh">
      <Flex alignItems="center" justifyContent="center" w="100%" p={4} maxWidth="100%">
        {/* Logo */}
        <Box mr={2}>
          <img src={CompanyLogo} alt="Company Logo" style={{ width: '100px', height: '70px' }} />
        </Box>
      </Flex>
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '24px' }}>Google Maps API Demo</h2>
      <Box p={8} borderRadius="md" borderWidth="1px" boxShadow="md">
        <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '24px' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <label htmlFor="username" style={{ marginBottom: '8px' }}>Username</label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" style={{ marginBottom: '8px' }}>Password</label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {errorMessage && <div style={{ color: '#ff0000', textAlign: 'center' }}>{errorMessage}</div>}
          <Button type="submit" colorScheme="blue" width="100%" mt={5} isLoading={isLoading}>Login</Button>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
