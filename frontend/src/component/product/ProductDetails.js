import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  deleteReview,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ReviewCard from "./ReviewCard";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
} from "@mui/material";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";

const ProductDetails = () => {
  // handle loading more comment
  const [showComment, setShowComment] = useState("Show more reviews");

  const handleMore = (e) => {
    if (showComment.match("Show more reviews")) {
      setShowComment("Show less reviews");
    }
    if (showComment.match("Show less reviews")) {
      setShowComment("Show more reviews");
    }
    if (document.readyState) {
      const allComment = document.querySelectorAll(".reviews .reviewCard ");
      allComment.forEach((item, index) => {
        console.log(item.getAttribute("index"));
        if (Number(item.getAttribute("index")) > 3) {
          if (item.classList.contains("none")) {
            item.classList.remove("none");
          } else item.classList.add("none");
        }
      });
    }
  };
  //
  //

  //
  //
  const alert = useAlert();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // details of product
  const { error, loading, product } = useSelector(
    (state) => state.productDetails
  );

  const { addOrDelete } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

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
    if (addOrDelete && addOrDelete === true) {
      alert.success("Item added to cart");
      navigate("/cart");
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert, addOrDelete, navigate]);

  // This is to control size of stars in review section
  const [productRating, setProductRating] = useState(0);

  const options = {
    size: window.innerWidth > 700 ? "large" : "small",
    value: productRating,
    readOnly: true,
    precision: 0.5,
  };

  //setting product rating
  useEffect(() => {
    if (product && product.ratings) {
      setProductRating(product.ratings);
    }
  }, [product]);
  // setting quantity
  const stock = Number(product ? product.stock : 0);
  const [quntityOfProduct, setQuantityOfProduct] = useState(1);

  //

  //
  const decreaseQuantity = (e) => {
    if (quntityOfProduct > 1) setQuantityOfProduct((quantity)=>quantity - 1);
  };

  const increaseQuantity = (e) => {
    if (quntityOfProduct > 20) {
      alert.error("quantity can't exceed  20 item for general purchase");
      return;
    } else if (quntityOfProduct <= stock - 1) {
      setQuantityOfProduct((quantity) => quantity + 1);
      return;
    }
    alert.error("quantity can't exceed  stocks");
  };
  //

  const addItemsToCartHandler = async (e) => {
    if (!user) {
      alert.error("Please login first");
      return;
    }
    dispatch(addItemsToCart(id, quntityOfProduct));
  };
  //
  useEffect(() => {
    if (product && product.stock < 1) {
      setQuantityOfProduct(0);
    } else {
      setQuantityOfProduct(1);
    }
  }, [product]);

  // starts size handling code ends here

  //comment and reviews related things
  const { error: reviewError, success: reviewSuccess } = useSelector(
    (state) => state.review
  );
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }
    if (reviewSuccess) {
      alert.success("Review submitted successfully");
      dispatch({ type: NEW_REVIEW_RESET });
      dispatch(getProductDetails(id));
    }
  }, [reviewError, reviewSuccess, alert, dispatch, id]);

  const submitReviewToggle = () => {
    if (open === true) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const submitReviewHandler = async () => {
    if (rating === 0 || comment.toString().trim() === "") {
      alert.error("Please give a valid rating or review !");
      return;
    }
    const reviewData = {
      rating,
      comment,
      productId: id,
    };
    dispatch(newReview(reviewData));
    setOpen(false);
    setRating(0);
    setComment("");
  };

  const [isReviewed, setIsReviewd] = useState(false);

  useEffect(() => {
    const fetchIsReviewed = async () => {};
  }, [product, user, id]);

  const handleReviewDelete = () => {
    dispatch(deleteReview(id));
    setIsReviewd(false);
    setComment("");
    setOpen(false);
    if (reviewSuccess === true) {
      alert.success("Review deleted successfully");
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <Fragment>
      <MetaData title={product && product.name} />
      {product && (
        <div>
          <div className="ProductDetails">
            <div className="imageDetails">
              <Carousel className="carouselImage">
                {product &&
                  product.images &&
                  product.images.map((item, index) => (
                    <img src={item.url} key={index} alt={`${index}/slide`} />
                  ))}
              </Carousel>
            </div>
            <div className="detailsOfProduct">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span style={{ marginLeft: "5px" }}>
                  {" "}
                  {product.numOfReviews} reviews
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input type="number" value={quntityOfProduct} readOnly />
                    <button onClick={increaseQuantity}>+</button>
                  </div>
                  <button onClick={addItemsToCartHandler}>Add to cart</button>
                </div>
                <p>
                  Status :{" "}
                  <b className={product.stock < 1 ? `redColor` : `greenColor`}>
                    {product.stock < 1
                      ? "Out of stock "
                      : `${product.stock} item are available now`}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Descritpion : <p>{product.description}</p>
              </div>
              <button
                className="submitReview"
                onClick={(e) => {
                  if (user && isAuthenticated) {
                    submitReviewToggle(e);
                  } else {
                    alert.error("Please login first");
                  }
                }}
              >
                {isReviewed ? "Edit Review" : "Submit Review"}
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">Reviews</h3>
          <Dialog
            area-aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />
              <textarea
                className="submitDialogTextArea"
                cols={30}
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button
                color="secondary"
                onClick={(e) => {
                  setComment("");
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={submitReviewHandler}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <div className="reviews">
            {product.reviews && product.reviews[0] ? (
              product.reviews.map((review, index) => (
                <ReviewCard
                  key={index}
                  index={index + 1}
                  review={review}
                  handleReviewDelete={handleReviewDelete}
                  user={user}
                  handleEdit={submitReviewToggle}
                />
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {product && product.reviews && product.reviews.lenght > 5 && (
              <button className="loadmore" onClick={handleMore}>
                <span
                  style={{
                    fontSize: "30px",
                    marginRight: "5px",
                    color: "tomato",
                  }}
                >
                  ...
                </span>
                {showComment}
              </button>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ProductDetails;
