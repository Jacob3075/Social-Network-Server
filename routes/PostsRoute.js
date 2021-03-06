import PostService from "../services/PostService";
import express from "express";
import { upload } from "../middlewares/ImageUpload";

const router = express.Router();

router.get("/", PostService.findAll);

router.get("/id/:id", PostService.findById);

router.post("/id/", PostService.findByIds);

router.get("/user/:userId", PostService.findByUser);

router.get("/topic/:topicId", PostService.findByTopic);

router.post("/topic/", PostService.findByTopics);

router.post("/comments/", PostService.addNewComment);

router.post("/likes/", PostService.updateLikes);

router.post("/", upload.single("image"), PostService.createPost);

export default router;
