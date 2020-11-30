import app from "../app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

describe("Testing Events Endpoint", () => {
	describe("Getting Events", () => {
		it("Should get all events", async (done) => {
			const response = await request.get("/events/");

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			response.body.forEach((event) => {
				expect(event).toHaveProperty("userId");
				expect(event).toHaveProperty("topicId");
				expect(event).toHaveProperty("name");
				expect(event).toHaveProperty("description");
				expect(event).toHaveProperty("location");
				expect(event).toHaveProperty("registered");
				expect(event).toHaveProperty("time");
			});

			done();
		});

		it("Should get event by id", async (done) => {
			const eventId = "5fb77058f1ea2959b4cda67e";
			const response = await request.get("/events/id/" + eventId);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(response.body).toBeTruthy();
			expect(response.body).toHaveProperty("_id", eventId);
			expect(response.body).toHaveProperty("userId");
			expect(response.body).toHaveProperty("topicId");
			expect(response.body).toHaveProperty("name");
			expect(response.body).toHaveProperty("description");

			done();
		});

		it("Should find events by ids", async (done) => {
			const ids = [
				"5fb77058f1ea2959b4cda67e",
				"5fb7639de3d8744101366aa5",
				"5fb763a3cacc6e4147503c28",
			];
			const response = await request.post("/events/id").send({ ids });

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body.length).toBe(ids.length);
			response.body.forEach((event) => {
				expect(event).toHaveProperty("userId");
				expect(event).toHaveProperty("topicId");
				expect(event).toHaveProperty("_id");
			});

			done();
		});

		it("Should find events by user", async (done) => {
			const userId = "5859fe28120bbf452438078c";
			const response = await request.get("/events/user/" + userId);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			response.body.forEach((event) => {
				expect(event).toHaveProperty("userId", userId);
			});

			done();
		});

		it("Should find events by topic", async (done) => {
			const topicId = "4ba4262a2dee0d31529123fe";
			const response = await request.get("/events/topic/" + topicId);

			console.log(response.body);

			expect(response.statusCode).toBe(200);
			expect(Array.isArray(response.body)).toBeTruthy();
			response.body.forEach((event) => {
				expect(event).toHaveProperty("topicId", topicId);
			});

			done();
		});
	});

	describe.skip("Creating New Events", () => {
		it("Should create a new events", async (done) => {
			const userId = "5859fe28120bbf452438078c";
			const topicId = "4ba4262a2dee0d31529123fe";
			const name = "Event 1";
			const description = "New Event 1";
			const location = "PES ECC";

			const response = await request
				.post("/events/")
				.send({ userId, topicId, name, description, location });

			console.log(response.body);

			expect(response.statusCode).toBe(201);
			expect(response.body).toBeTruthy();
			expect(response.body).toHaveProperty("userId", userId);
			expect(response.body).toHaveProperty("topicId", topicId);
			expect(response.body).toHaveProperty("name", name);
			expect(response.body).toHaveProperty("description", description);
			expect(response.body).toHaveProperty("location", location);

			done();
		});
	});
});
