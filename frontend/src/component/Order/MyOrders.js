import React, { Fragment, useEffect } from "react";
import "./myOrders.css";
import { useSelector, useDispatch } from "react-redux";
import {
  cancelMyOrder,
  clearErrors,
  myOrders,
} from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Delete from "@mui/icons-material/Delete";

const MyOrders = () => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { loading, error, orders } = useSelector((state) => state.myOrders);
  const { isCancelled, error: cancelledError ,message} = useSelector(
    (state) => state.newOrder
  );
  const { user, error: userError } = useSelector((state) => state.user);

  const handleDelete = (id) => {
    const deleteIt = window.confirm("Are you sure to delete ", id);
    if (deleteIt) {
      dispatch(cancelMyOrder(id));
    }
  };
  const navigate=useNavigate()
  useEffect(() => {
    if (error) {
      alert.error(error || userError);
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    if (userError) {
      alert.error(userError);
      dispatch(clearErrors());
      if(userError==='MONGOERROR'){
        navigate("/")
      }
    }
    if (cancelledError) {
      alert.error(cancelledError);
      if(cancelledError==='MONGOERROR'){
        navigate("/")
      }
      dispatch(clearErrors());
    }
    dispatch(myOrders());
  }, [dispatch, alert, error, userError, cancelledError,navigate]);

  useEffect(() => {
    if (isCancelled && isCancelled === true && message) {
      alert.success(message)
      dispatch(myOrders());
    }
  },[isCancelled,message,dispatch,alert]);

  return (
    <Fragment>
      <MetaData title={`${user.name} - Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrders">
          <h1>My Orders</h1>
          {orders && orders[0] && orders[0].orderItems && !error ? (
            <div className="myOrdersContainer">
              <div className="myOrderProductheader">
                <p>Order</p>
                <p>Ordered on</p>
                <p>Status</p>
                <p>Action</p>
              </div>
              {orders.map((item, index) => (
                <div className="myOrderItems" key={index}>
                  <div className="ordersImg">
                    <Link to={`/order/${item._id}`}>
                      <img src={item.orderItems[0].image} />
                    </Link>
                  </div>
                  <p
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {item.createdAt.toString().substring(0, 10)}
                  </p>
                  <p>{item.orderStatus}</p>
                  <p>
                    <Delete
                      style={{
                        color: "red",
                        cursor: "pointer",
                        fontSize: "2vmax",
                      }}
                      onClick={() => handleDelete(item._id)}
                    />
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="noOrdersFound">
              <div>
                <h5>No order found</h5>
                <Link to="/cart">
                  Go to <ShoppingCartIcon />
                </Link>
              </div>
            </div>
          )}
          <Link to="/products">Get More Proucts</Link>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
