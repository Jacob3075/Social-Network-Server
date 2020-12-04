import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import usersRouter from "./routes/UsersRoute";
import topicsRouter from "./routes/TopicsRoute";
import postRouter from "./routes/PostsRoute";
import eventsRouter from "./routes/EventsRoute";
import cors from "cors";
import { connectToDatabase } from "./DataBaseConnection";
import checkAuthorization from "./middlewares/Authorization";

const app = express();

connectToDatabase();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", usersRouter);
app.use("/topics", checkAuthorization, topicsRouter);
app.use("/events", checkAuthorization, eventsRouter);
app.use("/posts", checkAuthorization, postRouter);

export default app;
