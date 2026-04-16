import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import {
  addPostController,
  deletePostController,
  getAllPostController,
  getMyPostsController,
  getSavedPostController,
  getTrendingController,
  removeSavedPostController,
  savePostController,
  searchPostsController,
  uploadImageController,
} from "../controllers/PostController.ts";

const postRouter = new Hono();

postRouter.use(authMiddleware);

postRouter.post("/", addPostController);
postRouter.post("/upload", uploadImageController);
postRouter.get("/", getAllPostController);
postRouter.get("/my", getMyPostsController);
postRouter.get("/trending", getTrendingController);
postRouter.get("/search", searchPostsController);
postRouter.delete("/:id", deletePostController);
postRouter.post("/save", savePostController);
postRouter.get("/save", getSavedPostController);
postRouter.delete("/save/:id", removeSavedPostController);

export default postRouter;

