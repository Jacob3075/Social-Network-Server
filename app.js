import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import usersRouter from "./routes/UsersRoute";
import cors from "cors";
import "./DataBaseConnection"
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);

export default app;
