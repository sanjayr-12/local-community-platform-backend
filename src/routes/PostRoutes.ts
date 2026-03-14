import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import {
  addPostController,
  getAllPostController,
  getMyPostsController,
  uploadImageController,
} from "../controllers/PostController.ts";

const postRouter = new Hono();

postRouter.use(authMiddleware);

postRouter.post("/", addPostController);
postRouter.post("/upload", uploadImageController);
postRouter.get("/", getAllPostController);
postRouter.get("/my", getMyPostsController)

export default postRouter;
