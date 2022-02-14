import React, { Fragment, useState, useEffect } from "react";
import "./Products.css";
import Loader from "../layout/Loader/Loader";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import ProductCard from "../Home/ProductCard";
import { useNavigate } from "react-router-dom";
import "../Home/Home.css";
import Pagination from "react-js-pagination";
import { Typography, Slider, Button } from "@mui/material";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { useAlert } from "react-alert";
import MedataData from "../layout/MetaData";

const categories = [
  "none",
  "Laptop",
  "Mobile",
  "Electronics",
  "Clothes",
  "Men's Wear",
  "Women's Wear",
  "Kids Wear",
  "Digital",
  "Stationary",
  "Electrical",
  "Fashion",
  "Summer Clothes",
  "Winter Clothes",
  "Furniture",
  "Sports",
  "Medicine",
  "Health",
  "Games",
  "Machines",
  "Handlooms",
  "Handcrafted",
  "Grossary",
  "Oils",
  "Food",
  "Dry Fruits",
  "Tv",
  "Phone",
  "Cellphone",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {
    loading,
    products,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);
  //  to hold currentPage info for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // params acces
  //
  //
  const [price, setPrice] = useState([0, 250000]);
  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);

  };

  //  fetching current Data from server
  //
  const [rating, setRating] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  //
  const handleCatgory = (e, value) => {
    setIsVisible(!isVisible);
    if (value !== "none") {
      setCategory(value);
      setCurrentPage(1);
      setKeyword("")
      setPrice([0, 250000]);
    } else setCategory("");
  };
  const ratingHandler = (e, newValue) => {
    setRating(newValue);
    setCurrentPage(1);
  };
  //
  let count = filteredProductsCount;
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      alert.error(error);
      return;
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [
    dispatch,
    alert,
    error,
    navigate,
    rating,
    keyword,
    currentPage,
    price,
    category,
  ]);
  
  useEffect(() => {
    if (error) {
      alert.error(error);
      return;
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [
    dispatch,
    alert,
    error,
    navigate,
    rating,
    keyword,
    currentPage,
    price,
    category,
  ]);

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MedataData title={"Products"} />
      <div className="productMain">
        <h1 className="productsHeading">Products</h1>
        <div className="productInsideSearch">
          <form onSubmit={(e)=>{
            e.preventDefault();
            setKeyword(e.target.searchKeyword.value);
            setCategory("")
            setPrice([0, 250000])
            }}>
            <input type="text" name="searchKeyword"  />
            <input type="submit"/>
          </form>
        </div>
        {filteredProductsCount && filteredProductsCount !== 0 && (
          <div className="filterBoxContainer">
            <div className="pricefilterBox">
              <Typography>Price</Typography>
              <Slider
                value={price}
                onChange={priceHandler}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                step={100}
                defaultValue={1000}
                min={0}
                max={500000}
                size="small"
              />
            </div>
            <div className="ratingFilter">
              <h4>Rating</h4>
              <Slider
                marks
                step={0.5}
                aria-labelledby="discrete-slider-small-steps"
                onChange={ratingHandler}
                valueLabelDisplay="auto"
                max={5}
                min={0}
                value={rating}
                size="small"
              />
            </div>
            <div
              className="categoryBox"
              onClick={(e) => setIsVisible(!isVisible)}
            >
              <div className="categoryHeading">
                <h4>Category</h4>
                <BsFillCaretDownFill className={isVisible ? "none" : ""} />{" "}
                <BsFillCaretUpFill className={isVisible ? "" : "none"} />
              </div>
              <div
                className={isVisible ? `category` : "none category"}
                id="category"
              >
                {categories.map((item, index) => (
                  <li
                    className="category-link"
                    key={item}
                    values={item}
                    onClick={(e) => handleCatgory(e, item)}
                  >
                    {item}
                  </li>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="products container">
          {products &&
            products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>

        {resultPerPage < count && (
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
        <div
          className={
            filteredProductsCount === 0 ? "noProduct" : "noProduct none"
          }
        >
          <h1>Sorry , No Product Found !</h1>
          <Button
            onClick={() => {
              setPrice([0,250000])
              setCategory("")
              setKeyword("");
              setRating(0);
              dispatch(getProduct());
            }}
          >
            Go Back
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default Products;
