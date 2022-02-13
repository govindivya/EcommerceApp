import React, { useState, useEffect } from "react";
import {Rating} from '@mui/material'
import profile from "../../images/Profile.png";
import { DeleteForever ,Edit} from "@mui/icons-material";

const ReviewCard = ({
  review,
  index,
  handleReviewDelete,
  user,
  handleEdit
}) => {
  const [size,setSize]=useState("medium")
  const options = {
    size:size,
    value:review.rating,
    readOnly: true,
    precision: 0.5,
  };

  //setting product rating 
  useEffect(() => {
   
    if(window.innerWidth < 600){
      setSize("small")
    }
    else if(window.innerWidth > 800){
      setSize("medium")
    }
 
  }, [window.innerWidth]);

  /// starts size handling code ends here
  return (
    <div className={index < 6 ? `reviewCard` : `reviewCard none`} index={index}>
      <img src={profile} alt="user-image" />
      <p>{review.name}</p>
      <Rating {...options}  />
      <span className="reviewCardComment">{review.comment}</span>
      {user && user._id === review.user && (
        <p style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
           <Edit style={{color:"green","cursor":"pointer"}} onClick={handleEdit} />
           <DeleteForever style={{color:"red","cursor":"pointer"}} onClick={handleReviewDelete}/> 
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
