const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'https://payments-app-dusky.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const userRoutes = require("./routes/userRoutes");
const accountRoutes = require("./routes/accountRoutes");

app.use(express.json());
require("dotenv").config();

const dbConnect = require("./config/db");
dbConnect();

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/account", accountRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Your server is up and running..." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
