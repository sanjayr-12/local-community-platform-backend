import { Hono } from "hono";
import {
  getUserProfileController,
  getUserProfileV2Controller,
  googleAuthController,
} from "../controllers/UserController.ts";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";

const userRouter = new Hono();

userRouter.post("/google", googleAuthController);

userRouter.use(authMiddleware);

userRouter.get("/me", getUserProfileController);
userRouter.get("/me/v2", getUserProfileV2Controller)

export default userRouter;
