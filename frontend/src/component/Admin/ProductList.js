import React, { Fragment, useEffect, useState } from "react";
import "./ProductList.css";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, clearErrors } from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { deleteProduct } from "../../actions/productAction";
import Pagination from "react-js-pagination";

const ProductList = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { products, error, loading, productsCount } = useSelector(
    (state) => state.products
  );
  const {
    error: deleteError,
    success: deleteSuccess,
    loading: deleteLoading,
  } = useSelector((state) => state.newProduct);

  const resultPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (id) => {
    const deleteIt = window.confirm("Are you sure to delete ", id);
    if (deleteIt) {
      dispatch(deleteProduct(id));
      dispatch(getAdminProducts(currentPage));
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
    dispatch(getAdminProducts(currentPage));
  }, [error, dispatch, alert, currentPage,navigate]);

  const handleEditProduct = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };
  //print products
  useEffect(() => {
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (deleteSuccess) {
      alert.success("Product deleted successfully");
      dispatch(getAdminProducts());
    }
  }, [deleteSuccess, deleteError, alert, dispatch]);
  return (
    <Fragment>
      <MetaData title={"Admin Products"} />
      {loading && loading === true ? (
        <Loader />
      ) : (
        <div className="adminProducts">
          <Sidebar />
          <div className="adminProductsContainer">
            <h1>{productsCount ? productsCount:""} Products</h1>
            <div className="adminProductsHeader">
              <p>Product</p>
              <p>Price</p>
              <p>Stock</p>
              <p>Action</p>
            </div>
            {products &&
              Array.from(products).map((item, index) => (
                <div key={index} className="adminProductsBox">
                  <p className="adminProductName">
                    <span>{item.name}</span>
                    <img src={item.images[0].url} />
                  </p>
                  <p>₹{item.price}</p>
                  <p>{item.stock}</p>
                  <p>
                    <Edit
                      className="adminIcon"
                      onClick={() => handleEditProduct(item._id)}
                    />{" "}
                    <Delete
                      className="adminIcon"
                      onClick={() => handleDelete(item._id)}
                    />
                  </p>
                </div>
              ))}
            {Array.from(products).length === 0 && (
              <div className="noAdminProducts">
                <h1>No Product Found</h1>
              </div>
            )}
            {resultPerPage < productsCount && (
              <div className="paginationBox">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={(e) => setCurrentPage(e)}
                  nextPageText={
                    (productsCount - (productsCount % resultPerPage)) /
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

export default ProductList;
