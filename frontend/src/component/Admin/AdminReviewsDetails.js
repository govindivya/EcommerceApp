import React, { Fragment, useEffect, useState } from "react";
import "./AdminReviewsDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
  deleteReview,
  updateReview,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "../layout/Loader/Loader";
import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import { NEW_REVIEW_RESET } from "../../constants/productConstant";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
} from "@mui/material";

const AdminReviewsDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [url, setUrl] = useState("");

  const { product, error, loading } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if (error) {
     if(error==='MONGOERROR'){
      alert.show("This is not a valid resource");
      navigate("/")   
     }
     else{
      alert.error(error);
      dispatch(clearErrors());
     }
    }
    dispatch(getProductDetails(id));
  }, [error, dispatch, alert, id,navigate]);

  useEffect(() => {
    if (product && product.images) {
      setUrl(product.images[0].url);
      console.log(product._id);
    }
  }, [product]);
  const { error: reviewError, success: reviewSuccess } = useSelector(
    (state) => state.review
  );

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

  const handleDelete = async ({ productid, user }) => {
    const deleteIt = window.confirm("Are you sure to delete this review");
    if (deleteIt) {
      dispatch(deleteReview({ productid, user }));
    }
  };

  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [userName, setUserName] = useState("");

  const submitReviewHandler = async () => {
    if (rating === 0 || comment.toString().trim() === "") {
      alert.error("Please give a valid rating or review !");
      return;
    }
    const reviewData = {
      rating,
      comment,
      productId,
      userId,
      userName,
    };
    console.log(productId);
    dispatch(updateReview(reviewData));
    setOpen(false);
    setRating(0);
    setComment("");
  };
  return (
    <Fragment>
      <MetaData title={"Admin Review"} />
      {loading && loading === true ? (
        <Loader />
      ) : (
        <div className="adminReviews">
          <Sidebar />
          <div
            className="adminReviewsContainer"
            style={{
              backgroundImage: `url(${url})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <h1>
              {product && product.name && product.name.toString().toUpperCase()}
            </h1>

            {product &&
              product.reviews &&
              Array.from(product.reviews).map((item, index) => (
                <div key={index} className="adminReviewsBox">
                  <h1>{item.name.toString().toUpperCase()}</h1>
                  <p>{item.comment}</p>
                  <p>{item.rating}</p>
                  <div className="adminReviewIcons">
                    <Edit
                      onClick={(e) => {
                        setUserId(item.user);
                        setUserName(item.name);
                        setProductId(product._id);
                        setOpen(true);
                      }}
                    />
                    <Delete
                      onClick={(e) => handleDelete(product._id, item.user)}
                    />
                  </div>
                </div>
              ))}
            <Dialog
              area-aria-labelledby="simple-dialog-title"
              open={open}
              onClose={(e) => setOpen((open) => !open)}
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
          </div>
        </div>
      )}
    </Fragment>
  );
};
export default AdminReviewsDetails;

/*

{product &&
              product.reviews &&
              Array.from(product.reviews).map((item, index) => (
                <div className="adminReviewsBox" key={index}>
                    
                </div>
              ))}


              {Array.from(product.reviews).length === 0 && (
              <div className="noAdminProducts">
                <h1>No Review Found</h1>
              </div>
            )}
*/
