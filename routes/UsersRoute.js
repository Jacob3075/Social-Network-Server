import express from "express";
import UserService from "../services/UserService";
import checkAuthorization from "../middlewares/Authorization";

const router = express.Router();

router.get("/", UserService.findAll);

router.get("/email/:email", UserService.findByEmail);

router.get("/id/:id", UserService.findById);

router.post("/sign-up", UserService.signUp);

router.post("/sign-in", UserService.signIn);

router.delete("/:id", checkAuthorization, UserService.deleteById);

export default router;
