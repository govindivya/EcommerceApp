import React, { Fragment, useEffect, useRef, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutStep";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";
import { deleteAllCartItem, getAllCart } from "../../actions/cartAction";
import { clearErrors, createOrder } from "../../actions/orderAction";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";

import axios from "axios";
import "./payment.css";
import { useNavigate } from "react-router-dom";
import { VpnKey, Event, CreditCard } from "@mui/icons-material";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  // shipping and cartItems
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();

  const { cartItems, error } = useSelector((state) => state.cart);
  const { error: orderError, isCreated } = useSelector(
    (state) => state.newOrder
  );

  const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));

  // extracting user information

  const { user, error: userError } = useSelector((state) => state.user);

  // handling errros
  useEffect(() => {
    if (error) {
      alert.error(error);
      if(error==='MONGOERROR'){
        navigate("/")
      }
      // dispatch(clearErrors())
    }
    if (userError) {
      alert.error(userError);
      if(userError==='MONGOERROR'){
        navigate("/")
      }
      console.log("ErroFirst", orderError);
      // dispatch(clearErrors())
    }
    if (!shippingInfo) {
      alert.error("Please complete previous steps");
      navigate("/shipping");
    }
    if (!orderInfo) {
      alert.error("Please complete previous steps");
      navigate("/orders");
    }
    if (orderError) {
      alert.error(orderError);
      if(orderError==='MONGOERROR'){
        navigate("/")
      }
    }
    if (isCreated && orderInfo) {
      sessionStorage.removeItem("orderInfo");
      alert.success("The order is succeeded");
      navigate("/orders");
    }
  }, [
    error,
    alert,
    userError,
    shippingInfo,
    orderInfo,
    navigate,
    dispatch,
    isCreated,
    orderError,
  ]);

  useEffect(() => {
    dispatch(getAllCart());
  }, []);
  //
  useEffect(() => {
    if (orderError) {
      alert.error(orderError);
      dispatch(clearErrors());
      if(orderError==='MONGOERROR'){
        navigate("/")
      }
    }
  }, [dispatch, alert, orderError,navigate]);

  //
  const payBtn = useRef(null);
  const stripe = useStripe();
  const elements = useElements();
  //
  const order = {
    shippingInfo,
    orderItems: cartItems ? cartItems : [],
    itemsPrice: orderInfo ? orderInfo.subtotal : 0,
    taxPrice: orderInfo ? orderInfo.tax : 0,
    shippingPrice: orderInfo ? orderInfo.shippingCharges : 0,
    totalPrice: orderInfo ? orderInfo.totalPrice : 0,
  };
  //
  const paymentData = {
    amount: orderInfo ? orderInfo.totalPrice * 100 : 0,
  };
  //
  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;
    payBtn.current.value = "Processing";
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );
      const client_secret = data.client_secret;
      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
      if (result.error) {
        alert.error(result.error.code.toString());
        payBtn.current.disabled = false;
        payBtn.current.value=`Pay  ₹ ${orderInfo && orderInfo.totalPrice}`
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          order.paidAt = Date.now();
          dispatch(createOrder(order));
          dispatch(deleteAllCartItem());
        } else {
          alert.error(
            "There is some issue with payment gateway. Please try after sometime"
          );
        }
      }
    } catch (error) {
      alert.error(error);
    }
  };
  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCard />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <Event />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKey />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            ref={payBtn}
            value={`Pay  ₹ ${orderInfo && orderInfo.totalPrice}`}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
