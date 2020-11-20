import app from "../app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

describe("Testing Events Endpint", () => {
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
	});

	describe("Creating New Events", () => {
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
