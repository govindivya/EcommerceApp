import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import SideBar from "./Sidebar";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { Button } from "@mui/material";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";
import "./ProcessOrder.css";
import { useParams } from "react-router-dom";

const ProcessOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const {
    error: updateError,
    isUpdated,
    isDeleted,
  } = useSelector((state) => state.adminOrder);

  const navigate = useNavigate();
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const [status, setStatus] = useState("");

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    if (status === "") {
      alert.error("This is invalid process");
      return;
    }
    const myForm = new FormData();

    myForm.set("status", status);
    dispatch(updateOrder(orderId, myForm));
  };

  useEffect(() => {
    if (error) {
      if (error === "MONGOERROR") {
        alert.show("This is not a valid resource");
        navigate("/");
      } else {
        alert.error(error);
        dispatch(clearErrors());
      }
    }
    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
      if(updateError==='MONGOERROR'){
        navigate("/")
      }
    }
    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
      navigate("/admin/orders");
    }

    dispatch(getOrderDetails(orderId));
  }, [dispatch, alert, error, orderId, isUpdated, updateError,navigate]);

  return (
    <Fragment>
      <MetaData title="Process Order" />
      {loading && loading === true ? (
        <Loader />
      ) : (
        <div className="processOrder">
          <SideBar />
          <div className="processOrderContainer">
            <div className="processBox1">
              <h1>Products Details</h1>
              <div>
                <p>Id</p>
                <p>{order && order._id}</p>
              </div>
              <div>
                <p>Date</p>
                <p>
                  {order &&
                    order.createdAt &&
                    order.createdAt.toString().substring(0, 10)}
                </p>
              </div>
              <div>
                <p>Order Status</p>
                <p>{order && order.orderStatus}</p>
              </div>
              <div>
                <p>Total Items</p>
                <p>
                  {order &&
                    order.orderItems &&
                    Array.from(order.orderItems).length}
                </p>
              </div>
              <div>
                <p>Payment Status</p>
                <p
                  style={{
                    color: `${
                      order &&
                      order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "green"
                        : "rgba(0,0,0,0.73)"
                    }`,
                  }}
                >
                  {order && order.paymentInfo && order.paymentInfo.status}
                </p>
              </div>
              <div>
                <h1>Shipping Details</h1>
              </div>
              <div>
                <p>Adress</p>
                <p>
                  {order && order.shippingInfo && order.shippingInfo.address}
                </p>
              </div>
              <div>
                <p>City</p>
                <p>{order && order.shippingInfo && order.shippingInfo.city}</p>
              </div>{" "}
              <div>
                <p>State</p>
                <p>{order && order.shippingInfo && order.shippingInfo.state}</p>
              </div>
              <div>
                <p>Country</p>
                <p>
                  {order && order.shippingInfo && order.shippingInfo.country}
                </p>
              </div>
              <div>
                <p>Phone</p>
                <p>
                  {order && order.shippingInfo && order.shippingInfo.phoneNo}
                </p>
              </div>
            </div>
            <div className="processBox2">
              <select onChange={(e) => setStatus(e.target.value)}>
                <option value="">----Change----</option>
                {order && order.orderStatus != "delivered" && (
                  <option value="processing">Processing</option>
                )}
                {order && order.orderStatus != "delivered" && (
                  <option value="shipped">Shipped</option>
                )}
                <option value="delivered">Delivered</option>
              </select>
              <Button onClick={handleUpdateOrder}>
                {status === "" ? "Processing" : status}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ProcessOrder;
