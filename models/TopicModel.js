import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  createdUserId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  topicName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    unique: false
  }
});

TopicSchema.query.byId = function(id) {
  return this.findOne({ _id: id });
};

TopicSchema.query.byCreatedUserId = function(userId) {
  return this.find({ createdUserId: userId });
};

TopicSchema.query.byIds = function(ids) {
  return this.find().where("_id").in(ids);
};

TopicSchema.query.byTopicName = function(topicName) {
  return this.findOne({ topicName: topicName });
};

const Topic = mongoose.model("Topic", TopicSchema);

export default Topic;
