import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    month: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;