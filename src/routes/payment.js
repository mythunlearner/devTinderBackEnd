const {userauth} = require("../middlewares/auth");
const express = require('express');
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");
const { validate } = require("../models/user");
// const { default: webhooks } = require("razorpay/dist/types/webhooks");
const crypto = require("crypto");

paymentRouter.post("/payment/create",userauth, async (req, res) => {

try{
   const {membershipType} = req.body;
   const {firstName, lastName, emailId} = req.user;
   const order = await razorpayInstance.orders.create({
       amount: membershipAmount[membershipType] * 100, // amount in the smallest currency unit
       currency: "INR",
       receipt: "receipt#1",
       notes: {
         firstName: firstName,
         lastName: lastName,
         membershipType: membershipType
       },
   });

        //Save it in Database against userId
      console.log("Order created:", order);
       // Return back my order details to frontend

       const paymentRecord = new payment({
        userId: req.user._id,
        orderId: order.id,
        amount: order.amount,   
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        notes: order.notes,
        });

        const savepayment = await paymentRecord.save();
        console.log("Payment record saved:", savepayment);

       res.json({...savepayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });

} catch(error){
  console.error("Error creating payment:", error);
  return res.status(500).json({message: "Server Error", error: error.message});

}
});

paymentRouter.post("/payment/webhook",userauth, async (req, res) => {

  try{
    const webhookSignature = req.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    
    if (digest !== webhookSignature) {
      console.error("Invalid webhook signature");
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    console.log(" Webhook signature verified successfully");

    // handle event type (e.g. payment.captured, order.paid)
    const event = req.body.event;
    if (event === "payment.captured") {
      // you can update payment status in DB here
      console.log("Payment captured successfully:", req.body.payload.payment.entity);
    }

    res.status(200).json({ status: "ok" });

  }catch(error){
    console.error(" Webhook handling error:", error);
    return res.status(500).json({message: "Server Error", error: error.message});
  }

});

module.exports = paymentRouter;