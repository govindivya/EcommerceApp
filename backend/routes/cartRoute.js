const { deleteFromCart, getAllItems, saveToCart, saveShippingInfo, getShippingInfo, deleteShippingInfo, deleteAllCart } = require("../controllers/cartController");
const  { isAuthenticatedUser } =require("../middleware/auth");

const router = require("express").Router();

router.post("/cart/save",isAuthenticatedUser,saveToCart)
router.get("/cart/get",isAuthenticatedUser,getAllItems)
router.delete("/cart/delete/:product",isAuthenticatedUser,deleteFromCart)
router.delete("/cart/deleteall",isAuthenticatedUser,deleteAllCart)

module.exports= router;