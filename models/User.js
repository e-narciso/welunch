const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String},
  email: {type: String},
  password: {type: String},
  profileImage: { type: String },
  status: { type: String,
    enum : ["Pending Confirmation", "Active"],
    default: "Pending Confirmation"
},
  confirmationCode: { type: String },
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
