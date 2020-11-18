import PostService from "../services/PostService";
import express from "express";

const router = express.Router();

router.get("/", PostService.findAll)

export default router;
