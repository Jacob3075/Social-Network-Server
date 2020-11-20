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
		required: true,
	},
	time: {
		type: Date,
		required: false,
		default: new Date(),
	},
	likes: {
		type: Number,
		required: false,
		default: 0,
	},
	comments: {
		type: Array,
		required: false,
		default: [],
	},
	image: {
		type: Buffer,
		required: false,
	},
});

PostSchema.query.byId = function (id) {
	return this.findOne({ _id: id });
};

PostSchema.query.byIds = function (ids) {
	return this.find().where("_id").in(ids);
};

PostSchema.query.byUser = function(userId) {
  return this.find({ userId });
};

PostSchema.query.byTopic = function (topicId) {
	return this.find({ topicId });
};

PostSchema.query.updateComments = function (postId, commentId) {
	return this.findOneAndUpdate({ _id: postId }, { $addToSet: { comments: commentId } });
};

const Post = mongoose.model("Post", PostSchema);

export default Post;
