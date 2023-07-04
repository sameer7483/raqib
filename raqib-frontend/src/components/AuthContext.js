import React, { createContext, useState, useEffect } from 'react';
import { Auth } from 'aws-sdk';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is already authenticated on app load
    checkAuthenticated();
  }, []);

  const checkAuthenticated = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
      })
      .catch(() => {
        setUser(null);
      });
  };

  const signIn = async (username, password) => {
    try {
      await Auth.signIn(username, password);
      checkAuthenticated();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
