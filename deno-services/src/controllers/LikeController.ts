import { Context } from "hono";
import Joi from "joi";
import { likeService } from "../services/index.ts";

export const likePostController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { error } = Joi.object({
      postId: Joi.number().required(),
    }).validate(body);
    if (error) return c.json({ status: "error", message: error.message }, 406);

    const userId = c.get("user").id;
    const [status, response] = await likeService.likePost(body.postId, userId);
    if (!status) return c.json({ status: "error", message: response }, 406);
    return c.json({ status: "ok", message: response }, 200);
  } catch (err) {
    console.log("likePostController():: ", err.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const unlikePostController = async (c: Context) => {
  try {
    const postId = Number(c.req.param("id"));
    const userId = c.get("user").id;
    const [status, response] = await likeService.unlikePost(postId, userId);
    if (!status) return c.json({ status: "error", message: response }, 406);
    return c.json({ status: "ok", message: response }, 200);
  } catch (err) {
    console.log("unlikePostController():: ", err.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};
