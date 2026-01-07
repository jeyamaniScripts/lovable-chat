require("dotenv").config();
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Auth-Service MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// ---------- User Schema (NO LOGIC CHANGE) ----------
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  pic: String,
});

const User = mongoose.model("User", userSchema);

// ---------- Load Proto ----------
const PROTO_PATH = path.join(__dirname, "proto/auth.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
});

const grpcObj = grpc.loadPackageDefinition(packageDef);
const AuthService = grpcObj.AuthService;

// ---------- gRPC Method ----------
async function ValidateToken(call, callback) {
  try {
    const token = call.request.token;
    if (!token) throw new Error("Token missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) throw new Error("User not found");

    callback(null, {
      userId: user._id.toString(),
      email: user.email,
    });
  } catch (err) {
    callback(err);
  }
}

// ---------- Start gRPC Server ----------
const grpcServer = new grpc.Server();

grpcServer.addService(AuthService.service, { ValidateToken });

grpcServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("✅ Auth-Service gRPC running on port 50051");
    grpcServer.start();
  }
);
