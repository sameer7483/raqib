import axios from 'axios';

const BASE_URL = 'https://l7hzx92wwi.execute-api.us-east-1.amazonaws.com';

export const createItem = async (orderId, productId, seqNum) => {
  const newItem = { orderId, productId, seqNum};
  const response = await axios.post(`${BASE_URL}/default/raqib-create-document`, newItem);
  return response;
};

export const updateStatus = async (id, status) => {
  const updatedItem = { id, status };
  await axios.post(`${BASE_URL}/default/raqib-update-status`, updatedItem);
};

export const searchItem = async (orderId, productId, seqNum) => {
  const item = {orderId, productId, seqNum}
  const response = await axios.post(`${BASE_URL}/default/raqib-search-documents`, item);
  return response.data;
};
