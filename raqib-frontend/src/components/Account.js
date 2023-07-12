import React, { createContext, useState, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../UserPool';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AccountContext = createContext();

const Account = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expirationTimer, setExpirationTimer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const isAuth = Cookies.get('isAuthenticated');
      const accessToken = Cookies.get('accessToken');
      if (isAuth && accessToken) {
        const expirationDate = new Date(Cookies.get('accessToken_expires'));
        const currentTime = new Date();
        if (expirationDate > currentTime) {
          setExpirationTimer(setTimeout(logout, expirationDate - currentTime));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          clearTokens();
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const authenticate = async (Username, Password) =>
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });
      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: data => {
          console.log('onSuccess:', data);
          setIsAuthenticated(true);
          const expirationDate = new Date();
          expirationDate.setTime(expirationDate.getTime() + 60 * 60 * 1000);
          Cookies.set('isAuthenticated', 'true');
          Cookies.set('accessToken', data.getAccessToken().getJwtToken(), {
            expires: expirationDate,
          });
          Cookies.set('accessToken_expires', expirationDate.toUTCString());
          Cookies.set('idToken', data.getIdToken().getJwtToken(), {
            expires: expirationDate,
          });
          Cookies.set('role', data.getIdToken().payload['custom:Role'], {
            expires: expirationDate,
          });
          setExpirationTimer(setTimeout(logout, 24 * 60 * 60 * 1000));
          resolve(data);
        },
        onFailure: err => {
          console.error('onFailure:', err);
          reject(err);
        },
        newPasswordRequired: data => {
          console.log('newPasswordRequired:', data);
          resolve(data);
        },
      });
    });

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    localStorage.setItem('logoutFlag', 'true');
    setIsAuthenticated(false);
    clearTokens();
    dispatch({ type: 'RESET' });
    const broadcastChannel = new BroadcastChannel('logoutChannel');
    broadcastChannel.postMessage('logout');
    navigate('/signin'); // Redirect to sign-in page
  };

  const clearTokens = () => {
    clearTimeout(expirationTimer);
    setExpirationTimer(null);
    Cookies.remove('accessToken');
    Cookies.remove('accessToken_expires');
    Cookies.remove('idToken');
    Cookies.remove('refreshToken');
    Cookies.remove('isAuthenticated');
  };

  return (
    <AccountContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
