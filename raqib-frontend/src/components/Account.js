import React, { createContext, useState, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Pool from '../UserPool';
import { useNavigate } from 'react-router-dom';
const AccountContext = createContext();

const Account = (props) => {
  useEffect(() => {
    checkSession();
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const checkSession = async () => {
    try {
      const session = await getSession();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const getSession = async () => {
    const isAuth = sessionStorage.getItem('isAuthenticated');
    console.log(isAuth)
    if (isAuth) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
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
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('accessToken', data.getAccessToken().getJwtToken());
        sessionStorage.setItem('idToken', data.getIdToken().getJwtToken());
        sessionStorage.setItem('role', data.getIdToken().payload['custom:Role']);
        resolve(data);
      },
      onFailure: err => {
        console.error('onFailure:', err);
        reject(err);
      },
      newPasswordRequired: data => {
        console.log('newPasswordRequired:', data);
        resolve(data);
      }
    });
  });

  const storeTokens = (session) => {
    sessionStorage.setItem('accessToken', session.getAccessToken().getJwtToken());
    sessionStorage.setItem('idToken', session.getIdToken().getJwtToken());
    sessionStorage.setItem('refreshToken', session.getRefreshToken().getToken());
  };

  const logout = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    setIsAuthenticated(false);
    clearTokens();
    navigate('/signin'); // Redirect to sign-in page
  };

  const clearTokens = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('isAuthenticated');
  };

  return (
    <AccountContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
