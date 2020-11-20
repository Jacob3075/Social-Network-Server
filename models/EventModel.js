import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
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
		required: false,
		default: new Date(),
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
		type: Buffer,
		required: false,
	},
});

EventSchema.query.byId = function (id) {
	return this.findOne({ _id: id });
};

EventSchema.query.byIds = function (ids) {
	return this.find().where("_id").in(ids);
};

EventSchema.query.byUser = function (userId) {
	return this.findOne({ userId });
};

EventSchema.query.byTopic = function (topicId) {
	return this.findOne({ topicId });
};

const Event = mongoose.model("Event", EventSchema);

export default Event;
