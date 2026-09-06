import mongoose from"mongoose"

const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hostel",
  },
});

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;