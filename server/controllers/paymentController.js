
import Payment from "../models/Payment.js";
import Hostel from "../models/Hostel.js";
import Student from "../models/Student.js";

export const createPayment = async (req, res) => {
  try {
    const {
      student,
      amount,
      paymentDate,
      month,
      year,
      status,
      description,
    } = req.body;

    // Validate required fields
    if (!student || !amount || !month || !year) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Find hostel of logged-in owner
    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    // Check student belongs to owner's hostel
    const studentData = await Student.findOne({
      _id: student,
      hostel: hostel._id,
    });

    if (!studentData) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Prevent duplicate payment for same month/year
    const existingPayment = await Payment.findOne({
      student,
      hostel: hostel._id,
      month,
      year,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: `Payment for ${month} ${year} already exists`,
      });
    }

    // Create payment
    const payment = await Payment.create({
      student,
      hostel: hostel._id,
      amount,
      paymentDate: paymentDate || new Date(),
      month,
      year,
      status: status || "Paid",
      description,
    });

    // Populate student information
    const populatedPayment = await Payment.findById(payment._id)
      .populate("student", "name email phone")
      .populate("hostel", "hostelName");

    res.status(201).json({
      message: "Payment created successfully",
      payment: populatedPayment,
    });
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Error creating payment",
      error: error.message,
    });
  }
};


// GET ALL PAYMENTS
export const getPayments = async (req, res) => {
  try {
    // Find owner's hostel
    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const payments = await Payment.find({
      hostel: hostel._id,
    })
      .populate("student", "name email phone")
      .sort({ paymentDate: -1 });

    res.status(200).json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch (error) {
    console.error("GET PAYMENTS ERROR:", error);

    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};


// GET SINGLE PAYMENT
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const payment = await Payment.findOne({
      _id: id,
      hostel: hostel._id,
    })
      .populate("student", "name email phone")
      .populate("hostel", "hostelName");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.status(200).json({
      message: "Payment fetched successfully",
      payment,
    });
  } catch (error) {
    console.error("GET PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Error fetching payment",
      error: error.message,
    });
  }
};


// UPDATE PAYMENT
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      paymentDate,
      month,
      year,
      status,
      description,
    } = req.body;

    if (!amount || !month || !year) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    // Find payment belonging to owner's hostel
    const payment = await Payment.findOne({
      _id: id,
      hostel: hostel._id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    // Check duplicate month/year for same student
    const existingPayment = await Payment.findOne({
      _id: { $ne: id },
      student: payment.student,
      hostel: hostel._id,
      month,
      year,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: `Payment for ${month} ${year} already exists`,
      });
    }

    payment.amount = amount;
    payment.paymentDate = paymentDate || payment.paymentDate;
    payment.month = month;
    payment.year = year;
    payment.status = status || payment.status;
    payment.description = description;

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate("student", "name email phone")
      .populate("hostel", "hostelName");

    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Error updating payment",
      error: error.message,
    });
  }
};


// DELETE PAYMENT
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const hostel = await Hostel.findOne({
      owner: req.ownerId,
    });

    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    const payment = await Payment.findOne({
      _id: id,
      hostel: hostel._id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    await Payment.findByIdAndDelete(id);

    res.status(200).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PAYMENT ERROR:", error);

    res.status(500).json({
      message: "Error deleting payment",
      error: error.message,
    });
  }
};
