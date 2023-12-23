import { createContext , useReducer } from "react";

export const OrdersContext = createContext()

export const ordersReducer = (state, action) => {
    switch(action.type){
        case 'SET_ORDERS':
            return{
                orders: action.payload
            }
        case 'CREATE_ORDER':
            return{
                orders: [action.payload, ...state.orders]
            }
        case 'DELETE_ORDER':
            return{
                orders: state.orders.filter(u => u._id !== action.payload._id)
            }
        case 'UPDATE_ORDER':
            return {
                orders: state.orders.map((order) =>
                  order._id === action.payload._id ? action.payload : order
                )
              };
        default:
            return state
    }
}

export const OrdersContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(ordersReducer, {
        orders: null
    })

    // dispatch({type: 'SET_ORDERS', payload: [{},{}]})

    return (
        <OrdersContext.Provider value={{...state, dispatch}}>
            {children}
        </OrdersContext.Provider>
    )
}
