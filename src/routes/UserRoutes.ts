import { Hono } from "hono";
import {
  getUserProfileController,
  googleAuthController,
} from "../controllers/UserController.ts";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";

const userRouter = new Hono();

userRouter.post("/google", googleAuthController);

userRouter.use(authMiddleware);

userRouter.get("/me", getUserProfileController);

export default userRouter;
