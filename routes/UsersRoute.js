import express from "express";
import UserService from "../services/UserService";
import checkAuthorization from "../middlewares/Authorization";
import TopicService from "../services/TopicService";

const router = express.Router();

router.get("/", UserService.findAll);

router.get("/userName/:userName", UserService.findByUserName);

router.get("/id/:id", UserService.findById);

router.get("/topics/:createdUserId", TopicService.findByCreatedUserId);

router.post("/sign-up", UserService.signUp);

router.post("/sign-in", UserService.signIn);

router.delete("/:id", checkAuthorization, UserService.deleteById);

export default router;
