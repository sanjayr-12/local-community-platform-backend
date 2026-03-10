import { Context } from "hono";
import Joi from "joi";
import { userService } from "../services/index.ts";

export const googleAuthController = async (c: Context) => {
  try {
    const body = await c.req.json();

    const requestSchema = Joi.object({
      token: Joi.string().required(),
    });

    const { error } = requestSchema.validate(body);

    if (error) {
      return c.json({ status: "error", message: error.message }, 400);
    }

    const [ok, data] = await userService.signInWithGoogle(body.token);

    if (!ok) {
      return c.json({ status: "error", message: data }, 400);
    }

    return c.json({ status: "success", data }, 200);
  } catch (error: any) {
    console.log("googleAuthController():: " + error.message);

    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const getUserProfileController = (c: Context) => {
  try {
    const user = c.get("user");
    return c.json({ status: "ok", user });
  } catch (error: any) {
    console.log("getUserProfileController():: " + error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const addUserPostController = async (c: Context) => {
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

    // add user id
    body.userId = c.get("user").id;

    const [status, response] = await userService.addUserPost(body);
    if (!status) {
      return c.json({ status: "error", message: response }, 406);
    }
    return c.json({ status: "ok", message: "Post created" });
  } catch (error) {
    console.log("addUserPostContoller():: " + error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};
