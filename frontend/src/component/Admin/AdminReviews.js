import React, { Fragment, useEffect } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Navigate, useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { deleteProduct } from "../../actions/productAction";

const AdminReviews = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { products, error, loading } = useSelector((state) => state.products);

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

  const handleEditProduct = (id) => {
    navigate(`/admin/reviews/${id}`);
  };
  //print products
  return (
    <Fragment>
      <MetaData title={"Admin Products"} />
      {loading && loading === true ? (
        <Loader />
      ) : (
        <div className="adminProducts">
          <Sidebar />
          <div className="adminProductsContainer">
            <h1>Products Reviews Details</h1>
            <div className="adminProductsHeader">
              <p>Product</p>
              <p>Total Reviews</p>
              <p>Rating</p>
              <p>Action</p>
            </div>
            {products &&
              Array.from(products).map((item, index) => (
                <div key={index} className="adminProductsBox">
                  <p className="adminProductName">
                    <span>{item.name}</span>
                    <img src={item.images[0].url} />
                  </p>
                  <p>{Array.from(item.reviews).length}</p>
                  <p>{item.ratings}</p>
                  <p>
                    <Edit
                      className="adminIcon"
                      onClick={() => handleEditProduct(item._id)}
                    />
                  </p>
                </div>
              ))}
            {Array.from(products).length === 0 && (
              <div className="noAdminProducts">
                <h1>No Product Found</h1>
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AdminReviews;
