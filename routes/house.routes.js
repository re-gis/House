const express = require("express");
const {
  postHouse,
  postVideoUpload,
  getPost,
  getOwner,
  updatePost,
  deletePost,
  getPosts,
} = require("../controllers/post.Controllers");
const { protect, role } = require("../middlewares/admin.Middleware");
const router = express.Router();

// Posting a house video
router.post("/", protect, role("agent"), postHouse);

// Video upload route
router.put("/upload/:id", protect, role("agent"), postVideoUpload);

// Getting the post router
router.get("/post/:id", getPost);

// Getting the posts
router.get("/post/agent/:id", getPosts);

// Paying the communication fee

// Getting the user credentials
router.get("/post/:id/owner", getOwner);

// Post update
router.put("/post/:id", protect, role("agent", "admin"), updatePost);

// Deleting the post (Must be protected to role of admin and agent only!)
router.delete("/post/:id", protect, role("admin", "agent"), deletePost);

module.exports.houseRouter = router;
