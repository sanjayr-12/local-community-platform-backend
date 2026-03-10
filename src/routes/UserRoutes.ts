import { Hono } from "hono";
import {
  addUserPostController,
  getUserProfileController,
  googleAuthController,
} from "../controllers/UserController.ts";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";

const userRouter = new Hono();

userRouter.post("/google", googleAuthController);

userRouter.use(authMiddleware);

userRouter.get("/me", getUserProfileController);
userRouter.post("/post", addUserPostController);

export default userRouter;
