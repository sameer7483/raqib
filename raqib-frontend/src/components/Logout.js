import React from 'react';
import { AccountContext } from './Account';

const Logout = () => {
  const { logout } = useContext(AccountContext);
  const handleLogout = () => {
    // Perform any necessary logout actions, such as clearing tokens from local storage or state
    logout();
    console.log('Logged out successfully');
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
