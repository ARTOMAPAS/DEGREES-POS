import { createContext, useReducer } from "react";

export const CategoriesContext = createContext();

export const categoriesReducer = (state, action) => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return {
        categories: action.payload,
      };
    case "CREATE_CATEGORY":
      return {
        categories: [action.payload, ...state.categories],
      };
    case "DELETE_CATEGORY":
      return {
        categories: state.categories.filter(b => b._id !== action.payload._id),
      };
      case "UPDATE_CATEGORY":
        return {
            categories: state.categories.map(category =>
                category._id === action.payload._id ? action.payload : category
            )
        };
    default:
      return state;
  }
};

export const CategoriesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoriesReducer, {
    categories: null,
  });

  return (
    <CategoriesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  );
};

