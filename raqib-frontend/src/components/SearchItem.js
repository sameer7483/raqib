import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchItem } from '../actions/itemActions';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, TextField, Typography } from '@mui/material';
import { Box,TableContainer,  Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { styled } from '@mui/system';
import { TableSortLabel } from '@mui/material'; // Add this import

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

function SearchItem() {
  const dispatch = useDispatch();
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [seqNum, setSeqNum] = useState('');
  const itemList = useSelector((state) => state.item.itemList);  
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');

  const ItemInfoContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
  }));
  
  const Heading = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
  }));
  
  const TablePaginationContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  }));

  const ITEMS_PER_PAGE = 5;
  let displayedItems = undefined;
  const sortedItems = itemList ? [...itemList].sort((a, b) => {
    if (order === 'asc') {
      return parseInt(a.seqNum) - (parseInt(b.seqNum));
    } else {
      return parseInt(b.seqNum) - (parseInt(a.seqNum));
    }
  }) : [];

  displayedItems = sortedItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
   
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };  

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(searchItem(orderId, productId, seqNum));
    setOrderId('');
    setProductId('');
    setSeqNum('');
  };

  return (
    <Container maxWidth="sm">
      <h2>Search Item</h2>
      <form onSubmit={handleSubmit}>
      <TextField
          label="Order ID"
          variant="outlined"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Product ID"
          variant="outlined"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Sequence Number"
          variant="outlined"
          value={seqNum}
          onChange={(e) => setSeqNum(e.target.value)}
          fullWidth
          margin="normal"       
        />
        <Button variant="contained" color="primary" type="submit">
          Search
        </Button>
      </form>
      {itemList && itemList.length > 0 && (
    <ItemInfoContainer>
    <Heading variant="h3">
      Item Information
    </Heading>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Order ID
            </TableCell>
            <TableCell>
              Product ID
            </TableCell>
            <TableCell>
            <TableSortLabel
                      active={orderBy === 'seqNum'}
                      direction={orderBy === 'seqNum' ? order : 'asc'}
                      onClick={() => handleSort('seqNum')}
                    >
                      Sequence Number
                    </TableSortLabel>
            </TableCell>
            <TableCell>
              Status
            </TableCell>
            <TableCell>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.orderId}</TableCell>
              <TableCell>{item.productId}</TableCell>
              <TableCell>{item.seqNum}</TableCell>
              <TableCell>{statusMap[item.status]}</TableCell>
              <TableCell>
              <Button
  component={RouterLink}
  to={`/products/${item.id}`}
  variant="contained"
  color="primary"
>
  Update
</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePaginationContainer>
      <TablePagination
        component="div"
        count={itemList.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={ITEMS_PER_PAGE}
        rowsPerPageOptions={[]}
      />
    </TablePaginationContainer>
  </ItemInfoContainer>
)}
    </Container>
  );
}

export default SearchItem;
