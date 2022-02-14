import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  UPDATE_ORDER_REQUEST,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  UPDATE_ORDER_RESET,
  DELETE_ORDER_REQUEST,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  DELETE_ORDER_RESET,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
  CANCEL_MY_ORDERS_REQUEST,
  CANCEL_MY_ORDERS_SUCCESS,
  CANCEL_MY_ORDERS_FAIL,
} from "../constants/orderConstants";

export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
    case CANCEL_MY_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CANCEL_MY_ORDERS_SUCCESS:
      return {
        loading: false,
        isCancelled: action.payload.success,
        message: action.payload.message,
      };
    case CREATE_ORDER_SUCCESS:
      return {
        loading: false,
        isCreated:true,
        order: action.payload,
      };

    case CREATE_ORDER_FAIL:
    case CANCEL_MY_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return {
        loading: true,
      };

    case MY_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case MY_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const allOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_ORDERS_REQUEST:
      return {
        loading: true,
      };

    case ALL_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        ordersCount:action.payload.ordersCount
      };

    case ALL_ORDERS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const adminOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ORDER_REQUEST:
    case DELETE_ORDER_REQUEST:
      return {
        loading: true,
      };

    case UPDATE_ORDER_SUCCESS:
      return {
        loading: false,
        isUpdated: action.payload,
      };
    case DELETE_ORDER_SUCCESS:
      return {
        loading: false,
        isDeleted: action.payload,
      };
    case UPDATE_ORDER_FAIL:
    case DELETE_ORDER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case UPDATE_ORDER_RESET:
      return {
        isUpdated: false,
      };

    case DELETE_ORDER_RESET:
      return {
        isDeleted: false,
      };
    case CLEAR_ERRORS:
      return {
        error: null,
      };

    default:
      return state;
  }
};

export const orderDetailsReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        loading: true,
      };

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
