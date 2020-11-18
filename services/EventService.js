import Event from "../models/EventModel";

export default {
  findAll: async (request, response) => {
    await Event.find()
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },
};
