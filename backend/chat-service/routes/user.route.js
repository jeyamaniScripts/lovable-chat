const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/user.controller.js");
const protect = require("../middleware/authMiddleware.js");

// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// router.route("/").get(protect, allUsers);
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
