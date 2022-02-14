import React, { Fragment, useState, useEffect } from "react";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { RemoveShoppingCart } from "@mui/icons-material";
import {
  addItemsToCart,
  deleteCartItem,
  getAllCart,
} from "../../actions/cartAction";
import { useAlert } from "react-alert";
const Cart = () => {
  //
  //
  const dispatch = useDispatch();
  const { cartItems, error, loading, success } = useSelector(
    (state) => state.cart
  );
  var totalItems = cartItems ? Array.from(cartItems).length : 0;
  var totalAmount = 0;
  if (cartItems) {
    cartItems.forEach((item) => {
      totalAmount += Number(item.price) * Number(item.quantity);
    });
  }
  const alert = useAlert();
  //
  //
  const deleteCartItems = async (id) => {
    dispatch(deleteCartItem(id));
    dispatch(getAllCart());
  };
  //
  //
  const increaseQuantity = async (id, quantity, stock) => {
    if (stock <= quantity) {
      return;
    } else {
      dispatch(addItemsToCart(id, quantity + 1));
      dispatch(getAllCart());
    }
  };
  //
  //
  const decreaseQuantity = async (id, quantity) => {
    if (quantity <= 1) {
      await deleteCartItems(id);
    } else {
       dispatch(addItemsToCart(id, quantity - 1));
    }
    dispatch(getAllCart());
  };
  //
  const navigate = useNavigate();
  const checkOutHandler = () => {
    navigate("/shipping");
  };
  //
  //
  useEffect(() => {
    if (error) {
      alert.error(error);
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    dispatch(getAllCart());
  }, [navigate,error,alert,dispatch]);
  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MetaData title={"Cart"} />
      <div className="cartPage">
        <div className="cardContainer">
          {cartItems &&
            cartItems.map((item, index) => (
              <div key={index}>
                <CartItemCard
                  item={item}
                  deleteCartItems={deleteCartItems}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                />
              </div>
            ))}

          {(Number(totalItems) === 0 || totalItems === undefined) && (
            <div className="noItemFound">
              <h1>EMPTY</h1>
              <h1>
                <RemoveShoppingCart
                  style={{ fontSize: "5vmax", padding: "1vmax", color: "pink" }}
                />
              </h1>
              <h1>
                <Link to="/products">ADD ITEMS </Link>
              </h1>
            </div>
          )}
        </div>
        {totalAmount != 0 && (
          <div className="cartGrossTotal">
            <h5>Total Amount : {`₹ ${totalAmount}`}</h5>
            <button onClick={checkOutHandler}>Check Out </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Cart;
