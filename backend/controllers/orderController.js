const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const DeletedOrder = require("../models/deletedOrder");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  orderItems.map(async (item) => {
    const productId = item.product;
    const product = await Product.findById(productId);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  });

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({ success: true, order });
});

// get single orderDetails by admin

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  // populat method replace whole user details by email and name only of user
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new ErrorHandler(
        `Order not found with given order id ${req.param.id}`,
        400
      )
    );
  }
  res.status(200).json({ success: true, order });
});

// get your orders
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({ success: true, orders });
});

exports.cancelMyOrder = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found ", 400));
  }
  const orderStatus = order.orderStatus.toString().toLowerCase();
  const { user, paidAt, paymentInfo, orderItems } = order;
  if (orderStatus === "processing" || orderStatus === "shipped") {
    await DeletedOrder.create({
      user,
      paidAt,
      paymentInfo,
      orderItems,
    });

    order.orderItems.forEach(async (item) => {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = product.stock + item.quantity;
        await product.save();
      }
    });
    await Order.findByIdAndDelete(id);
    if (order.paymentInfo.status === "succeeded") {
      res.status(200).json({
        success: true,
        message: "Your order is cancelled and refund will be initiated soon",
      });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Your order is cancelled" });
    }
  }
  if (orderStatus === "delivered") {
    if (Date.now() - order.deliveredAt > 7 * 24 * 60 * 60) {
      return next(
        new ErrorHandler("Order is not refundable after 7 days  ", 400)
      );
    } else {
      await DeletedOrder.create({
        user,
        paidAt,
        paymentInfo,
        orderStatus,
      });

      await Order.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Your refund will be initiated soon after picking the item",
      });
    }
  }

  res.status(200).json({ success: true });
});
// admin get all orders

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const totalOrders = await Order.find();
  let totalAmount = 0;
  totalOrders.forEach((order) => {
    if (order.paymentInfo.status === "succeeded") {
      totalAmount += order.totalPrice;
    }
  });
  const resultPerPage = 10;
  const ordersCount = await Order.countDocuments();
  const currentPage = Number(req.query.page) || 1;
  const skip = resultPerPage * (currentPage - 1);
  const orders = await Order.find().limit(resultPerPage).skip(skip);
  
  res.status(200).json({ success: true, orders, totalAmount,ordersCount });
});

// update order status
// admin route
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Product not found with given id", 400));
  }
  const orderStatus = order.orderStatus.toString().toLowerCase();
  const status = req.body.status.toString().toLowerCase();
  if (orderStatus === "delivered") {
    return next(new ErrorHandler("Product is already delivered", 404));
  } else {
    if (
      status === "processing" ||
      status == "delivered" ||
      status === "shipped"
    ) {
      order.orderStatus = status;
      await order.save();
      res.status(200).json({ success: true, message: `Order is ${status}` });
    } else {
      console.log(status)
      return next(new ErrorHandler("This is not a valid process", 404));
    }
  }
});

// deleting orders

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ErrorHandler(
        `Order not found with given order id ${req.param.id}`,
        400
      )
    );
  }
  const { user, paidAt, paymentInfo, orderItems } = order;
  await DeletedOrder.create({
    user,
    paidAt,
    paymentInfo,
    orderItems,
  });
  await order.remove();

  res.status(200).json({ success: true });
});
