import { createItem as createItemService, updateStatus as updateStatusService, searchItem as searchItemService } from '../services/ItemService';
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

export const createItem = (orderId, productId, seqNum) => async (dispatch) => {
  try {
    const response = await createItemService(orderId, productId, seqNum);
    // Dispatch success action if necessary
    const id = [orderId, productId, seqNum].join('-');
    const key =[orderId, productId, seqNum].join('/');
    const imageUrl = `https://raqib-storage.s3.amazonaws.com/${key}`;
    if (response && response.data && response.data.error === 'Item already exists') {
      // Item already exists, show alert or perform desired action
      alert(`Item already exists: ${id}`);
    }
    dispatch({ type: 'CREATE_ITEM_SUCCESS', payload: imageUrl });
    
  } catch (error) {
    console.error('Error creating item:', error);
    alert(`Error creating item : ${error}`);
  }
};

export const updateStatus = (id, status) => async (dispatch) => {
  try {
    await updateStatusService(id, status);
    // Dispatch success action if necessary
    alert(`Updated the status of item ${id} to: ${statusMap[status]}`);
  } catch (error) {
    console.error('Error updating status:', error);
    alert(`Error while updating the status of item ${id} to: ${statusMap[status]}`);
    // Dispatch error action if necessary
  }
};

export const searchItem = (orderId, productId, seqNum) => async (dispatch) => {
  try {
    const itemInfo = await searchItemService(orderId, productId, seqNum);
    console.log(itemInfo);
    if(itemInfo.length == 0)
      alert("No item found for the given query");
    dispatch({ type: 'SEARCH_ITEM_SUCCESS', payload: itemInfo });
  } catch (error) {
    console.error('Error fetching item info:', error);
    alert(`Error fetching item info: ${error}`);
  }
};

// export const logout = () => async (dispatch) => {
//   try {
//     dispatch({ type: 'LOGOUT'});
//   } catch (error) {
//     console.error('Error while logging out :', error);
//   }
// };
