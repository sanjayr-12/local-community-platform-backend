import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import {
  addPostController,
  getAllPostController,
  uploadImageController,
} from "../controllers/PostController.ts";

const postRouter = new Hono();

postRouter.use(authMiddleware);

postRouter.post("/", addPostController);
postRouter.post("/upload", uploadImageController);
postRouter.get("/", getAllPostController);

export default postRouter;
