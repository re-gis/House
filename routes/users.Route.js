const express = require("express");
const {
  clientSign,
  emailVerify,
  clientLogin,
  agentSign,
} = require("../controllers/users.Controller");
const { role, protect } = require("../middlewares/admin.Middleware");
const router = express.Router();
const { googleAuth, authFailure, succeccFailureAuth } = require("../controllers/google.auth");


// Public signup
router.post("/sign", clientSign);

// Email verification
router.get("/verify/:id/:token", emailVerify);

// Public login
router.post("/login", clientLogin);

// Agent signup
router.post("/agentSign", protect, role("admin"), agentSign);

// GoogleAuth
router.get("/auth/google", googleAuth);

// Google login
router.get('/google/callback', succeccFailureAuth)

// GoogleAuth error
router.get("/auth/failure", authFailure);

module.exports = router;
