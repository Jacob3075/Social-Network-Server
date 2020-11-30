import Event from "../models/EventModel";
import { readFileSync, unlinkSync } from "fs";

export default {
	findAll: async (request, response) => {
		await Event.find()
			.exec()
			.then((result) => response.status(200).send(result))
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	findById: async (request, response) => {
		await Event.find()
			.byId(request.params.id)
			.exec()
			.then((result) => {
				if (result) {
					return response.status(200).send(result);
				} else {
					return response.status(404).send({ message: "NOT FOUND", result });
				}
			})
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	findByIds: async (request, response) => {
		await Event.find()
			.byIds(request.body.ids)
			.exec()
			.then((result) => response.status(200).send(result))
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	findByTopics: async (request, response) => {
		await Event.find()
			.byTopics(request.body.topicIds)
			.exec()
			.then((result) => response.status(200).send(result))
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	findByUser: async (request, response) => {
		await Event.find()
			.byUser(request.params.id)
			.exec()
			.then((result) => {
				if (result) {
					return response.status(200).send(result);
				} else {
					return response.status(404).send({ message: "NOT FOUND", result });
				}
			})
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	findByTopic: async (request, response) => {
		await Event.find()
			.byTopic(request.params.id)
			.exec()
			.then((result) => {
				if (result) {
					return response.status(200).send(result);
				} else {
					return response.status(404).send({ message: "NOT FOUND", result });
				}
			})
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	createEvent: async (request, response) => {
		const { userId, topicId, name, description, location } = request.body;
		const { path, mimetype } = request.file;

		const newEvent = await Event({
			userId,
			topicId,
			name,
			description,
			location,
			image: { data: readFileSync(path), contentType: mimetype },
		});

		await Event.create(newEvent)
			.then((result) => response.status(201).send(result))
			.catch((error) => response.status(500).send({ message: "ERROR CREATING EVENT", error }));

		unlinkSync(path);
	},

	updateRegistered: async (request, response) => {
		const { eventId } = request.body;

		await Event.find()
			.incrementRegistered(eventId)
			.exec()
			.then((result) => {
				if (result) {
					return response.status(200).send({ message: "UPDATED", result });
				} else {
					return response.status(404).send({ message: "NOT FOUND", result });
				}
			})
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},
};
