import mongoose from "mongoose";

const EventSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		topicId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
		time: {
			type: Date,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		registered: {
			type: Number,
			required: false,
			default: 0,
		},
		image: {
			data: Buffer,
			contentType: String,
		},
	},
	{ timestamp: true }
);

EventSchema.query.byId = function (id) {
	return this.findOne({ _id: id });
};

EventSchema.query.byIds = function (ids) {
	return this.find({ $gte: new Date() }).where("_id").in(ids);
};

EventSchema.query.byTopics = function (topicIds) {
	return this.find({ $gte: new Date() }).where("topicId").in(topicIds);
};

EventSchema.query.incrementRegistered = function (eventId) {
	return this.findOneAndUpdate({ _id: eventId }, { $inc: { registered: 1 } });
};

EventSchema.query.byUser = function (userId) {
	return this.find({ userId });
};

EventSchema.query.byTopic = function (topicId) {
	return this.find({ topicId });
};

const Event = mongoose.model("Event", EventSchema);

export default Event;
