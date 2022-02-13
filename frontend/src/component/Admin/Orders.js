import React, { Fragment, useEffect, useState } from "react";
import "./Order.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders,clearErrors ,deleteOrder} from "../../actions/orderAction";
import { useAlert } from "react-alert";
import {Link, useNavigate} from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { Button } from "@mui/material";
import Pagination from 'react-js-pagination';
const AdminOrders = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { orders, error, loading,ordersCount } = useSelector((state) => state.allOrder);
 const resultPerPage=10;
 const [currentPage,setCurrentPage]= useState(1);
 
  const handleDelete = (id) => {
    const deleteIt = window.confirm("Are you sure to delete ", id);
    if (deleteIt) {
      dispatch(deleteOrder(id));
      dispatch(getAllOrders(currentPage))
    }
  };
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    dispatch(getAllOrders(currentPage));
  }, [error, dispatch, alert,currentPage,navigate]);

  //print products
  useEffect(() => {
   
  }, []);
  return (
    <Fragment>
      <MetaData title={"Admin Orders"} />
      {loading && loading === true ? (
        <Loader />
      ) : (
        <div className="adminOrders">
          <Sidebar />
          <div className="adminOrdersContainer">
            <h1>All Orders</h1>
            <div className="adminOrdersHeader">
              <p>Order Id</p>
              <p>Status</p>
              <p>Action</p>
            </div>
            {orders &&
              Array.from(orders).map((item, index) => (
                <div key={index} className="adminOrdersBox">
                  <p>{item._id}</p>
                  <p>{item.orderStatus}</p>
                  <p>
                    <Edit
                      className="adminIcon"
                      onClick={()=>navigate(`/admin/order/${item._id}`)}
                    />{" "}
                    <Delete
                      className="adminIcon"
                      onClick={() => handleDelete(item._id)}
                    />
                  </p>
                </div>
              ))}
            {orders && Array.from(orders).length === 0 && (
              <div className="noAdminOrders">
                <h1>No Order Found</h1>
                <Button
                style={{
                  "backgroundColor":"tomato",
                  margin: "5vmax auto",
                  padding:"2vmax 3vmax",
                  color:"white"
                }}
                onClick={()=>navigate("/admin/dashboard")}
                >Go To Dashboard</Button>
              </div>
            )}
            {resultPerPage < ordersCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={ordersCount}
                onChange={(e) => setCurrentPage(e)}
                nextPageText={
                  (ordersCount - (ordersCount % resultPerPage)) /
                    resultPerPage ===
                  currentPage
                    ? "No More"
                    : "Next"
                }
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AdminOrders;
