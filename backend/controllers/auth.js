const jwt = require("jsonwebtoken");
const Zod = require("zod");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Account = require("../models/account");
require("dotenv").config();

// Using Zod to validate signup data
const signupData = Zod.object({
  username: Zod.string().email(),
  password: Zod.string().min(6, "Password must be at least 6 characters long"),
  firstname: Zod.string(),
  lastname: Zod.string(),
});

exports.signup = async (req, res) => {
  try {
    // Get the data from req body
    const { username, password, firstname, lastname } = req.body;

    // Validate data using Zod
    const validatedInputs = signupData.safeParse({
      username,
      password,
      firstname,
      lastname,
    });

    if (!validatedInputs.success) {
      return res.status(411).json({ message: "Incorrect inputs" });
    }

    // If user already exists
    if (await User.findOne({ username: username })) {
      return res.status(411).json({ message: "Email already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save the user entryu in DB
    const user = await User.create({
      username: username,
      firstname: firstname,
      lastname: lastname,
      password: hashedPassword,
    });

    // Create an account with fixed balance
    const account = await Account.create({
      userId: user._id,
      balance: 10000  // Fixed virtual balance for new users
    });

    // Generate token for the new user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ 
      message: "User created successfully",
      token: token,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
      },
      balance: account.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Using Zod to validate inputs
const signinData = Zod.object({
  username: Zod.string().email(),
  password: Zod.string(),
});

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate inputs using Zod
    const validatedInputs = signinData.safeParse({ username, password });
    if (!validatedInputs.success) {
      return res.status(411).json({
        success: false,
        message: "Error while logging in"
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Find user's account or create new one with fixed balance
    let account = await Account.findOne({ userId: user._id });
    if (!account) {
      account = await Account.create({
        userId: user._id,
        balance: 10000  // Fixed virtual balance for users without an account
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token: token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname
      },
      balance: account.balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
