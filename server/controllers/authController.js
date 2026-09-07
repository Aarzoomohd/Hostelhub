import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Owner from "../models/Owner.js";
import Hostel from "../models/Hostel.js";

// ================= REGISTER OWNER =================
export const registerOwner = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // Required fields validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }


    // Check existing owner
    const existingOwner = await Owner.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const owner = await Owner.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

// ================= LOGIN OWNER =================
export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find owner
    const owner = await Owner.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!owner) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      owner.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: owner._id,
        email: owner.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Check if owner already has a hostel
    const hostel = await Hostel.findOne({
      owner: owner._id,
    });

    const ownerData = {
      id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      owner: ownerData,
      hostel,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};