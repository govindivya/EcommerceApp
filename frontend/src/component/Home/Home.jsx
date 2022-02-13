import React, { Fragment, useEffect, useState } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Metadata from "../layout/MetaData";
import ProductCard from "./ProductCard.jsx";
import { getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, } = useSelector(
    (state) => state.products
  );
  const navigate= useNavigate();
  useEffect(() => {
    if(error) {
      alert.error(error);
      if(error==='MONGOERROR'){
        navigate("/")
      }
    }
    dispatch(getProduct());
  }, [dispatch,error,alert,navigate]);
  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <Metadata title="Home" />
      <div className="banner">
        <p>Welcome to GShop</p>
        <h1>Find Amazing Product</h1>
        <a href="#productContainer">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>
      <h2 className="homeHeading">Featured Product</h2>
      <div className="container" id="productContainer">
        {products &&
          products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </Fragment>
  );
};

export default Home;
