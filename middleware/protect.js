const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This runs BEFORE any protected route
// It checks if the user is logged in
const protect = async (req, res, next) => {
  let token;

  // Token comes in the request header like:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract just the token part
      token = req.headers.authorization.split(" ")[1];

      // Verify the token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move to the actual route
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = protect;