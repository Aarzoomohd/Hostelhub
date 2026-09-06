import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, userData);
  return response.data;
}

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);
  return response.data;
}

export const sendVerificationOtp = async (email) => {
  const response = await axios.post(
    `${API_URL}/api/auth/send-otp`,
    { email }
  );

  return response.data;
};

// Verify email OTP
export const verifyVerificationOtp = async (email, otp) => {
  const response = await axios.post(
    `${API_URL}/api/auth/verify-otp`,
    {
      email,
      otp,
    }
  );

  return response.data;
};

// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

export const sendForgotPasswordOtp = async (email) => {
  const response = await axios.post(
    `${API_URL}/api/auth/forgot-password/send-otp`,
    {
      email,
    }
  );

  return response.data;
};


// ==========================================
// FORGOT PASSWORD - VERIFY OTP
// ==========================================

export const verifyForgotPasswordOtp = async (email, otp) => {
  const response = await axios.post(
    `${API_URL}/api/auth/forgot-password/verify-otp`,
    {
      email,
      otp,
    }
  );

  return response.data;
};


// ==========================================
// FORGOT PASSWORD - RESET PASSWORD
// ==========================================

export const resetPassword = async ({
  email,
  newPassword,
  confirmPassword,
}) => {
  const response = await axios.post(
    `${API_URL}/api/auth/forgot-password/reset`,
    {
      email,
      newPassword,
      confirmPassword,
    }
  );

  return response.data;
};