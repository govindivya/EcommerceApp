import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {Rating} from '@mui/material'
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const [productRating, setProductRating] = useState(0);

  const [size,setSize]=useState("medium")
  const options = {
    size:size,
    value: productRating,
    readOnly: true,
    precision: 0.5,
  };

  //setting product rating 
  useEffect(() => {
    if (product && product.ratings) {
      setProductRating(product.ratings);
    }
    if(window.innerWidth < 600){
      setSize("small")
    }
    else if(window.innerWidth > 800){
      setSize("medium")
    }
 
  }, [product,window.innerWidth]);
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} />

      <p>{product.name}</p>
      <div className="starContainer">
        <Rating {...options}/>
        <span style={{ paddingLeft: "5px" }}>
          {product.numOfReviews} reviews
        </span>
      </div>
      <span>₹{product.price}</span>
    </Link>
  );
};

export default ProductCard;
