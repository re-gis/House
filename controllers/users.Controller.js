const Client = require("../models/users.Model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../models/users.Token");
const { sendEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");



// @access PUBLIC
// Public signup
const clientSign = async (req, res) => {
  const { name, email, password, confirmPass, phone, country, role } = req.body;

  // Check if all user credentials are given
  if (!name || !email || !password || !confirmPass || !phone || !country) {
    res.json({ message: "All inputs are required!" });
  } else {
    // Check if the email already exists
    let exists = await Client.findOne({ email });
    if (exists) {
      return res.json({ message: `${email} already exists!` });
    } else {
      // Check if the passwords match
      if (password !== confirmPass) {
        return res.json({ message: "Please confirm password" });
      } else {
        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);
        let user = await Client.create({
          name,
          role,
          email,
          password: hashedPass,
          country,
          phone,
        });

        // Make a token for the user to save to database
        let token = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });

        const message = `${process.env.BASE_URL}/api/v1/users/verify/${user._id}/${token.token}`;
        // Send the link
        emailSent = await sendEmail(user.email, "Verify Email", message);
        console.log("Email sent");
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          jwToken: generateToken(user._id),
          message: "Email sent to your account!",
        });
      }
    }
  }
};



//agent
const agentSign = async (req, res) => {
  const { name, email, password, confirmPass, phone, country } = req.body;

  // Check if all user credentials are given
  if (!name || !email || !password || !confirmPass || !phone || !country) {
    res.json({ message: "All inputs are required!" });
  } else {
    // Check if the email already exists
    let exists = await Client.findOne({ email });
    if (exists) {
      return res.json({ message: `${email} already exists!` });
    } else {
      // Check if the passwords match
      if (password !== confirmPass) {
        return res.json({ message: "Please confirm password" });
      } else {
        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);
        let user = await Client.create({
          name,
          role: "agent",
          email,
          password: hashedPass,
          country,
          phone,
        });

        // Make a token for the user to save to database
        let token = await Token.create({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });

        const message = `${process.env.BASE_URL}/api/v1/users/verify/${user._id}/${token.token}`;
        // Send the link
        emailSent = await sendEmail(user.email, "Verify Email", message);
        console.log("Email sent");
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          admin_id: req.user._id,
          phone: user.phone,
          country: user.country,
          message: "Email sent to your account!",
        });
      }
    }
  }
};



// Email verification
const emailVerify = async (req, res) => {
  let user = await Client.findOne({ _id: req.params.id });
  if (!user) {
    res.json({ message: "Invalid link" });
  } else {
    let token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      res.json({ message: "Invalid link!" });
    } else {
      let updatedUser = await Client.findByIdAndUpdate(user._id, {verified: true});
      let deleteToken = await Token.findByIdAndRemove(token._id);
      if (updatedUser && deleteToken) {
        res.json({ message: "Email verified!" });
      }
    }
  }
};



// Public login 
const clientLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  // Check if the credentials are given
  if (!email || !password) {
    res.json({ message: "Please all credentials are required!" });
  } else {
    // Check if the user account exists
    let user = await Client.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if the email is verified
      if (user.verified === true) {
        res.json({
          name: user.name,
          email,
          token: generateToken(user._id),
          role: user.role
        });
      } else {
        res.json({ message: "Please verify your email!" });
      }
    } else {
      res.json({ message: "Email or Password Incorrect!" });
    }
  }
};



// JWToken generating
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};



// Cookie validate
const validateCookie = async (req, res, next) => {
  const { cookies } = req;
  if ("Client" in cookies) {
    // Check if the cookie matches the user logging in
    jwt.verify(
      req.cookies.Client,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log(err);
        } else {
          let decodedId = decoded.id;
          let user = await Client.findOne({ decodedId });
          if (user) {
            next();
          } else {
            res.json({ message: "Not authorised!" });
          }
        }
      }
    );
  } else {
    res.json({ message: "Login first!" });
  }
};







module.exports = {
  clientSign,
  emailVerify,
  clientLogin,
  validateCookie,
  agentSign,
};
