import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
	{
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
		likedUsers: {
			type: Array,
			required: false,
			default: []
		},
		comments: {
			type: Array,
			required: false,
			default: []
		},
		image: {
			data: Buffer,
			contentType: String
		}
	},
	{
		timestamp: true
	}
);

PostSchema.query.byId = function(id) {
	return this.findOne({ _id: id });
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

PostSchema.query.byTopics = function(topicIds) {
	return this.find().where("topicId").in(topicIds);
};

PostSchema.query.updateComments = function(postId, commentId) {
	return this.findOneAndUpdate({ _id: postId }, { $addToSet: { comments: commentId } });
};

PostSchema.query.updateLikedUsers = function(postId, userId, unLike) {
	if (unLike) {
		return this.findOneAndUpdate({ _id: postId }, { $pull: { likedUsers: userId } });
	} else {
		return this.findOneAndUpdate({ _id: postId }, { $addToSet: { likedUsers: userId } });
	}
};

PostSchema.query.page = function(pageNumber, pageSize) {
	return this.sort({ createdAt: "desc" })
		.limit(pageSize)
		.skip((pageNumber - 1) * pageSize);
};

const Post = mongoose.model("Post", PostSchema);

export default Post;
