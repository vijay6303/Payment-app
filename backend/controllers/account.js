const { default: mongoose } = require("mongoose");
const Account = require("../models/account");

exports.getBalance = async (req, res) => {
  try {
    // get the userId from auth middleware
    const userId = req.userId;

    // Check the balance
    const account = await Account.findOne({ userId: userId });

    // return res
    res.status(200).json({
      balance: account.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.transferBalance = async (req, res) => {
  try {
    const { amount, to } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get sender's account
    const senderAccount = await Account.findOne({ userId: req.userId });
    if (!senderAccount || senderAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Get receiver's account
    const receiverAccount = await Account.findOne({ userId: to });
    if (!receiverAccount) {
      return res.status(400).json({
        success: false,
        message: "Receiver account not found",
      });
    }

    // Update sender's balance
    senderAccount.balance -= amount;
    await senderAccount.save();

    // Update receiver's balance
    receiverAccount.balance += amount;
    await receiverAccount.save();

    res.status(200).json({
      success: true,
      message: "Transfer successful",
      balance: senderAccount.balance,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({
      success: false,
      message: "Transfer failed",
    });
  }
};
