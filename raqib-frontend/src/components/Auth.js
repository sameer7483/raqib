import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';

const SignIn = () => {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(username, password);
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

const SignOut = () => {
  const { signOut } = useContext(AuthContext);

  return (
    <div>
      <h2>Sign Out</h2>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

export { SignIn, SignOut };
