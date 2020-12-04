import User from "../models/UserModel";

export default {

  findAll: async (request, response) => {
    await User.find()
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  findByUserName: async (request, response) => {
    const { userName } = request.params;

    await User.findOne()
      .byUserName(userName)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => {
        if (result) return response.status(200).send(result);
        else return response.status(404).send({ message: "NOT FOUND" });
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  findById: async (request, response) => {
    const { id } = request.params;

    await User.findOne()
      .byId(id)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => {
        if (result) return response.status(200).send(result);
        else return response.status(404).send({ message: "NOT FOUND" });
      })
      .catch(error => response.status(404).send({ message: "NOT FOUND", error: error }));
  },

  signUp: async (request, response) => {
    const { body } = request;
    const { userName, password } = body;

    const newUser = new User({ userName, password: User.generateHash(password) });

    await User.create(newUser)
      .then(result => response.status(201).send(result))
      .catch(error => {
        if (error.code === 11000) {
          return response.status(409).send({ message: "USERNAME ALREADY EXISTS", error: error });
        } else return response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error });
      });
  },

  signIn: async (request, response) => {
    const { body: { password, userName } } = request;

    await User.findOne()
      .byUserName(userName)
      .exec()
      .then(userFromDatabase => {
        if (!userFromDatabase) return response.status(404).send({ message: "INVALID USERNAME AND PASSWORD" });

        if (userFromDatabase.validatePassword(password)) {
          return response.status(200).send({
            message: "LOGGED IN",
            token: userFromDatabase.getAuthToken(),
            user: {
              id: userFromDatabase._id,
              followedTopics: userFromDatabase.followedTopics,
              registeredEvents: userFromDatabase.registeredEvents
            }
          });
        } else return response.status(401).send({ message: "INVALID USERNAME AND PASSWORD" });
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  addNewFollowedTopic: async (request, response) => {
    const { _id } = request.body.tokenData || request.body;
    const { topicId } = request.body;

    await User.find()
      .updateFollowedTopics(_id, topicId)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => {
        if (!result) return response.status(404).send({ message: "NOT FOUND", result });
        else return response.status(200).send(result);
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  addNewRegisteredEvent: async (request, response) => {
    const { id } = request.tokenData || request.body;
    const { eventId } = request.body;
    const unRegister = request.query.unRegister;
    console.log(request.tokenData);
    console.log(eventId);

    await User.find()
      .updateRegisteredEvents(id, eventId, unRegister)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => {
        if (!result) return response.status(404).send({ message: "NOT FOUND", result });
        else return response.status(200).send(result);
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  deleteById: async (request, response) => {
    await User.findByIdAndRemove(request.params.id, { useFindAndModify: false })
      .exec()
      .then(result => {
        if (result) return response.status(200).send({ message: "SUCCESS", response: result });
        else return response.status(404).send({ message: "USER NOT FOUND" });
      })
      .catch(error => response.status(404).send({ message: error }));
  }
};
