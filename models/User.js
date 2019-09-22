const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String},
  password: {type: String},
  // isAdmin: { type: Boolean },
  // role: { type: String, enum: [ "regular", "employee", "admin" ] }
  // this would be the method for more than two roles
  // googleID: { type: String },
  profileImage: { type: String },
  followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
