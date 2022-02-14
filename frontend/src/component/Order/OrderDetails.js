import React, { Fragment, useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { getOrderDetails, clearErrors } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
 const navigate=useNavigate()
  useEffect(() => {
    if (error) {
      if(error==="MONGOERROR"){
        alert.show("This is not a valid resource address")
        navigate("/")   
      }
      else{
        dispatch(clearErrors());
        alert.error(error)
      }
      
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, alert, error, id]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Order Details" />
          <div className="orderDetailsPage">
            {order && order.shippingInfo && (
              <div>
                <div className="orderProductContainer">
                  <h1>Ordered Products</h1>
                  <div className="orderProductHeader">
                    <p>Product</p>
                    <p>Price</p>
                    <p>Quantity</p>
                  </div>
                  {order &&
                    order.orderItems.map((item, index) => (
                      <div key={index} className="orderProductBox">
                        <div className="orderImg">
                          <p>{item.name}</p>
                          <Link to={`/product/${item.product}`}>
                            <img src={item.image} />
                          </Link>
                        </div>
                        <p>₹{item.price}</p>
                        <p>{item.quantity}</p>
                      </div>
                    ))}
                </div>
                <h3>Order Details</h3>
                <p>
                  <span>Order Status</span> <span>{order.orderStatus}</span>
                </p>
                <p>
                  <span>Ordered on</span>{" "}
                  <span>{order.createdAt.toString().substring(0, 10)}</span>
                </p>
                <div className="orderDetailsPrices">
                  <h5>Cost Breakup</h5>
                  <p>
                    <span>Product Cost</span> <span>₹{order.itemsPrice}</span>{" "}
                  </p>
                  <p>
                    <span>Tax Charge</span> <span>₹{order.taxPrice}</span>{" "}
                  </p>
                  <p>
                    <span>Shipping Charge</span>{" "}
                    <span>₹{order.shippingPrice}</span>{" "}
                  </p>
                  <p>
                    <span>Total Cost</span> <span>₹{order.totalPrice}</span>{" "}
                  </p>
                </div>
                <div>
                  <h5>Payment Details</h5>
                  {order.paymentInfo.status === "succeeded" ? (
                    <p>
                      <span>Payment Status</span> <span>Done</span>
                    </p>
                  ) : (
                    <p>
                      <span>Payment Status</span> <span>Pay on delivery </span>
                    </p>
                  )}
                  {order.paymentInfo.status === "succeeded" ? (
                    <p>
                      {" "}
                      <span>Paid At Date</span>{" "}
                      <span>
                        {" "}
                        {"   " +
                          order.paidAt.toString().substring(0, 10) +
                          "   Time  " +
                          order.paidAt.toString().substring(11, 19)}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <h5>Shipping Details</h5>
                  <p>
                    <span>Name </span> <span>{order.user.name}</span>
                  </p>
                  <p>
                    <span>Phone</span>{" "}
                    <span> {order.shippingInfo.phoneNo}</span>{" "}
                  </p>
                  <p>
                    <span>Address</span>{" "}
                    <span>{order.shippingInfo.address}</span>
                  </p>
                  <p>
                    <span>City</span> <span>{order.shippingInfo.city}</span>
                  </p>
                  <p>
                    <span>State</span> <span>{order.shippingInfo.state}</span>
                  </p>
                  <p>
                    <span>Pincode </span>
                    <span>{order.shippingInfo.pincode}</span>
                  </p>
                  <p>
                    <span>Country</span>{" "}
                    <span>{order.shippingInfo.country}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;

/*



/*


<div className="orderProductContainer">
                  <h1>Ordered Products</h1>
                  <div className="orderProductHeader">
                    <p>Product</p>
                    <p>Price</p>
                    <p>Quantity</p>
                  </div>
                  {order &&
                    order.orderItems.map((item, index) => (
                      <div key={index} className="orderProductBox">
                        <div className="orderImg">
                          <p>{item.name}</p>
                          <Link to={`/product/${item.product}`}>
                          <img src={item.image} />
                          </Link>
                        </div>
                        <p>{item.price}</p>
                        <p>{item.quantity}</p>
                      </div>
                    ))}
                </div>
 */
