import { Hono } from "hono";
import userRouter from "./routes/UserRoutes.ts";

export const allRoutes: { path: string; handler: Hono }[] = [
  {
    path: "user",
    handler: userRouter,
  },
];
