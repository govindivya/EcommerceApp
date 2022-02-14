import {
  ADD_TO_CART_FAIL,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  GET_CART_ITEMS_FAIL,
  GET_CART_ITEMS_REQUEST,
  GET_CART_ITEMS_SUCCESS,
  DELETE_FROM_CART_REQUEST,
  DELETE_FROM_CART_SUCCESS,
  DELETE_FROM_CART_FAIL,
  DELETE_ALL_FROM_CART_REQUEST,
  DELETE_ALL_FROM_CART_SUCCESS,
  DELETE_ALL_FROM_CART_FAIL,
} from "../constants/cartConstant";

import axios from "axios";

//add to cart

export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(
      `/api/v1/cart/save`,
      {
        product: id,
        quantity,
      },
      config
    );
    dispatch({ type: ADD_TO_CART_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: ADD_TO_CART_FAIL, payload: error.response.data.message });
  }
};

export const getAllCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_CART_ITEMS_REQUEST });
    const { data } = await axios.get(`/api/v1/cart/get`);
    dispatch({ type: GET_CART_ITEMS_SUCCESS, payload: data.cartItems });
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_CART_ITEMS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteCartItem = (product) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_FROM_CART_REQUEST });
    const { data } = await axios.delete(`/api/v1/cart/delete/${product}`);
    dispatch({ type: DELETE_FROM_CART_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_FROM_CART_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteAllCartItem = () => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ALL_FROM_CART_REQUEST });
    const { data } = await axios.delete(`/api/v1/cart/deleteall`);
    dispatch({ type: DELETE_ALL_FROM_CART_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_ALL_FROM_CART_FAIL,
      payload: error.response.data.message,
    });
  }
};

//

