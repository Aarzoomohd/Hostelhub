import mongoose from "mongoose";

const hostelSchema = new mongoose.Schema({
    hostelName: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },

      state: {
        type: String,
        required: true,
        trim: true
    },

      pincode: {
        type: String,
        required: true,
        trim: true
    },

     owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    }},
    {
        timestamps: true
    }

);

const Hostel = mongoose.model("Hostel", hostelSchema);

export default Hostel;