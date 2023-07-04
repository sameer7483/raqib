import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem } from '../actions/itemActions';
import { Button, Container, TextField, Typography } from '@mui/material';

function CreateItem() {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [seqNum, setSeqNum] = useState('');
  const [isSeqNumValid, setIsSeqNumValid] = useState(true);
  const isFormValid = orderId && productId && seqNum && isSeqNumValid;
  const imageUrl = useSelector((state) => state.item.imageUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createItem(orderId, productId, seqNum)); 
    setOrderId('');
    setProductId('');
    setSeqNum('');
  };

  const handleSeqNumChange = (e) => {
    const value = e.target.value;
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
          onChange={(e) => setOrderId(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Product ID"
          variant="outlined"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          fullWidth
          margin="normal"
          required
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
          <h3>QR Code for: {imageUrl.split("/").pop()}</h3>
          <img src={imageUrl} alt="QR Code"  width="150px" height="150px"/>
        </div>
      )}
    </Container>
  );
}

export default CreateItem;
