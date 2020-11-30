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
		await Post.find()
			.byTopic(request.params.topicId)
			.page(request.query.pageNumber, request.query.pageSize)
			.exec()
			.then((result) => response.status(200).send(result))
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},
	findByTopics: async (request, response) => {
		const pageNumber = parseInt(request.query.pageNumber || "1");
		const pageSize = parseInt(request.query.pageSize || "15");

		await Post.find()
			.byTopics(request.body.topicIds)
			.page(pageNumber, pageSize)
			.exec()
			.then((result) => response.status(200).send(result))
			.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
	},

	createPost: async (request, response) => {
		const { userId, topicId, description } = request.body;
		const { path, mimetype } = request.file;

		const newPost = new Post({
			userId,
			topicId,
			description,
			image: { data: readFileSync(path), contentType: mimetype },
		});

		await Post.create(newPost)
			.then((result) => response.status(201).send(result))
			.catch((error) => response.status(500).send({ message: "ERROR CREATING POST", error }));

		unlinkSync(path);
	},

	addNewComment: async (request, response) => {
		const { userId } = request.body.tokenData || request.body;
		const { comment, postId } = request.body;

		const newComment = new Comment({ userId, postId, comment });

		const addCommentToPost = async (savedComment) => {
			await Post.find()
				.updateComments(postId, savedComment._id)
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
				.catch((error) => response.status(500).send({ message: "INTERNAL SERVER ERROR", error }));
		};

		await Comment.create(newComment)
			.then(addCommentToPost)
			.catch((error) => response.status(500).send({ message: "ERROR CREATING COMMENT", error }));
	},
};
