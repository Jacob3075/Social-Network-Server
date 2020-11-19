import app from "../app";
import supertest from "supertest";
import { afterAll, beforeAll, describe, it } from "@jest/globals";
import { connectToDatabase, disconnectDatabase } from "../DataBaseConnection";

const request = supertest(app);

beforeAll(() => connectToDatabase());

afterAll(() => disconnectDatabase());

describe("Testing Posts Endpoints", () => {

  describe("Getting Posts", () => {

    it("Should get all posts", async done => {
      const response = await request.get("/posts");

      console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      response.body.forEach(post => {
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

    it("Should get post by id", async done => {
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

    it("Should get posts by ids", async done => {
      const ids = ["5fb63e8e947ec02b0f8b7780", "5fb6471a6054e13b4d936bb9", "5fb647286ee5fd3b7bd7f4a8", "5fb6472c8fb55c3ba54dd504", "5fb647396a761e3bb939260d"];

      const response = await request.post("/posts/id")
        .send({ ids });

      console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(ids.length);
      response.body.forEach(post => {
        expect(post).toHaveProperty("userId");
        expect(post).toHaveProperty("topicId");
        expect(post).toHaveProperty("description");
      });

      done();
    });

    it("Should get posts by user", async done => {
      const userId = "5fb1fe18120bbf452438078c";
      const response = await request.get("/posts/user/" + userId);

      console.log(response.body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(Array.isArray(response.body)).toBeTruthy();
      response.body.forEach(post => {
        expect(post).toHaveProperty("userId", userId);
        expect(post).toHaveProperty("topicId");
        expect(post).toHaveProperty("description");
      });

      done();
    });

    it("Should get posts by topic", async done => {
      const topicId = "4ba4262a2dee0d31529123fe"
      const response = await request.get("/posts/topic/" + topicId);

      console.log(response.body);

      done();
    });
  });

  describe("Create Post", () => {
    it("Should create a post", async done => {
      const userId = "5859fe28120bbf452438078c";
      const topicId = "4ba4262a2dee0d31529123fe";
      const description = "Description";

      const response = await request.post("/posts")
        .send({ userId, topicId, description });

      console.log(response.body);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("userId", userId);
      expect(response.body).toHaveProperty("topicId", topicId);
      expect(response.body).toHaveProperty("description", description);

      done();
    });

    describe("Fail to Create a Post", () => {
      it("Should not create a post if no userId is given", async done => {
        const response = await request.post("/");

        console.log(response.body);

        done();
      });

      it("Should not create a post if no topicId is given", async done => {
        const response = await request.post("/");

        console.log(response.body);

        done();
      });
    });
  });

  describe("Updating post comments", () => {

    it("Should add new comment id to post.comments", async done => {
      const response = await request.post("/");

      console.log(response.body);

      done();
    });

    it("Should not add duplicate comment id to post.comments", async done => {
      const response = await request.post("/");

      console.log(response.body);

      done();
    });

    it("Should not add comment id if no userId is given", async done => {
      const response = await request.post("/");

      console.log(response.body);

      done();
    });
  });
});

