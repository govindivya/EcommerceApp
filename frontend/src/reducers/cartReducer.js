import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  DELETE_FROM_CART_REQUEST,
  DELETE_FROM_CART_SUCCESS,
  DELETE_FROM_CART_FAIL,
  GET_CART_ITEMS_REQUEST,
  GET_CART_ITEMS_SUCCESS,
  GET_CART_ITEMS_FAIL,
  DELETE_ALL_FROM_CART_REQUEST,
  DELETE_ALL_FROM_CART_SUCCESS,
  DELETE_ALL_FROM_CART_FAIL,
} from "../constants/cartConstant";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case DELETE_FROM_CART_REQUEST:
    case GET_CART_ITEMS_REQUEST:
    case DELETE_ALL_FROM_CART_REQUEST:
      return {
        loading: true,
        cartItems: [],
      };
    case GET_CART_ITEMS_SUCCESS:
      return {
        success: true,
        loading: false,
        cartItems: action.payload,
      };
    case ADD_TO_CART_SUCCESS:
    case DELETE_FROM_CART_SUCCESS:
    case DELETE_ALL_FROM_CART_SUCCESS:
      return {
        loading: false,
        success: true,
        addOrDelete:true,
      };
    case GET_CART_ITEMS_FAIL:
      return {
        loading: false,
        error: action.payload,
        cartItems: [],
      };
    case ADD_TO_CART_FAIL:
    case DELETE_FROM_CART_FAIL:
    case DELETE_ALL_FROM_CART_FAIL:
      return {
        loading: false,
        error: action.payload,
        cartItems: state.cartItems,
      };

    default:
      return state;
  }
};