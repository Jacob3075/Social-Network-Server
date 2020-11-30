import EventService from "../services/EventService";
import express from "express";
import { upload } from "../middlewares/ImageUpload";

const router = express.Router();

// TODO: AND AUTH MIDDLEWARE
router.get("/", EventService.findAll);

router.get("/id/:id", EventService.findById);

router.get("/user/:id", EventService.findByUser);

router.get("/topic/:id", EventService.findByTopic);

router.post("/id/", EventService.findByIds);

router.post("/topic/", EventService.findByTopics);

router.post("/registered/", EventService.updateRegistered);

router.post("/", upload.single("image"), EventService.createEvent);

export default router;
