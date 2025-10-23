const { fi } = require("date-fns/locale");
const mongoose = require("mongoose");
const user = require("./user");
const paymentSchema = new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  paymentId: {
    type: String,
  },
  orderId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  notes: {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    membershipType: {
      type: String,
    }, 
  },
});

const payment = mongoose.model("Payment", paymentSchema);
module.exports = payment;