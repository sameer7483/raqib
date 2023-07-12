import React, { useEffect } from 'react';
import NavBar from './components/Navbar';
import Footer from './components/Footer';
import CreateItem from './components/CreateItem';
import SearchItem from './components/SearchItem';
import { Route, Routes } from 'react-router-dom';
import ProductDetails from './components/ProductDetails';
import Signup from "./components/Signup"
import './index.css';
import Signin from './components/Signin';
import { Account } from './components/Account';
import PrivateRoute from './components/PrivateRoute'
import GetQr from './components/GetQr';
import { useNavigate } from 'react-router-dom';
function App() {

  const navigate = useNavigate();
  useEffect(() => {
    const handleBroadcastMessage = (event) => {
      if (event.data === 'logout') {
        // Redirect to sign-in page
        navigate('/signin');
      }
    };

    // Create Broadcast Channel and add message listener
    const broadcastChannel = new BroadcastChannel('logoutChannel');
    broadcastChannel.addEventListener('message', handleBroadcastMessage);

    // Clean up Broadcast Channel and listener when component unmounts
    return () => {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
      broadcastChannel.close();
    };
  }, [navigate]); 
  return (
    <>
    <Account>
      <NavBar />
        <Routes>
          <Route exact path="/" element={
            <PrivateRoute>
              <CreateItem />
            </PrivateRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/createitem" element={
            <PrivateRoute>
              <CreateItem />
            </PrivateRoute>
          } />
          <Route path="/searchitem" element={
            <PrivateRoute>
            <SearchItem />
           </PrivateRoute>
          } />
          <Route path="/products/:slug" element={
          <PrivateRoute>
          <ProductDetails />
         </PrivateRoute>          
          } />
          <Route path="/getqr" element={
          <PrivateRoute>
          <GetQr />
         </PrivateRoute>          
          } />          
        </Routes>
      </Account>
    <Footer />   
    </>
  );
}

export default App;
