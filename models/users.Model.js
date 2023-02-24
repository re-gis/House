const mongoose = require("mongoose");
const ClientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role : {
      type: String,
      required: true,
      default: 'client'
    },
    admin_id:{
      type:mongoose.Types.ObjectId
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", ClientSchema);
