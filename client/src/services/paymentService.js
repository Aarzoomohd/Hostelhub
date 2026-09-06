import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// CREATE PAYMENT
export const createPayment = async (paymentData, token) => {
  const response = await axios.post(
    `${API_URL}/api/payment`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// GET ALL PAYMENTS
export const getPayments = async (token) => {
  const response = await axios.get(
    `${API_URL}/api/payment`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// GET SINGLE PAYMENT
export const getPaymentById = async (paymentId, token) => {
  const response = await axios.get(
    `${API_URL}/api/payment/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// UPDATE PAYMENT
export const updatePayment = async (
  paymentId,
  paymentData,
  token
) => {
  const response = await axios.put(
    `${API_URL}/api/payment/${paymentId}`,
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// DELETE PAYMENT
export const deletePayment = async (paymentId, token) => {
  const response = await axios.delete(
    `${API_URL}/api/payment/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};