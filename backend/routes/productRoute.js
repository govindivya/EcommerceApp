const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAdminProducts,
  createProductReview,
  getProductReviews,
  deleteReview,
  isAlreadyReviewed,
  deleteAdminReview,
  updateAdminReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review/create").put(isAuthenticatedUser, createProductReview);

router.route("/reviews/all/:id").get(getProductReviews);

router.route("/review/delete/:id").delete(isAuthenticatedUser, deleteReview);

router
  .route("/review/isreviewed/:id")
  .get(isAuthenticatedUser, isAlreadyReviewed);
router.route("/admin/review").put(isAuthenticatedUser,authorizeRoles('admin'),updateAdminReview).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteAdminReview)

module.exports = router;
