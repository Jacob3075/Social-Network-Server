import Post from "../models/PostModel";
import Comment from "../models/CommentModel";
import { readFileSync, unlinkSync } from "fs";

export default {
  findAll: async (request, response) => {
    await Post.find()
      .exec()
      .then((result) => response.status(200).send(result))
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR" }, error));
  },

  findById: async (request, response) => {
    await Post.find()
      .byId(request.params.id)
      .exec()
      .then((result) => {
        if (result) {
          return response.status(200).send(result);
        } else {
          return response.status(404).send({ message: "NOT FOUND" });
        }
      })
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findByIds: async (request, response) => {
    await Post.find()
      .byIds(request.body.ids)
      .exec()
      .then((result) => response.status(200).send(result))
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER", error }));
  },

  findByUser: async (request, response) => {
    await Post.find()
      .byUser(request.params.userId)
      .exec()
      .then((result) => response.status(200).send(result))
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findByTopic: async (request, response) => {
    const { topicId } = request.params;

    await Post.find()
      .byTopic(topicId)
      .exec()
      .then((result) => response.status(200).send(result))
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  findByTopics: async (request, response) => {

    await Post.find()
      .byTopics(request.body.topicIds)
      .exec()
      .then((result) => response.status(200).send(result))
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  },

  createPost: async (request, response) => {
    const { userId, topicId, description, userName, topicName } = request.body;
    const { path, mimetype } = request.file;

    const newPost = new Post({
      userId,
      topicId,
      description,
      userName,
      topicName,
      image: { data: readFileSync(path), contentType: mimetype }
    });

    await Post.create(newPost)
      .then((result) => response.status(201).send(result))
      .catch((error) => response.status(500).send({ message: "ERROR CREATING POST", error }));

    unlinkSync(path);
  },

  addNewComment: async (request, response) => {
    const { userId } = request.body.tokenData || request.body;
    const { comment, postId, userName } = request.body;

    const newComment = new Comment({ userId, postId, comment, userName });

    const addCommentToPost = async (savedComment) => {
      await Post.find()
        .updateComments(postId, savedComment)
        .exec()
        .then((result) => {
          if (result) {
            return response.status(201).send({ newComment: savedComment, post: result });
          } else {
            return response
              .status(404)
              .send({ message: "NOT FOUND", result, newComment: savedComment });
          }
        })
        .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR: addCommentToPost", error }));
    };

    await Comment.create(newComment)
      .then(addCommentToPost)
      .catch((error) => response.status(500).send({ message: "ERROR CREATING COMMENT", error }));
  },

  updateLikes: async (request, response) => {
    const { userId } = request.body.tokenData || request.body;
    const { postId } = request.body;
    const unLike = request.query.unLike;

    await Post.find()
      .updateLikedUsers(postId, userId, !!unLike)
      .exec()
      .then((result) => {
        if (result) {
          return response.status(200).send(result);
        } else {
          return response.status(404).send({ message: "NOT FOUND", result });
        }
      })
      .catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
  }
};
