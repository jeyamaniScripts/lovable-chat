const authClient = require("./grpcAuthClient");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  // Call AUTH-SERVICE via gRPC
  authClient.ValidateToken({ token }, (err, response) => {
    if (err) {
      console.error("Auth-service error:", err.message);
      return res.status(401).json({ message: "Unauthorized" });
    }

    // IMPORTANT: keep same shape your controllers expect
    req.user = {
      _id: response.userId,
      email: response.email,
    };

    next();
  });
};

module.exports = authMiddleware;
