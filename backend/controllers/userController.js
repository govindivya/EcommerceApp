const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Product = require("../models/productModel");
const cloudinary = require("cloudinary");
const DeletedUser = require("../models/deletedUser");
const Orders = require("../models/orderModel");
// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    return next(new ErrorHandler("User already exists with this email", 401));
  }
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `Your password reset link is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});
// get user details profile

exports.getProfile = catchAsyncErrors(async (req, res, next) => {
  let user;
  if(req.user.id){
     user = await User.findById(req.user.id);
  }
  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id  ${req.user.id}`, 401)
    );
  }
  res.status(200).json({ success: true, user });
});
// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update User profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  var myCloud;
  if (req.body.avatar) {
    const user1 = await User.findById(req.user.id);
    const public_id = user1.avatar.public_id;
    await cloudinary.v2.uploader.destroy(public_id);
    myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
  }

  var newUserData = {};
  if (req.body.avatar) {
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  if (req.body.email) {
    newUserData.email = req.body.email;
  }
  if (req.body.name) {
    newUserData.name = req.body.name;
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, message: "User updated succesfully" });
});

// admin get All Users

exports.getAllUsersDetails = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const usersCount = await User.countDocuments();
  const currentPage = Number(req.query.page) || 1;
  const skip = resultPerPage * (currentPage - 1);
  const users = await User.find().limit(resultPerPage).skip(skip);
  res.status(200).json({ success: true, users ,usersCount});
});

// admin single user detailss

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id  ${req.params.id}`, 401)
    );
  }
  res.status(200).json({ success: true, user });
});

// admin delete user

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exits with id  ${req.params.id}`, 401)
    );
  }
  const hasOrder = await Orders.findOne({ user: user._id });
  if (hasOrder) {
    return next(
      new ErrorHandler(`User has placed an order so can't be removed`, 401)
    );
  }
  
  const deletedUser = await DeletedUser.find({ email: user.email });
  if (!deletedUser) {
    await DeletedUser.create({
      email: user.email,
    });
  } else {
    await DeletedUser.findOneAndUpdate(
      { email: user.email },
      { deletedAt: Date.now() }
    );
  }
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User deleted succesfully" });
});

// add User

exports.addNewUser=catchAsyncErrors(async (req,res,next)=>{
  let findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    return next(new ErrorHandler("User already exists with this email", 401));
  }
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({success:true,user});
})

// admin update authorizeRoles

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({ success: true, message: "User updated succesfully" });
});
