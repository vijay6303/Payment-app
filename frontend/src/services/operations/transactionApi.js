import { apiConnector } from '../apiConnector';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getBalance = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        balance: 10000, // Default balance if no token
        message: "No authentication token"
      };
    }

    const response = await apiConnector(
      'GET', 
      '/account/balance',
      null,
      token
    );

    return {
      success: true,
      balance: response.balance || 10000
    };
  } catch (error) {
    console.log("Getbalance error...", error?.message);
    return {
      success: false,
      balance: 10000, // Default balance if API fails
      message: error?.message || "Failed to fetch balance"
    };
  }
};

export const sendMoney = async (amount, to, token) => {
  try {
    const response = await apiConnector(
      "POST",
      '/account/transfer',
      { 
        amount: parseInt(amount),
        to: to.toString()
      },
      token
    );

    return {
      success: response.success,
      message: response.message,
      balance: response.balance
    };
  } catch (error) {
    console.log("Send money error...", error.message);
    return {
      success: false,
      message: error?.response?.data?.message || "Transfer failed"
    };
  }
};
