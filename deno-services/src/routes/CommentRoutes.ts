import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import {
  addCommentController,
  deleteCommentController,
  getCommentsController,
} from "../controllers/CommentController.ts";

const commentRouter = new Hono();

commentRouter.use(authMiddleware);

commentRouter.post("/:postId", addCommentController);
commentRouter.get("/:postId", getCommentsController);
commentRouter.delete("/:commentId", deleteCommentController);

export default commentRouter;
