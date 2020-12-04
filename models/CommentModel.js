import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  userId:{
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userName:String,
  postId:{
    type: mongoose.Types.ObjectId,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: false,
    default: new Date(),
  },
})

CommentSchema.query.byId = function(id) {
  return this.find({ _id: id });
};

CommentSchema.query.byIds = function(ids) {
  return this.find().where("_id").in(ids);
};

CommentSchema.query.byUser = function(userId) {
  return this.find({ userId });
};

CommentSchema.query.byPost = function(postId) {
  return this.find({ postId });
};

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
