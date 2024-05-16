import React, { useState } from 'react';
import { Box, Button, Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import CompanyLogo from './Assets/magna.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        navigate('/main-menu');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh">
      <Flex alignItems="center" justifyContent="center" w="100%" p={2} maxWidth="100%">
        {/* Logo */}
        <Box mr={2}>
          <img src={CompanyLogo} alt="Company Logo" style={{ width: '80px', height: '56px' }} />
        </Box>
      </Flex>
      <h2 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Google Maps API Demo</h2>
      <Box p={4} borderRadius="md" borderWidth="1px" boxShadow="md" width="80%" maxWidth="400px">
        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '20px' }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label htmlFor="username">Username</label>
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
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label htmlFor="password">Password</label>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'} // Menggunakan tipe input berdasarkan state showPassword
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <InputRightElement>
                {showPassword ? (
                  <FaEyeSlash onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                ) : (
                  <FaEye onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
                )}
              </InputRightElement>
            </InputGroup>
          </div>
          {errorMessage && <div style={{ color: '#ff0000', textAlign: 'center', marginBottom: '10px' }}>{errorMessage}</div>}
          <Button type="submit" colorScheme="blue" width="100%" isLoading={isLoading}>Login</Button>
        </form>
      </Box>
    </Flex>
  );
};

export default LoginPage;
