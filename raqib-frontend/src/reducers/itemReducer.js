const initialState = {
    itemInfo: null,
  };
  
  const itemReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SEARCH_ITEM_SUCCESS':
        return {
          ...state,
          itemList: action.payload,
        };
      case 'CREATE_ITEM_SUCCESS':
        return {
          ...state,
          imageUrl: action.payload,
        };
      case 'RESET':
        return {
          ...state,
          imageUrl: '',
          itemList: []
        };                   
      default:
        return state;
    }
  };
  
  export default itemReducer;
  