import supertest from "supertest";
import app from "../app";
import { afterAll, beforeAll, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

it("Should get user from database", async done => {
  const response = await request.get("/users");

  expect(response.status).toBe(200);
  expect(response.body.length).toBeGreaterThan(1);
  expect(response.body[0]).toHaveProperty("userName");
  console.log(response.body);

  done();
});
