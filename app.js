import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import usersRouter from "./routes/UsersRoute";
import topicsRouter from "./routes/TopicsRoute";
import postRouter from "./routes/PostsRoute";
import eventsRouter from "./routes/EventsRoute";
import cors from "cors";
import { connectToDatabase } from "./DataBaseConnection";

const app = express();

connectToDatabase();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/topics", topicsRouter);
app.use("/events", eventsRouter);
app.use("/posts", postRouter);

export default app;
