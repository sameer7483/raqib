import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus } from '../actions/itemActions';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const statusMap = {
  0: 'DEFAULT',
  1: 'ON_LOOM',
  2: 'OFF_LOOM',
  3: 'WASHING',
  4: 'LATEXING',
  5: 'FINISHING',
  6: 'PACKING',
  7: 'SHIPPED',
  8: 'DELIVERED',
};

const FormContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
  borderRadius: theme.shape.borderRadius,
}));

const FormItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(1),
}));

const Label = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(undefined);
  const { slug } = useParams();
  const userRole = sessionStorage.getItem('role');
  useEffect(() => {
    const fetchProduct = async () => {
      
      const BASE_URL = 'https://l7hzx92wwi.execute-api.us-east-1.amazonaws.com';
      const response = await axios.get(`${BASE_URL}/default/raqib-get-document?id=${slug}`);
      setProduct(response.data);
    };
    fetchProduct();
  }, [slug]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = [product.orderId, product.productId, product.seqNum].join('-');
    dispatch(updateStatus(id, product.status));
  };

  const handleStatusChange = (e) => {
    const newStatus = parseInt(e.target.value);
    setProduct((prevProduct) => ({
      ...prevProduct,
      status: newStatus,
    }));
  };

  const isRoleWritable = userRole === 'WRITER' || userRole === 'ADMIN';

  return (
    product && (
      <FormContainer maxWidth="sm">
        <Typography variant="h2" align="center" gutterBottom>
          Product Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormItem>
            <Label htmlFor="orderId">Order ID:</Label>
            <Typography>{product.orderId}</Typography>
          </FormItem>
          <FormItem>
            <Label htmlFor="productId">Product ID:</Label>
            <Typography>{product.productId}</Typography>
          </FormItem>
          <FormItem>
            <Label htmlFor="seqNum">Sequence Number:</Label>
            <Typography>{product.seqNum}</Typography>
          </FormItem>
          <FormItem>
            <Label htmlFor="status">Status:</Label>
            <FormControl>
              <Select
                labelId="status-label"
                id="status"
                value={product.status}
                onChange={handleStatusChange}
                autoWidth
                disabled={!isRoleWritable}
              >
                {Object.keys(statusMap).map((key) => (
                  <MenuItem key={key} value={parseInt(key)}>
                    {statusMap[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormItem>
          {isRoleWritable && ( // Show the submit button only if the user's role is "WRITER" or "ADMIN"
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          )}
        </form>
      </FormContainer>
    )
  );
  
};

export default ProductDetails;
