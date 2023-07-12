import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AccountContext } from './Account';
import Cookies from 'js-cookie';
const Navbar = () => {
  
  const { logout } = useContext(AccountContext);
  const isAuth = Cookies.get('isAuthenticated');
  const handleLogout = () => {
    logout(); // Call the logout function from your authentication context
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          RAQIB
        </Typography>
        <Button component={NavLink} to="/" color="inherit" activeClassName="active-link" exact>
          Home
        </Button>

       
        {isAuth ? (
          <>
        <Button component={NavLink} to="/createitem" color="inherit" activeClassName="active-link">
          Create
        </Button>
        <Button component={NavLink} to="/searchitem" color="inherit" activeClassName="active-link">
          Search
        </Button>          
        <Button component={NavLink} to="/getqr" color="inherit" activeClassName="active-link">
          Get QR
        </Button>           
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
          </>
        ) : (
          <Button component={NavLink} to="/signin" color="inherit" activeClassName="active-link">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
