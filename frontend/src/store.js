import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  newReviewReducer,
  productDetailsReducer,
  productReducer,
  newProductReducer
} from "./reducers/productReducer";
import {
  forgotPasswordReducer,
  profileReducer,
  userReducer,
  usersReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { adminOrderReducer, allOrdersReducer, myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./reducers/orderReducer";

const reducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: userReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder:newOrderReducer,
  myOrders:myOrdersReducer,
  orderDetails:orderDetailsReducer,
  review : newReviewReducer,
  newProduct:newProductReducer,
  allOrder:allOrdersReducer,
  adminUser:usersReducer,
  adminOrder:adminOrderReducer 
});
let initialState={}

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
