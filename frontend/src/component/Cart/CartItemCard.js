import React from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
const CartItemCard = ({
  item,
  deleteCartItems,
  increaseQuantity,
  decreaseQuantity,
}) => {
  return (
    <div className="CartItemCard">
      <img src={item.image} alt="image" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name.toString().substring(0,12)}..</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <div className="itemQuantity">
          <RemoveIcon style={{"cursor":"pointer"}} onClick={()=>decreaseQuantity(item.product,item.quantity)} />
          <span>{item.quantity}</span>
          <AddIcon style={{"cursor":"pointer"}} onClick={()=>increaseQuantity(item.product,item.quantity,item.stock)} />
        </div>
        <p style={{color:"rgba(0,0,0,0.8)",fontSize:"1vmax"}}>Subtotal  :    ₹{item.price * item.quantity}</p>

        <p style={{"color":`${item.stock <=0 ? "red" :"blue"}` ,"fontSize":"1vmax","cursor":"unset"}}>Stock : {item.stock}</p>
        <p onClick={() => deleteCartItems(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
