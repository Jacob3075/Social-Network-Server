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

      done();
    });

    it("Should get post by id", async done => {
      const response = await request.get("/");

      console.log(response.body);

      done();
    });

    it("Should get posts by ids", async done => {
      const response = await request.get("/");

      console.log(response.body);

      done();
    });

    it("Should get posts by user", async done => {
      const response = await request.get("/");

      console.log(response.body);

      done();
    });

    it("Should get posts by topic", async done => {
      const response = await request.get("/");

      console.log(response.body);

      done();
    });
  });

  describe("Create Post", () => {
    it("Should create a post", async done => {
      const response = await request.post("/");
      
      console.log(response.body);

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

