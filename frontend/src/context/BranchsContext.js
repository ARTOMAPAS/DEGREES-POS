import { createContext, useReducer } from "react";

export const BranchsContext = createContext();

export const branchsReducer = (state, action) => {
  switch (action.type) {
    case "SET_BRANCHS":
      return {
        branchs: action.payload,
      };
    case "CREATE_BRANCH":
      return {
        branchs: [action.payload, ...state.branchs],
      };
    case "DELETE_BRANCH":
      return {
        branchs: state.branchs.filter(b => b._id !== action.payload._id),
      };
      case "UPDATE_BRANCH":
        return {
          branchs: state.branchs.map(branch => {
            if (branch._id === action.payload._id) {
              return action.payload; // Replace the existing branch with the updated one
            }
            return branch;
          }),
        };
    default:
      return state;
  }
};

export const BranchsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(branchsReducer, {
    branchs: null,
  });

  return (
    <BranchsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BranchsContext.Provider>
  );
};

