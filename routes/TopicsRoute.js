import TopicService from "../services/TopicService";
import express from "express";

const router = express.Router();

// TODO: AND AUTH MIDDLEWARE
router.get("/", TopicService.findAll);

router.get("/id/:id", TopicService.findById);

router.get("/name/:topicName", TopicService.findByTopicName);

router.get("/user/:createdUserId", TopicService.findByCreatedUserId);

router.post("/id", TopicService.findAllByIds);

router.post("/", TopicService.createTopic);

export default router;
