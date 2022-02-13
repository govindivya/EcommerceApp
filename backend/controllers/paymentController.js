const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "GShop",
    },
  });
  res.status(200).json({
      success:true,
      client_secret :myPayment.client_secret
  })
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({
        success:true,
        stripeApiKey :process.env.STRIPE_API_KEY
    })
  });
  