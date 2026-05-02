const express    = require("express");
const cors       = require("cors");
const dotenv     = require("dotenv");
const connectDB  = require("./config/db");

dotenv.config();
connectDB(); // connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // lets us read JSON from requests

// Routes
app.use("/api/auth",    require("./routes/auth"));
app.use("/api/quizzes", require("./routes/quizzes"));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Quiz API is running ✅" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});