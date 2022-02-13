const {
  newOrder,
  getSingleOrder,
  myOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  cancelMyOrder
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = require("express").Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/cancel/:id").delete(isAuthenticatedUser,cancelMyOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrder);


router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
