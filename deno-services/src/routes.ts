import { Hono } from "hono";
import userRouter from "./routes/UserRoutes.ts";
import postRouter from "./routes/PostRoutes.ts";
import likeRouter from "./routes/LikeRoutes.ts";
import commentRouter from "./routes/CommentRoutes.ts";

export const allRoutes: { path: string; handler: Hono }[] = [
  { path: "user", handler: userRouter },
  { path: "post", handler: postRouter },
  { path: "like", handler: likeRouter },
  { path: "comment", handler: commentRouter },
];

