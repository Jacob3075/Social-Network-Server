import EventService from "../services/EventService";
import express from "express";

const router = express.Router();

router.get("/", EventService.findAll);

export default router;
