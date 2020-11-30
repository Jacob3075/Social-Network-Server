import app from "../app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

describe("Testing Posts Endpoints", () => {
	describe("Getting Posts", () => {
		it("Should get all posts", async (done) => {
			const response = await request.get("/posts");

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(response.body).toBeTruthy();
			expect(Array.isArray(response.body)).toBeTruthy();
			response.body.forEach((post) => {
				expect(post).toHaveProperty("userId");
				expect(post).toHaveProperty("topicId");
				expect(post).toHaveProperty("description");
				expect(post).toHaveProperty("comments");
				expect(post).toHaveProperty("likes");
				expect(post).toHaveProperty("time");
				expect(Array.isArray(post.comments)).toBeTruthy();
			});

			done();
		});

		it("Should get post by id", async (done) => {
			const postId = "5fb63e8e947ec02b0f8b7780";

			const response = await request.get("/posts/id/" + postId);

			console.log(response.body);

			expect(response.status).toBe(200);
			expect(response.body).toBeTruthy();
			expect(response.body).toHaveProperty("_id", postId);
			expect(response.body).toHaveProperty("description");
			expect(response.body).toHaveProperty("userId");
			expect(response.body).toHaveProperty("topicId");

			done();
		});

		it("Should get posts by ids", async (done) => {
			const ids = [
				"5fb63e8e947ec02b0f8b7780",
				"5fb6471a6054e13b4d936bb9",
				"5fb647286ee5fd3b7bd7f4a8",
				"5fb6472c8fb55c3ba54dd504",
				"5fb647396a761e3bb939260d",
			];

			const response = await request.post("/posts/id").send({ ids });

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(response.body).toBeTruthy();
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toBe(ids.length);
			response.body.forEach((post) => {
				expect(post).toHaveProperty("userId");
				expect(post).toHaveProperty("topicId");
				expect(post).toHaveProperty("description");
			});

			done();
		});

		it("Should get posts by user", async (done) => {
			const userId = "5fb1fe18120bbf452438078c";
			const response = await request.get("/posts/user/" + userId);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(response.body).toBeTruthy();
			expect(Array.isArray(response.body)).toBeTruthy();
			response.body.forEach((post) => {
				expect(post).toHaveProperty("userId", userId);
				expect(post).toHaveProperty("topicId");
				expect(post).toHaveProperty("description");
			});

			done();
		});

		it("Should get posts by topic", async (done) => {
			const topicId = "4ba4262a2dee0d31529123fe";
			const response = await request.get("/posts/topic/" + topicId);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			response.body.forEach((post) => {
				expect(post).toHaveProperty("topicId", topicId);
				expect(post).toHaveProperty("userId");
				expect(post).toHaveProperty("description");
			});

			done();
		});
	});

	it("Should get posts by topic ids", async (done) => {
		const topicIds = ["5fc49f14a45bfa10ac449a1c"];

		const response = await request.post("/posts/topic").send({ topicIds });

		console.log(response.body);

		expect(response.statusCode).toBe(200);
		expect(response.body).toBeTruthy();
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBeGreaterThanOrEqual(topicIds.length);
		response.body.forEach((post) => {
			expect(post).toHaveProperty("userId");
			expect(post).toHaveProperty("topicId");
			expect(post).toHaveProperty("description");
		});

		done();
	});

	it("Should get posts by topic ids with pagination", async (done) => {
		const topicIds = ["5fc49f14a45bfa10ac449a1c", "5fc49f7045e98411d8bb3d77"];
		const pageNumber = 1;
		const pageSize = 2;

		const response = await request
			.post(`/posts/topic?pageNumber=${pageNumber}&pageSize=${pageSize}`)
			.send({ topicIds });

		console.log(response.body);

		expect(response.statusCode).toBe(200);
		expect(response.body).toBeTruthy();
		expect(Array.isArray(response.body)).toBeTruthy();
		expect(response.body.length).toBe(pageSize);
		response.body.forEach((post) => {
			expect(post).toHaveProperty("userId");
			expect(post).toHaveProperty("topicId");
			expect(post).toHaveProperty("description");
		});

		done();
	});

	describe("Create Post", () => {
		it("Should create a post", async (done) => {
			const userId = "5fc49ea94c87160f804ea6f8";
			const topicId = "5fc49f7045e98411d8bb3d77";
			const description = "Description";

			const response = await request.post("/posts").send({ userId, topicId, description });

			console.log(response.body);

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty("userId", userId);
			expect(response.body).toHaveProperty("topicId", topicId);
			expect(response.body).toHaveProperty("description", description);

			done();
		});

		describe("Fail to Create a Post", () => {
			it("Should not create a post if no userId is given", async (done) => {
				const topicId = "4ba4262a2dee0d31529123fe";
				const description = "Description";

				const response = await request.post("/posts").send({ topicId, description });

				console.log(response.body);

				expect(response.statusCode).toBe(500);
				expect(response.body).toHaveProperty("message");
				expect(response.body).toHaveProperty("error._message", "Post validation failed");

				done();
			});

			it("Should not create a post if no topicId is given", async (done) => {
				const userId = "4ba4262a2dee0d31529123fe";
				const description = "Description";

				const response = await request.post("/posts").send({ userId, description });

				console.log(response.body);

				expect(response.statusCode).toBe(500);
				expect(response.body).toHaveProperty("message");
				expect(response.body).toHaveProperty("error._message", "Post validation failed");

				done();
			});
		});
	});

	describe("Updating post comments", () => {
		it("Should add new comment id to post.comments", async (done) => {
			const userId = "4ba4262a2dee0d31529123fe";
			const postId = "5fb63e8e947ec02b0f8b7780";
			const comment = "Comment 1";

			const response = await request.post("/posts/comments/").send({ userId, comment, postId });

			console.log(response.body);

			expect(response.statusCode).toBe(201);
			expect(response.body).toBeTruthy();
			expect(response.body.post).toHaveProperty("userId");
			expect(response.body.post).toHaveProperty("_id", postId);
			expect(Array.isArray(response.body.post.comments)).toBeTruthy();
			expect(response.body.newComment).toHaveProperty("comment", comment);
			expect(response.body.newComment).toHaveProperty("userId", userId);
			expect(response.body.newComment).toHaveProperty("postId", postId);

			done();
		});

		it("Should not add comment id if no userId is given", async (done) => {
			const postId = "5fb63e8e947ec02b0f8b7780";
			const comment = "Comment 1";

			const response = await request.post("/posts/comments/").send({ comment, postId });

			console.log(response.body);

			expect(response.statusCode).toBe(500);
			expect(response.body).toHaveProperty("message", "ERROR CREATING COMMENT");
			expect(response.body).toHaveProperty("error._message", "Comment validation failed");

			done();
		});
	});
});
