import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  CLEAR_CART,
} from "./actionTypes";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id,
      );

      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = state.cartItems.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: item.quantity + (action.payload.quantity || 1),
                totalPrice:
                  item.price * (item.quantity + (action.payload.quantity || 1)),
              }
            : item,
        );
      } else {
        const newItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1,
          totalPrice: action.payload.price * (action.payload.quantity || 1),
        };
        updatedCartItems = [...state.cartItems, newItem];
      }

      const totalQuantity = updatedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      const totalAmount = updatedCartItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...state,
        cartItems: updatedCartItems,
        totalQuantity,
        totalAmount,
      };
    }

    case REMOVE_FROM_CART: {
      const updatedCartItems = state.cartItems.filter(
        (item) => item.id !== action.payload,
      );
      const totalQuantity = updatedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      const totalAmount = updatedCartItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...state,
        cartItems: updatedCartItems,
        totalQuantity,
        totalAmount,
      };
    }

    case INCREASE_QUANTITY: {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === action.payload
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: item.price * (item.quantity + 1),
            }
          : item,
      );
      const totalQuantity = updatedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      const totalAmount = updatedCartItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...state,
        cartItems: updatedCartItems,
        totalQuantity,
        totalAmount,
      };
    }

    case DECREASE_QUANTITY: {
      const updatedCartItems = state.cartItems
        .map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity - 1,
                totalPrice: item.price * (item.quantity - 1),
              }
            : item,
        )
        .filter((item) => item.quantity > 0);

      const totalQuantity = updatedCartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      const totalAmount = updatedCartItems.reduce(
        (total, item) => total + item.totalPrice,
        0,
      );

      return {
        ...state,
        cartItems: updatedCartItems,
        totalQuantity,
        totalAmount,
      };
    }

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        totalQuantity: 0,
        totalAmount: 0,
      };

    default:
      return state;
  }
};

export default cartReducer;
