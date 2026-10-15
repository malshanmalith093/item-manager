const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/items");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Item Manager API is running"));
app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Run a normal server on your computer, but not on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;