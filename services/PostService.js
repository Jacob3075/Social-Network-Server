import Post from "../models/PostModel";

export default {
  findAll: async (request, response) => {
    await Post.find()
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR" }, error));
  },

  findById: async (request, response) => {
    await Post.find()
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

  findByIds: async (request, response) => {
    await Post.find()
      .byIds(request.body.ids)
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER", error }));
  },

  findByUser: async (request, response) => {
    await Post.find()
      .byUser(request.params.userId)
      .exec()
      .then(result => response.status(200).send(result))
      .catch(error => response.status(500).send({ message:"INTERNAL SERVER ERROR", error }));
  },

  createPost: async (request, response) => {
    const { userId, topicId, description } = request.body;
    const newPost = new Post({ userId, topicId, description });

    await Post.create(newPost)
      .then(result => response.status(201).send(result))
      .catch(error => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  }
};
