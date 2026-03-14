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

export const getUserProfileV2Controller = async(c:Context)=>{
  try {
    const user = c.get("user").id
    const [status, response] = await userService.getMeV2(user);
    if(!status){
      return c.json({status:"error", message:response}, 406);
    }
    return c.json({status:"ok", message:response}, 200)
  } catch (error) {
    console.log("getUserProfileController():: " + error.message)
    return c.json({status:"error", message:"Internal server error"}, 500)
  }
}
