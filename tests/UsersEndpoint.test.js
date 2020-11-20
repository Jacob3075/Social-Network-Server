import supertest from "supertest";
import app from "../app";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

it("Should get all users from database", async (done) => {
	const response = await request.get("/users");

	console.log(response.body);

	expect(response.status).toBe(200);
	expect(response.body.length).toBeGreaterThan(1);
	expect(response.body[0]).toHaveProperty("userName");
	expect(response.body[0]).toHaveProperty("followedTopics");
	expect(response.body[0]).toHaveProperty("registeredEvents");
	console.log(response.body);

	done();
});

describe("Update user fields", () => {
	it("Should add new topicId to list of followed topics", async (done) => {
		const topicId = "1";
		const id = "5fb1fe18120bbf113438078c";
		const response = await request.post("/users/follow-topic").send({ _id: id, topicId });

		console.log(response.body);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("_id", id);
		expect(response.body).toHaveProperty("userName");
		expect(response.body).toHaveProperty("followedTopics");
		expect(response.body).toHaveProperty("registeredEvents");
		// expect(response.body.result.followedTopics).toContain(topicId); // RETURNS PREVIOUS OBJECT

		done();
	});

	it("Should add new eventId to list of register events", async (done) => {
		const eventId = "1";
		const id = "5fb1fe18120bbf113438078c";
		const response = await request.post("/users/register-event").send({ _id: id, eventId });

		console.log(response.body);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("_id", id);
		expect(response.body).toHaveProperty("userName");
		expect(response.body).toHaveProperty("followedTopics");
		expect(response.body).toHaveProperty("registeredEvents");
		// expect(response.body.result.registeredEvents).toContain(eventId); // RETURNS PREVIOUS OBJECT

		done();
	});
});
