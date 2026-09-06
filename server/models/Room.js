import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,        
      required: true,
      min: 1,
    },
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
  },
  {
    timestamps: true,       // ✅ typo fix — "timesatamps" tha
  }
);

const Room = mongoose.model("Room", roomSchema);   

export default Room;