require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/items");

const app = express();
app.use(cors());
app.use(express.json());

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "DB connection failed", error: err.message });
  }
});

app.get("/", (req, res) => res.send("Item Manager API is running"));
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;