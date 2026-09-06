import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import Owner from "../models/Owner.js";
import Hostel from "../models/Hostel.js";
import EmailVerification from "../models/EmailVerification.js";
import crypto from "crypto";
import PasswordReset from "../models/PasswordReset.js";


// ===============================
// EMAIL TRANSPORTER
// ===============================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ===============================
// SEND EMAIL VERIFICATION OTP
// ===============================

export const sendVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();


    // Check if email is already registered
    const existingOwner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "Email is already registered. Please login.",
      });
    }


    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();


    // OTP expires in 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );


    // Remove old OTP for this email
    await EmailVerification.deleteMany({
      email: normalizedEmail,
    });


    // Save new OTP
    await EmailVerification.create({
      email: normalizedEmail,
      otp,
      expiresAt,
      verified: false,
    });


    // Send email
    await transporter.sendMail({
      from: `"HostelHub" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "HostelHub Email Verification OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        ">

          <h2 style="color: #2563eb;">
            HostelHub Email Verification
          </h2>

          <p>
            Hello,
          </p>

          <p>
            Use the following OTP to verify your email address:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            margin: 25px 0;
            color: #111827;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p style="color: #6b7280;">
            If you did not request this verification, you can safely
            ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>HostelHub Team</strong>
          </p>

        </div>
      `,
    });


    return res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {

    console.error("Send OTP error:", error);

    return res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};


// ===============================
// VERIFY EMAIL OTP
// ===============================

export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();


    // Find OTP record
    const verification = await EmailVerification.findOne({
      email: normalizedEmail,
    });

    if (!verification) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }


    // Check expiry
    if (verification.expiresAt < new Date()) {

      await EmailVerification.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }


    // Check OTP
    if (verification.otp !== otp.trim()) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }


    // Mark email as verified
    verification.verified = true;

    await verification.save();


    return res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (error) {

    console.error("Verify OTP error:", error);

    return res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};


// ===============================
// REGISTER OWNER
// ===============================

export const registerOwner = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
    } = req.body;


    // Check all fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }


    const normalizedEmail = email.trim().toLowerCase();


    // ==========================================
    // CHECK IF EMAIL IS ALREADY REGISTERED
    // ==========================================

    const existingOwner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "Email is already registered. Please login.",
      });
    }


    // ==========================================
    // IMPORTANT:
    // CHECK EMAIL VERIFICATION
    // ==========================================

    const emailVerification =
      await EmailVerification.findOne({
        email: normalizedEmail,
        verified: true,
      });


    if (!emailVerification) {
      return res.status(400).json({
        message:
          "Please verify your email before creating an account.",
      });
    }


    // Check verification expiry also
    if (emailVerification.expiresAt < new Date()) {

      await EmailVerification.deleteOne({
        _id: emailVerification._id,
      });

      return res.status(400).json({
        message:
          "Email verification has expired. Please verify your email again.",
      });
    }


    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // ==========================================
    // CREATE OWNER
    // ==========================================

    const owner = new Owner({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      emailVerified: true,
    });


    await owner.save();


    // ==========================================
    // DELETE OTP RECORD
    // ==========================================

    await EmailVerification.deleteOne({
      _id: emailVerification._id,
    });


    // ==========================================
    // REMOVE PASSWORD FROM RESPONSE
    // ==========================================

    const ownerData = owner.toObject();

    delete ownerData.password;


    // ==========================================
    // CREATE JWT
    // ==========================================

    const token = jwt.sign(
      {
        ownerId: owner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message: "Owner registered successfully",
      token,
      owner: ownerData,
    });

  } catch (error) {

    console.error("Register error:", error);

    return res.status(500).json({
      message: "Error registering owner",
      error: error.message,
    });
  }
};


// ===============================
// LOGIN OWNER
// ===============================

export const loginOwner = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }


    const normalizedEmail =
      email.trim().toLowerCase();


    // Find owner
    const owner = await Owner.findOne({
      email: normalizedEmail,
    });


    if (!owner) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        owner.password
      );


    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // Create token
    const token = jwt.sign(
      {
        ownerId: owner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    // Remove password
    const ownerData = owner.toObject();

    delete ownerData.password;


    // Find hostel
    const hostel = await Hostel.findOne({
      owner: owner._id,
    });


    return res.status(200).json({
      message: "Login successful",
      token,
      owner: ownerData,
      hostel,
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// SEND FORGOT PASSWORD OTP


export const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether account exists
    const owner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (!owner) {
      return res.status(404).json({
        message: "No account found with this email",
      });
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before storing it
    const hashedOtp = await bcrypt.hash(otp, 10);

    // OTP expires after 10 minutes
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Remove old reset OTP
    await PasswordReset.deleteMany({
      email: normalizedEmail,
    });

    // Store hashed OTP
    await PasswordReset.create({
      email: normalizedEmail,
      otp: hashedOtp,
      expiresAt,
      verified: false,
    });

    // Send OTP using existing transporter
    await transporter.sendMail({
      from: `"HostelHub" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "HostelHub Password Reset OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        ">

          <h2 style="color: #2563eb;">
            HostelHub Password Reset
          </h2>

          <p>
            We received a request to reset your HostelHub password.
          </p>

          <p>
            Your password reset OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            margin: 25px 0;
            color: #111827;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p style="color: #6b7280;">
            If you did not request a password reset,
            please ignore this email.
          </p>

          <p>
            Regards,<br />
            <strong>HostelHub Team</strong>
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      message: "Password reset OTP sent successfully",
    });

  } catch (error) {
    console.error("Forgot password OTP error:", error);

    return res.status(500).json({
      message: "Failed to send password reset OTP",
    });
  }
};



// VERIFY FORGOT PASSWORD OTP


export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const resetData = await PasswordReset.findOne({
      email: normalizedEmail,
    });

    if (!resetData) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (resetData.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetData._id,
      });

      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Compare entered OTP with hashed OTP
    const isOtpCorrect = await bcrypt.compare(
      otp.trim(),
      resetData.otp
    );

    if (!isOtpCorrect) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Mark OTP as verified
    resetData.verified = true;

    await resetData.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("Verify reset OTP error:", error);

    return res.status(500).json({
      message: "Failed to verify OTP",
    });
  }
};

// RESET PASSWORD

export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // OTP MUST already be verified
    const resetData = await PasswordReset.findOne({
      email: normalizedEmail,
      verified: true,
    });

    if (!resetData) {
      return res.status(403).json({
        message: "Please verify OTP first",
      });
    }

    // Check reset authorization expiry
    if (resetData.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetData._id,
      });

      return res.status(403).json({
        message:
          "Password reset session has expired. Please request a new OTP.",
      });
    }

    // Find owner
    const owner = await Owner.findOne({
      email: normalizedEmail,
    });

    if (!owner) {
      await PasswordReset.deleteOne({
        _id: resetData._id,
      });

      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    owner.password = hashedPassword;

    await owner.save();

    // IMPORTANT:
    // Delete reset record so it cannot be reused
    await PasswordReset.deleteOne({
      _id: resetData._id,
    });

    return res.status(200).json({
      message:
        "Password reset successfully. Please login.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};