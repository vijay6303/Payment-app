import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const signup = async (firstname, lastname, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/signup`, {
      firstname,
      lastname,
      username: email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("SIGNUP RESPONSE:", response);

    if (response.status === 200) {
      return {
        success: true,
        message: "User created successfully",
        data: response.data
      };
    }
    
    return {
      success: false,
      message: response?.data?.message || "Something went wrong"
    };

  } catch (error) {
    console.log("SIGNUP API ERROR:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong"
    };
  }
};

export const signin = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/signin`, {
      username: email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("LOGIN RESPONSE:", response);

    if (response.status === 200) {
      const { token, user, balance } = response.data;
      // Store both token and user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        balance: balance
      }));
      
      return {
        success: true,
        data: {
          user,
          balance,
          token
        }
      };
    }

    return {
      success: false,
      message: "Login failed"
    };

  } catch (error) {
    console.log("LOGIN API ERROR:", error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Login failed"
    };
  }
};