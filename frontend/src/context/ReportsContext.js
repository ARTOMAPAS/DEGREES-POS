import { createContext , useReducer } from "react";

export const ReportsContext = createContext()

export const reportsReducer = (state, action) => {
    switch(action.type){
        case 'SET_REPORTS':
            return{
                reports: action.payload
            }
        case 'CREATE_REPORT':
            return{
                reports: [action.payload, ...state.reports]
            }
        case 'DELETE_REPORT':
            return{
                reports: state.reports.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_REPORT':
            return {
                reports: state.reports.map((report) =>
                  report._id === action.payload._id ? action.payload : report
                )
              };
        default:
            return state
    }
}

export const ReportsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reportsReducer, {
        reports: null
    })

    return (
        <ReportsContext.Provider value={{...state, dispatch}}>
            {children}
        </ReportsContext.Provider>
    )
}
