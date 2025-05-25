import { apiConnector } from '../apiConnector';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getUsers = async () => {
  try {
    const response = await apiConnector('GET', '/user/bulk');
    return response;
  } catch (error) {
    console.log("Getusers error...", error.message);
    return { success: false, message: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiConnector('GET', '/user/getCurrentUser');
    return response;
  } catch (error) {
    console.log("get user error...", error.message);
    return { success: false, message: error.message };
  }
};

export const updateCredentials = async (token, data) => {
  try {
    const response = await apiConnector('PUT', '/user', data, token);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.log("Update credentials error...", error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || "Update failed"
    };
  }
};
