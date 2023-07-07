import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem } from '../actions/itemActions';
import { Button, Container, TextField, Typography } from '@mui/material';

function CreateItem() {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [seqNum, setSeqNum] = useState('');
  const [isOrderIdValid, setIsOrderIdValid] = useState(true);
  const [isProductIdValid, setIsProductIdValid] = useState(true);
  const [isSeqNumValid, setIsSeqNumValid] = useState(true);
  const isFormValid = orderId && productId && seqNum && isSeqNumValid;
  const imageUrl = useSelector((state) => state.item.imageUrl);

  useEffect(() => {
    dispatch({ type: 'RESET'});
  }, []); // Call reset when the component mounts

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createItem(orderId, productId, seqNum)); 
    // setOrderId('');
    // setProductId('');
    setSeqNum('');
  };

  const handleOrderIdChange = (e) => {
    const value = e.target.value.trim();
    setOrderId(value);
    setIsOrderIdValid(/^[a-zA-Z0-9]+$/.test(value));
  };

  const handleProductIdChange = (e) => {
    const value = e.target.value.trim();
    setProductId(value);
    setIsProductIdValid(/^[a-zA-Z0-9]+$/.test(value));
  };
  const handleSeqNumChange = (e) => {
    const value = e.target.value.trim();;
    setSeqNum(value);
    setIsSeqNumValid(/^\d+$/.test(value));
  };

  return (
    <Container maxWidth="sm">
      <h2>Create Item or Get QR of Existing Item</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Order ID"
          variant="outlined"
          value={orderId}
          onChange={handleOrderIdChange}
          fullWidth
          margin="normal"
          required
          error={!isOrderIdValid}
          helperText={!isOrderIdValid && 'OrderId must be alphanumeric'}             
        />

        <TextField
          label="Product ID"
          variant="outlined"
          value={productId}
          onChange={handleProductIdChange}
          fullWidth
          margin="normal"
          required
          error={!isProductIdValid}
          helperText={!isProductIdValid && 'ProductId must be alphanumeric'}           
        />

        <TextField
          label="Sequence Number"
          variant="outlined"
          value={seqNum}
          onChange={handleSeqNumChange}
          fullWidth
          margin="normal"
          required
          error={!isSeqNumValid}
          helperText={!isSeqNumValid && 'Sequence number must be a number'}          
        />

        <Button variant="contained" color="primary" type="submit" disabled={!isFormValid}>
          Create
        </Button>
      </form>
      {imageUrl && (
        <div>
          <h3>QR Code for: {imageUrl.split("/").slice(-3).join('-')}</h3>
          <img src={imageUrl} alt="QR Code"  width="150px" height="150px"/>
        </div>
      )}
    </Container>
  );
}

export default CreateItem;
