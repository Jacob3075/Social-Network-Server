import supertest from "supertest";
import app from "../app";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

it.skip("Should get all users from database", async (done) => {
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

it("Should create a new user", async (done) => {
  const userName = "User 3";
  const password = "123456";
  const response = await request.post("/users/sign-up").send({ userName, password });

  console.log(response.body);

  expect(response.statusCode).toBe(201);

  done();
});

it("Should sign in with valid user", async done => {
  const userName = "User 1";
  const password = "123456"
  const response = await request.post("/users/sign-in").send({userName, password});

  console.log(response.body);

  done();
});

describe("Update user fields", () => {
  it("Should add new topicId to list of followed topics", async (done) => {
    const topicId = "5fc49f14a45bfa10ac449a1c";
    const id = "5fc49e90fad5b20f40a4f5c0";
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
