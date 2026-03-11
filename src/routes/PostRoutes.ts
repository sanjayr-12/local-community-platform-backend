import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import { addPostController } from "../controllers/PostController.ts";

const postRouter = new Hono();

postRouter.use(authMiddleware);

postRouter.post("/", addPostController);

export default postRouter;
