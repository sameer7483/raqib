import React, { useState } from 'react';
import { Typography, TextField, Button, Container, MenuItem } from '@mui/material';
import UserPool from '../UserPool';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
const roleMap = {
  0: 'READER',
  1: 'WRITER',
  2: 'ADMIN'
};

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(0);
  const handleSignup = async (e) => {
    e.preventDefault();
    // Create a new user using CognitoIdentityServiceProvider
    // const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
    // console.log(cognito);
    // try {
    //   const signupResponse = await cognito.signUp({
    //     ClientId: '7plav5ppokas3cp4mh3casdikp',
    //     Username: givenName,
    //     Password: password,
    //     UserAttributes: [
    //       { Name: 'given_name', Value: givenName },
    //       { Name: 'family_name', Value: familyName },
    //       { Name: 'email', Value: email },
    //     ],
    //   }).promise();
    //   alert('Signup success')
    //   console.log(signupResponse);
    //   // Handle any further steps like email verification
    // } catch (error) {
    //   console.log(error);
    //   // Handle signup error
    // }
    const attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'custom:Role', Value: roleMap[role] })
    ];   
    UserPool.signUp(username, password, attributes, null, (err, data) => {
        if (err) {
          alert(err);
          console.log(err);
        }
        else{
          alert(`${username} registered successfully, Admin needs to confirm for you to be able to login`)
        }
          
      });    
  };

  const handleRoleChange = (e) => {
    const newRole = parseInt(e.target.value);
    setRole(newRole);
  };  

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" align="center" gutterBottom>
        Signup
      </Typography>
      <form onSubmit={handleSignup}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <TextField
          label="Role"
          select
          value={role}
          onChange={handleRoleChange}
          fullWidth
          margin="normal"
          required
        >
          {Object.entries(roleMap).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </TextField>           
        <Button variant="contained" color="primary" type="submit">
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
