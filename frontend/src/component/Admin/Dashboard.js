import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import "./Dashboard.css";
import { Doughnut, Line } from "react-chartjs-2";
import MetaData from "../layout/MetaData";

import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Loader from "../layout/Loader/Loader";

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, products, loading,productsCount } = useSelector((state) => state.products);

  const [outStock, setOutStock] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/users");
        setTotalUsers(Array.from(data.users).length);
      } catch (error) {
        console.log(error)
      }
    };
    const loadOrders = async () => {
      try {
        const { data } = await axios.get("/api/v1/admin/orders");
        setTotalOrders(Array.from(data.orders).length);
        setTotalAmount(data.totalAmount);
      } catch (error) {
        console.log(error)
      }
    };
   loadUsers();
   loadOrders()
  },[]);
  const navigate=useNavigate()
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    dispatch(getAdminProducts());
  }, [error, dispatch, alert,navigate]);

  useEffect(() => {
    if (products) {
      if(productsCount)setTotalProducts(productsCount)
      Array.from(products).forEach((item) => {
        if (item.stock <= 0) {
          setOutStock((outStock) => outStock + 1);
        } else {
          setInStock((inStock) => inStock + 1);
        }
      });
    }
  }, [products]);

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };
  const dougnoutState = {
    labels: ["Out of stocks", "In stock"],
    datasets: [
      {
        backgroundColor: ["#00A684", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outStock, inStock],
      },
    ],
  };
  return (
    <Fragment>
      <MetaData title="Admin Dashboard"/>
      {loading && loading === false ? (
        <Loader />
      ) : (
        <div className="dashboard">
          <MetaData title={"Admin Panel"} />
          <Sidebar />
          <div className="dashboardContainer">
            <Typography component="h1">Dashboard</Typography>
            <div className="dashboardSummary">
              <div>
                <p>
                  Total Amount <br /> ₹{totalAmount?totalAmount:0}
                </p>
              </div>
              <div className="dashboardSummaryBox2">
                <Link to="/admin/products">
                  <p>Products</p>
                  <p>{totalProducts}</p>
                </Link>
                <Link to="/admin/orders">
                  <p>Orders</p>
                  <p>{totalOrders}</p>
                </Link>
                <Link to="/admin/users">
                  <p>Users</p>
                  <p>{totalUsers}</p>
                </Link>
              </div>
            </div>
            <div className="lineChart">
              <Line data={lineState} />
            </div>
            <div className="doughnout">
              <Doughnut data={dougnoutState} />
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
