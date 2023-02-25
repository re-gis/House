const path = require("path");
const { cloudinary } = require("../cloudinary/cloudinary");
const dotenv = require("dotenv").config();
const { Post } = require("../models/post.Model");
const Client = require("../models/users.Model");

//create post
const postHouse = async (req, res) => {
  try {
    const agentId = req.user._id;
    const { location, description, type } = req.body;
    //validation
    if (!location || !description || !type) {
      return res.status(400).json({
        success: false,
        message: "all field are required.",
      });
    }
    const house = new Post({
      agentId,
      location,
      description,
      type,
    });
    await house.save();
    return res.status(201).json({
      success: true,
      message: "house posted.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
};

//uploading post image using cloudinary
const postVideoUpload = async (req, res) => {
  try {
    //checking if user exists
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: `post with id: ${req.params.id} not found`,
      });
    } else {
      if (!req.files)
        return res.status(400).json({
          success: false,
          message: "Please upload a video",
        });
      else {
        const file = req.files.video;
        // console.log(file.mimetype.startsWith("video"));
        //make sure that uploaded file is an image
        if (!file.mimetype.startsWith("video"))
          return res.status(400).json({
            success: false,
            message: "please upload a video file",
          });
        //checking photo size
        // if (file.size > process.env.MAX_FILE_SIZE)
        //     return res.status(400).json({
        //         success: false,
        //         message: `please upload an image less than ${process.env.MAX_FILE_SIZE}`,
        //     });
        //customizing image name to avoid overwriting
        file.name = `video_${req.params.id}${path.parse(file.name).ext}`;
        //checking if post has cloudinar id
        if (post.cloudinary_id == null) {
          cloudinary.uploader
            .upload(file.tempFilePath)
            .then((result) => {
              const body = {
                video: result.secure_url,
                cloudinary_id: result.public_id,
              };
              //updating post
              Post.findByIdAndUpdate(
                req.params.id,
                {
                  image: body.video,
                  cloudinary_id: body.cloudinary_id,
                },
                {
                  new: true,
                },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    return res.status(200).json({
                      success: true,
                      message: "video uploaded",
                      data: doc,
                    });
                  }
                }
              );
            })
            .catch((err) => console.log("cloudinary", err));
        } else {
          cloudinary.uploader
            .destroy(post.cloudinary_id)
            .then((response) => {
              cloudinary.uploader
                .upload(file.tempFilePath)
                .then((result) => {
                  const body = {
                    video: result.secure_url,
                    cloudinary_id: result.public_id,
                  };
                  Post.findByIdAndUpdate(
                    req.params.id,
                    {
                      image: body.video,
                      cloudinary_id: body.cloudinary_id,
                    },
                    {
                      new: true,
                    },
                    (err, doc) => {
                      if (err) {
                        console.log(err);
                      } else {
                        return res.status(200).json({
                          success: true,
                          message: "image updated",
                          data: doc,
                        });
                      }
                    }
                  );
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Getting all posts
const getPosts = async (req, res) => {
  let posts = await Post.find({ agentId: req.params.id });
  if (posts) {
    console.log("nice");
  } else {
    console.log("Nope");
  }
};

// Getting the post using the id
const getPost = async (req, res) => {
  // Getting the id from the request
  let post = await Post.findById(req.params.id);
  if (!post) {
    res.json({ message: `No Post with ${post} ` });
  } else {
    let agentId = post.agentId;
    let Owner = await Client.findById(agentId);
    res.json({
      Location: post.location,
      Description: post.description,
      Housetype: post.type,
      Owner: Owner.name,
    });
  }
};

// Get the owner of the house
const getOwner = async (req, res) => {
  // The credentials will be given once the client sends communication fee
  let postId = req.params.id;

  // Get the post and the agentId for his/her credentials
  let post = await Post.findById(postId);
  let owner = await Client.findById(post.agentId);

  // Display the name, email, contact and country
  res.json({
    Name: owner.name,
    Email: owner.email,
    Contact: owner.phone,
  });
};

// Update the post
const updatePost = async (req, res) => {
  let postId = req.params.id;
  let post = await Post.findById(postId);
  res.json(post);
};

// Deleting the house post
const deletePost = async (req, res) => {
  let postId = req.params.id;
  // Check if the post exists
  let postExists = await Post.findById(postId);
  if (postExists) {
    // Check if it is available
    if (postExists.taken == "Available") {
      // Delete the post
      let deletedPost = await Post.findByIdAndRemove(postId);
      if (deletedPost) {
        res.json({ message: `Post ${postId} is Deleted!` });
      } else {
        res.json({ message: "An error occurred!" });
      }
    } else {
      console.log("Nope");
    }
  } else {
    res.json({ message: `${postId} not found!` });
  }
};

module.exports = {
  postVideoUpload,
  postHouse,
  getPost,
  getOwner,
  updatePost,
  deletePost,
  getPosts,
};
