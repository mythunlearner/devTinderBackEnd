const {userauth} = require("../middlewares/auth");
const express = require('express');
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

paymentRouter.post("/payment/create",userauth, async (req, res) => {

try{
   const {memebershipType} = req.body;
   const {firstName, lastName, emailId} = req.user;
   const order = await razorpayInstance.orders.create({
       amount: membershipAmount[memebershipType] * 100, // amount in the smallest currency unit
       currency: "INR",
       receipt: "receipt#1",
       notes: {
         firstName: firstName,
         lastName: lastName,
         memebershipType: memebershipType
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

  return res.status(500).json({message: "Server Error", error: error.message});

}
});

paymentRouter.post("/payment/webhook",userauth, async (req, res) => {

});

module.exports = paymentRouter;