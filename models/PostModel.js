import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  topicId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: false,
    default: new Date()
  },
  likes: {
    type: Number,
    required: false,
    default: 0
  },
  comments: {
    type: Array,
    required: false,
    default: []
  },
  image: {
    type:Buffer,
    required: true,
  }
});

PostSchema.query.byId = function(id) {
  return this.find({ _id: id });
};

PostSchema.query.byIds = function(ids) {
  return this.find().where("_id").in(ids);
};

PostSchema.query.byUser = function(userId) {
  return this.find({ userId });
};

PostSchema.query.byTopic = function(topicId) {
  return this.find({ topicId });
};

const Post = mongoose.model("Post", PostSchema);

export default Post;
