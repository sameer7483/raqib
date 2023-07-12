import React, { useState, useContext, useEffect } from 'react';
import { Typography, TextField, Button, Container } from '@mui/material';
import { AccountContext } from './Account';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Signin = () => {
  const navigate = useNavigate();
  useEffect(()=>{
    if(Cookies.get('isAuthenticated')){
      navigate('/');
    }
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { authenticate } = useContext(AccountContext);
  const handleSignin = async (e) => {
    e.preventDefault();
    const requestedUrl = sessionStorage.getItem('requestedUrl');
    authenticate(username, password)
      .then(data => {
        // console.log('Logged in!', data);
        navigate(requestedUrl || '/');
      })
      .catch(err => {
        console.error('Failed to login!', err);
        alert(err);
      })
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" gutterBottom>
        Signin
      </Typography>
      <form onSubmit={handleSignin}>
        <TextField
          label="Username"
          type="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button variant="contained" color="primary" type="submit">
          Sign In
        </Button>
      </form>
    </Container>
  );
};

export default Signin;
