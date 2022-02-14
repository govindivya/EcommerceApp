import React, { Fragment, useState, useEffect } from "react";
import CheckoutStep from "./CheckoutStep";
import "./ConfirmOrder.css";
import { useSelector, useDispatch } from "react-redux";
import Metadata from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import { getAllCart } from "../../actions/cartAction";
import { useAlert } from "react-alert";

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { cartItems, success, error } = useSelector((state) => state.cart);

  var totalAmount = 0;
  if (cartItems) {
    cartItems.forEach((item) => {
      totalAmount += Number(item.price) * Number(item.quantity);
    });
  }
  // const tax = Math.floor((totalAmount * 18) / 100);

  // const shippingCharges = totalAmount > 2000 ? 0 : 200;
  const shippingCharges =0;
  const tax = 0;

  totalAmount += tax + shippingCharges;
  // extracting shipping information

  const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  // extracting user information

  // const userDetails = useSelector((state) => state.user);

  // const user = userDetails ? userDetails.user : undefined;

  useEffect(() => {
    if (error) {
      alert.error(error);
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (success && cartItems) {
      if (Array.from(cartItems).length === 0) {
        alert.show("There is not item to checkout");
        navigate("/cart");
      }
    }
  }, [cartItems, alert, error,success,navigate]);
  // payment

  const proceedToPayment = () => {
    const subtotal = totalAmount - tax - shippingCharges;
    const data = {
      subtotal,
      tax,
      shippingCharges,
      totalPrice: totalAmount,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/payment/process");
  };
  //
  //
  useEffect(() => {
    if (!shippingInfo) {
      alert.error("Please complete shipping details ");
      navigate("/shipping");
    }
    dispatch(getAllCart());
  }, []);

  return (
    <Fragment>
      <Metadata title={"Confirm Order"} />
      <CheckoutStep activeStep={1} />
      <div className="confirmOrderPage">
        <h1>Your Cart Items </h1>
        <div className="productBoxContainer">
          {cartItems &&
            cartItems.map((item, index) => (
              <div className="productBox" key={index}>
                <Link to={`/product/${item.product}`}>
                  <img src={item.image} />
                </Link>
                <div>
                  <p>{item.name}</p>
                  <p>Price : ₹{item.price}</p>
                  <p>Qunatity : {item.quantity}</p>
                  <p
                    style={{
                      padding: "0.5vmax",
                      borderBottom: "1.5px solid gray",
                    }}
                  >
                    subtotal : ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          <div className="totalPrice">
            <div>
              <p style={{ color: "tomato", fontSize: "1.4vmax" }}>
                Shipping Details
              </p>
              <p>Contact no :{shippingInfo.phoneNo}</p>
              <p>pincode :{shippingInfo.pincode}</p>
              <p>address :{shippingInfo.address}</p>
              <p>city :{shippingInfo.city}</p>
              <p>state :{shippingInfo.state}</p>
              <p style={{ fontSize: "1.2vmax", color: "rgb(78, 78, 78)" }}>
                country :{shippingInfo.country}
              </p>
              <Link to="/shipping">Modify</Link>
            </div>
            <div>
              <p>Total Cost : {totalAmount - tax - shippingCharges}</p>
              <p>GST : ₹{tax}</p>
              <p>shipping Charge : ₹{shippingCharges} </p>
              <p>Grand Total : ₹{totalAmount}</p>
            </div>
          </div>
        </div>
        <button onClick={proceedToPayment}>Proceed To Payment</button>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
