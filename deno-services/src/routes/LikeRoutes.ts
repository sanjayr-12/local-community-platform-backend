import { Hono } from "hono";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";
import { likePostController, unlikePostController } from "../controllers/LikeController.ts";

const likeRouter = new Hono();

likeRouter.use(authMiddleware);

likeRouter.post("/", likePostController);
likeRouter.delete("/:id", unlikePostController);

export default likeRouter;
