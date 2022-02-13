const Product = require("../models/productModel");
const Users = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const DeletedProduct = require("../models/deletedProduct");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 6;
  const productsCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .filter();
  let products = await apiFeature.query;
  let filteredProductsCount = Array.from(products).length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const productsCount = await Product.countDocuments();
  const currentPage = Number(req.query.page) || 1;
  const skip = resultPerPage * (currentPage - 1);
  const products = await Product.find().limit(resultPerPage).skip(skip);
  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  console.log(product.numOfReviews);
  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (req.body.images) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
  var editedProduct = {
    name: req.body.name ? req.body.name : product.name,
    category: req.body.category ? req.body.category : product.category,
    images: req.body.images ? req.body.images : product.images,
    price: req.body.price ? req.body.price : product.price,
    stock: req.body.stock ? req.body.stock : product.stock,
    description: req.body.description
      ? req.body.description
      : product.description,
  };
  product = await Product.findByIdAndUpdate(req.params.id, editedProduct, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }


  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
  await DeletedProduct.create({
    name: product.name,
    price: product.price,
    description: product.description,
    images: product.images,
  });

  await product.remove();
  res.status(200).json({
    success: true,
  });
});

// create product review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = await product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = Number(Array.from(product.reviews).length);
    await product.save();
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let lenght = Number(Array.from(product.reviews).length);
  product.ratings = avg / lenght;
  await product.save({
    validateBeforeSave: false,
  });
  res.status(200).json({ success: true });
});

exports.updateAdminReview = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const { rating, comment, productId, userId, userName } = req.body;
  const review = {
    user: userId,
    name: userName,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = await product.reviews.find(
    (rev) => rev.user.toString() === userId
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === userId) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = Number(Array.from(product.reviews).length);
    await product.save();
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let lenght = Number(Array.from(product.reviews).length);
  product.ratings = avg / lenght;
  await product.save({
    validateBeforeSave: false,
  });
  res.status(200).json({ success: true });
});
// get ALl review of a product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.isAlreadyReviewed = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  const isReviewed = await product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );
  // console.log(isReviewed)
  if (isReviewed) {
    res.status(200).json({
      success: true,
      comment: isReviewed.comment,
      rating: isReviewed.rating,
    });
  } else {
    res.status(200).json({ success: false });
  }
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // these are  the reviews that are not to be deleted
  const reviews = await product.reviews.filter(
    (rev) => rev.user.toString() !== req.user.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const numOfReviews = Number(Array.from(reviews).length);
  const ratings = numOfReviews != 0 ? avg / numOfReviews : 0;
  await Product.findByIdAndUpdate(
    req.params.id,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  console.log(product);
  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// admin route

exports.deleteAdminReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.body.product);
  const user = await Users.findById(req.body.user);
  if (!product) {
    return next(new ErrorHandler("Product with given id is not found", 404));
  }
  if (!user) {
    return next(new ErrorHandler("User is with given id is not found", 404));
  }
  // these are  the reviews that are not to be deleted
  const reviews = await product.reviews.filter(
    (rev) => rev.user.toString() !== req.body.user.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const numOfReviews = Number(Array.from(reviews).length);
  const ratings = numOfReviews != 0 ? avg / numOfReviews : 0;
  await Product.findByIdAndUpdate(
    req.params.id,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  console.log(product);
  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});
