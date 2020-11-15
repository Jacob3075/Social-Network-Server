import User from "../models/UserModel";

export default {

  findAll: async (request, response) => {
    await User.find()
      .select("username, email")
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  findByEmail: async (request, response) => {
    await User.findOne()
      .byEmail(request.params.email)
      .select("username, email")
      .exec()
      .then(result => {
        if (result) {
          return response.status(200).send(result);
        } else {
          return response.status(404).send({ message: "NOT FOUND" });
        }
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  findById: async (request, response) => {
    await User.findOne()
      .byId(request.params.id)
      .select("username, email")
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(404).send({ message: "NOT FOUND", error: error }));
  },

  signUp: async (request, response) => {
    const { body } = request;
    const { username, password, email } = body;

    const newUser = new User({ username, password, email: email.toLowerCase() });

    await User.create(newUser)
      .exec()
      .then(result => response.status(201).send(result))
      .catch(error => {
        if (error.code === 11000) {
          return response.status(409).send({ message: "EMAIL ALREADY EXISTS", error: error });
        } else {
          return response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error });
        }
      });
  },

  signIn: async (request, response) => {
    const { body } = request;

    await User.findOne()
      .byEmail(body.email)
      .exec()
      .then(userFromDatabase => {
        if (userFromDatabase.validatePassword(body.password)) {
          return response.status(200).send({ message: "LOGGED IN", token: userFromDatabase.getAuthToken() });
        } else {
          return response.status(401).send({ message: "INVALID EMAIL AND PASSWORD" });
        }
      })
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error: error }));
  },

  deleteById: async (request, response) => {
    await User.findByIdAndRemove(request.params.id, { useFindAndModify: false })
      .exec()
      .then(result => {
        if (result) {
          return response.status(200).send({ message: "SUCCESS", response: result });
        } else {
          return response.status(404).send({ message: "USER NOT FOUND" });
        }
      })
      .catch(error => response.status(404).send({ message: error }));
  }
};
