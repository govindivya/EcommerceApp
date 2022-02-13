const Product = require("../models/productModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Cart = require("../models/cartModel");
// add item to Cart

exports.saveToCart = catchAsyncErrors(async (req, res, next) => {
  //
  const { product, quantity } = req.body;
  const productInProducts = await Product.findById(product);
  //
  if (!productInProducts) {
    return next(new ErrorHandler("Product with given id is not found !", 404));
  }
  //
  if (quantity > productInProducts.stock) {
    return next(
      new ErrorHandler(
        `Product with given id has lesser stock than ${quantity}`,
        404
      )
    );
  }
  const cartProductDetails = {
    product: product,
    name: productInProducts.name,
    price: productInProducts.price,
    quantity: quantity,
    image: productInProducts.images[0].url,
    stock: productInProducts.stock,
  };

  //

  //
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      cartItems: cartProductDetails,
    });
  } else {
    let cartItems = await cart.cartItems.filter(
      (item) => item.product != product
    );
    cartItems.push(cartProductDetails);
    await Cart.findOneAndUpdate(
      {
        user: req.user.id,
      },
      { cartItems },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  }
  res.status(200).json({ success: true });
});

// delete item from Cart

exports.deleteFromCart = catchAsyncErrors(async (req, res, next) => {
  const product = req.params.product;
  if (!product) {
    return next(new ErrorHandler(`please provide product id !`, 404));
  }
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorHandler(`No product found in cart !`, 404));
  }
  cart.cartItems = cart.cartItems.filter((item) => item.product != product);
  await cart.save();
  res.status(200).json({ success: true });
});

//
exports.deleteAllCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.cartItems = [];
  await cart.save();
  res.status(200).json({ success: true });
});
//get all cart items

exports.getAllItems = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new ErrorHandler(`No product found !`, 404));
  }
  cart.cartItems.forEach(async (item, index) => {
    const product1 = await Product.findById(item.product);
    if (product1) {
      item.price = product1.price;
      item.stock = product1.stock;
    } else {
      cart.cartItems.splice(index, 1);
    }
  });
  await cart.save();
  res.status(200).json({ success: true, cartItems: cart.cartItems });
});
