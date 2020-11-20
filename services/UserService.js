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
    await User.findOne()
      .byUserName(request.params.userName)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => {
        if (result) return response.status(200).send(result);
        else return response.status(404).send({ message: "NOT FOUND" });
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  findById: async (request, response) => {
    await User.findOne()
      .byId(request.params.id)
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

    console.log(userName, password);

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
    const { body } = request;

    await User.findOne()
      .byUserName(body.userName)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(userFromDatabase => {
        if (!userFromDatabase) return response.status(404).send({ message: "INVALID USERNAME AND PASSWORD" });

        if (userFromDatabase.validatePassword(body.password)) {
          return response.status(200).send({ message: "LOGGED IN", token: userFromDatabase.getAuthToken() });
        } else return response.status(401).send({ message: "INVALID USERNAME AND PASSWORD" });
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  addNewFollowedTopic: async (request, response) => {
    const { _id } = request.body.tokenData || request.body;

    await User.find()
      .updateFollowedTopics(_id, request.body.topicId)
      .select("userName followedTopics registeredEvents")
      .exec()
      .then(result => {
        if (!result) return response.status(404).send({ message: "NOT FOUND", result });
        else return response.status(200).send(result);
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  addNewRegisteredEvent: async (request, response) => {
    const { _id } = request.body.tokenData || request.body;

    await User.find()
      .updateRegisteredEvents(_id, request.body.eventId)
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
