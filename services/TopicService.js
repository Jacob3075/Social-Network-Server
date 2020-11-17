import Topic from "../models/TopicModel";

export default {
  findAll: async (request, response) => {
    await Topic.find()
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findById: async (request, response) => {
    await Topic.find()
      .byId(request.params.id)
      .exec()
      .then(result => {
        if (result) {
          return response.status(200).send(result);
        } else {
          return response.status(404).send({ message: "NOT FOUND" });
        }
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findByTopicName: async (request, response) => {
    await Topic.find()
      .byTopicName(request.params.topicName)
      .exec()
      .then(result => {
        if (result) {
          return response.status(200).send(result);
        } else {
          return response.status(404).send({ message: "NOT FOUND" });
        }
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findByCreatedUserId: async (request, response) => {
    await Topic.find()
      .byCreatedUserId(request.params.createdUserId)
      .exec()
      .then(result => {
        if (result) {
          return response.status(200).send(result);
        } else {
          return response.status(404).send({ message: "NOT FOUND" });
        }
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findAllByIds: async (request, response) => {
    await Topic.find()
      .byIds(request.body.ids)
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  createTopic: async (request, response) => {
    const { topicName, description } = request.body;

    const newTopic = new Topic({ topicName, description });

    await Topic.create(newTopic)
      .then(result => response.status(201).send(result))
      .catch(error => {
        if (error.code === 11000) {
          return response.status(409).send({ message: "TOPIC ALREADY EXISTS", error})
        }
        return response.status(500).send({ message: "INTERNAL SERVER ERROR", error });
      });
  }
};
