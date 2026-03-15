import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import {
  addCommentController,
  getCommentsController,
} from "../controllers/CommentController.ts";

const commentRouter = new Hono();

commentRouter.use(authMiddleware);

commentRouter.post("/:postId", addCommentController);
commentRouter.get("/:postId", getCommentsController);

export default commentRouter;
