const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "../proto/auth.proto");

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
});

const grpcObj = grpc.loadPackageDefinition(packageDef);
const AuthService = grpcObj.AuthService;

const client = new AuthService(
  "localhost:50051", // auth-service
  grpc.credentials.createInsecure()
);

module.exports = client;
