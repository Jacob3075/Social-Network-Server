import supertest from "supertest";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import app from "../app";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

describe("Testing Topics Endpoints", () => {
	describe("Get topics from database", () => {
		it("Should get all topics from database", async (done) => {
			const response = await request.get("/topics");

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toBeGreaterThanOrEqual(1);
			expect(response.body[0]).toHaveProperty("topicName");
			expect(response.body[0]).toHaveProperty("description");
			expect(response.body[0]).toHaveProperty("createdUserId");

			done();
		});

		it("Should get topic by id", async (done) => {
			const response = await request.get("/topics/id/5fb4ba2a2dee0d31529a82fe");

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("topicName");
			expect(response.body).toHaveProperty("description");
			expect(response.body).toHaveProperty("createdUserId");

			done();
		});

		it("Should fail when finding by invalid id", async (done) => {
			const response = await request.get("/topics/id/123");

			console.log(response.body);

			expect(response.statusCode).toBe(500);
			expect(response.body).toHaveProperty("message", "INTERNAL SERVER ERROR");
			expect(response.body).toHaveProperty("error");

			done();
		});

		it("Should get topics by ids", async (done) => {
			let ids = ["5fb4ba2a2dee0d31529a82fe", "5fb4bb45fab42c3425f897db"];
			const response = await request.post("/topics/id").send({ ids: ids });

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toBe(ids.length);
			console.log(response.body);

			done();
		});

		it("Should get topic by name", async (done) => {
			const topicName = "Topic 1";
			const response = await request.get("/topics/name/" + topicName);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("topicName", topicName);
			expect(response.body).toHaveProperty("description");
			expect(response.body).toHaveProperty("createdUserId");

			done();
		});

		it("Should get topics by createdUserId", async (done) => {
			const createdUserId = "5fb1fe18120bbf113438078c";
			const response = await request.get("/topics/user/" + createdUserId);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body[0]).toHaveProperty("createdUserId", createdUserId);
			expect(response.body[0]).toHaveProperty("topicName");
			expect(response.body[0]).toHaveProperty("description");

			done();
		});
	});

	describe("Create topic", () => {
		it("Should create topic", async (done) => {
			const topicName = "Topic 2";
			const description = "Description";
			const createdUserId = "5fc49e90fad5b20f40a4f5c0";

			const response = await request
				.post("/topics/")
				.send({ topicName: topicName, description: description, createdUserId: createdUserId });

			console.log(response.body);

			expect(response.statusCode).toBe(201);
			expect(response.body).toHaveProperty("topicName", topicName);
			expect(response.body).toHaveProperty("description", description);
			expect(response.body).toHaveProperty("createdUserId", createdUserId);

			done();
		});

		it("Should fail when creating a topics without one of its properties", async (done) => {
			const response = await request
				.post("/topics/")
				.send({ topicName: "Topic 1", description: "Description" });

			console.log(response.body);

			expect(response.statusCode).toBe(500);
			expect(response.body).toHaveProperty("error");
			expect(response.body).toHaveProperty("message");

			done();
		});

		it("Should fail when creating a topics with duplicate topicName", async (done) => {
			const response = await request.post("/topics/").send({
				topicName: "Topic 1",
				description: "Description",
				createdUserId: "5fb1fe18120bbf113438078c",
			});

			console.log(response.body);

			expect(response.statusCode).toBe(409);
			expect(response.body).toHaveProperty("error");
			expect(response.body).toHaveProperty("message", "TOPIC ALREADY EXISTS");

			done();
		});
	});
});
