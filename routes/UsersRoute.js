import express from "express";
import UserService from "../services/UserService";
import checkAuthorization from "../middlewares/Authorization";

const router = express.Router();

router.get("/", UserService.findAll);

router.get("/userName/:userName", UserService.findByUserName);

router.get("/id/:id", UserService.findById);

router.post("/sign-up", UserService.signUp);

router.post("/sign-in", UserService.signIn);

router.post("/follow-topic", checkAuthorization, UserService.addNewFollowedTopic);

router.post("/register-event", checkAuthorization, UserService.addNewRegisteredEvent);

router.delete("/:id", checkAuthorization, UserService.deleteById);

export default router;
