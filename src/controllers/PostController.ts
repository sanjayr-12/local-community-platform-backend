import { Context } from "hono";
import Joi from "joi";
import { postService } from "../services/index.ts";

export const addPostController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const requestSchema = Joi.object({
      content: Joi.string().min(1).required(),
      image_url: Joi.string().min(1).optional(),
      lat: Joi.string().min(1).required(),
      long: Joi.string().min(1).required(),
    });

    const { error } = requestSchema.validate(body);
    if (error) {
      return c.json({ status: "error", message: error.message }, 406);
    }

    body.userId = c.get("user").id;

    const [status, response] = await postService.addPost(body);
    if (!status) {
      return c.json({ status: "error", message: response }, 406);
    }
    return c.json({ status: "ok", message: "Post created" });
  } catch (error) {
    console.log("addUserPostContoller():: " + error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};
