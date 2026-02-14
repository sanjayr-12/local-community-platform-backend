import { Hono } from "hono";
import { googleAuthController } from "../controllers/UserController.ts";

const userRouter = new Hono();

userRouter.post("/google", googleAuthController);

export default userRouter;
