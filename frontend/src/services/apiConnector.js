import axios from 'axios';

export const apiConnector = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${import.meta.env.VITE_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...(data && { data })
    };

    console.log("API Request Config:", {
      method: config.method,
      url: config.url,
      headers: config.headers
    });

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API Error:", error?.response?.data || error.message);
    throw error;
  }
};
