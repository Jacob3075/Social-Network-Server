import Post from "../models/PostModel";

export default {
  findAll: async (request, response) => {
    await Post.find()
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR" }, error));
  },
};
