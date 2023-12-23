import React, { createContext, useContext, useReducer } from 'react';

const OrderContext = createContext();

const initialState = {
  orderedItems: [],
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_ORDER':
      return {
        ...state,
        orderedItems: [...state.orderedItems, action.payload],
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        orderedItems: state.orderedItems.map((item, index) =>
          index === action.payload.index
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'REMOVE_FROM_ORDER':
      return {
        ...state,
        orderedItems: state.orderedItems.filter((item, index) => index !== action.payload),
      };
    case 'RESET_ORDER':
    return {
        ...state,
        orderedItems: [],
    };
    default:
      return state;
  }
};

const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>{children}</OrderContext.Provider>
  );
};

const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

export { OrderProvider, useOrderContext };
