import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AccountContext } from './Account';
import Cookies from 'js-cookie';
const PrivateRoute = ({ children}) => {
const isAuth = Cookies.get('isAuthenticated');
//  const { isAuthenticated } = useContext(AccountContext);
  const requestedUrl = window.location.pathname;
  if(requestedUrl){
    sessionStorage.setItem('requestedUrl', requestedUrl);
    console.log(requestedUrl);
  }
  return isAuth ? <>{children}</> : <Navigate to="/signin" />;
};

export default PrivateRoute;
