import { createContext, useReducer } from "react";

export const OrderContext = createContext();

const orderData = JSON.parse(localStorage.getItem("order_data"));

let initialState = orderData
  ? {
      orderID: orderData.order_id,
      items: orderData.items,
    }
  : {
      orderID: "",
      items: [],
    };

const orderReducer = (state, action) => {
  switch (action.type) {
    case "add_item":
      return {
        ...state,
        items: state.items.includes(action.payload)
          ? state.items
          : [...state.items, action.payload],
      };

    case "remove_item":
      return {
        ...state,
        items: state.items.filter((item) => item !== action.payload),
      };

    case "add_order": {
      return {
        ...state,
        orderID: action.payload,
      };
    }

    case "order_success": {
      return {
        ...state,
        orderID: "",
        items: [],
      };
    }

    default:
      return state;
  }
};

function OrderProvider(props) {
  let [state, dispatch] = useReducer(orderReducer, initialState);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {props.children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;

/*
  if id exists -> increase count of id
  else add id with count 1
*/
