const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  body: {type: String},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
  likes: {type: Number},
  likedBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
  image: { type: String },
  creatorName: {type: String},
  creatorID: {type: Schema.Types.ObjectId, ref: 'User'},
  type: { type: String, enum : ["Recipe", "Ingredient", "Meal"]},
  date: { type: Date, default: Date.now },
  meta: { likes: Number },
  timestamps: { type: Boolean,
    default: true
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;