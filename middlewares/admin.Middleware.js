const Client = require("../models/users.Model");
const jwt = require("jsonwebtoken");
const protect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      //Getting the token from the header
      token = req.headers.authorization.split(" ")[1];

      //Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.id);

      //Get the id from the verified token

      req.user = await Client.findById(decoded.id).select("-password");
      console.log(req.user);
      next();
    } else {
      return res.json({
        message: "Not authorized",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

const role = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(401).json({
        message: "Not authorised to perform this action!",
      });
    }
  };
};
module.exports = {
  role,
  protect,
};
