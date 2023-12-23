import { createContext, useReducer } from "react";

export const ItemTypesContext = createContext();

export const itemTypesReducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMTYPES":
      return {
        itemTypes: action.payload,
      };
    case "CREATE_ITEMTYPE":
      return {
        itemTypes: [action.payload, ...state.itemTypes],
      };
    case "DELETE_ITEMTYPE":
      return {
        itemTypes: state.itemTypes.filter(it => it._id !== action.payload._id),
      };
    case "UPDATE_ITEMTYPE":
      return {
        itemTypes: state.itemTypes.map((itemType) =>
          itemType._id === action.payload._id ? action.payload : itemType
        )
      };
    default:
      return state;
  }
};

export const ItemTypesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itemTypesReducer, {
    itemTypes: null,
  });

  return (
    <ItemTypesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ItemTypesContext.Provider>
  );
};

