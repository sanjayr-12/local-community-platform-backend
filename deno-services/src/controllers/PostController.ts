import { Context } from "hono";
import Joi from "joi";
import { postService, storageService } from "../services/index.ts";

export const addPostController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const requestSchema = Joi.object({
      content: Joi.string().min(1).required(),
      imageUrl: Joi.string().min(1).optional(),
      publicId: Joi.string().min(1).optional(),
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

export const uploadImageController = async (c: Context) => {
  try {
    const body = await c.req.json();
    const requestSchema = Joi.object({
      base64: Joi.string().min(1).required(),
    });
    const { error } = requestSchema.validate(body);
    if (error) {
      return c.json({ status: "error", message: error.message }, 406);
    }
    const [status, response] = await storageService.uploadImage(body.base64);
    if (!status) {
      return c.json({ status: "error", message: response }, 406);
    }
    return c.json({ status: "ok", data: response }, 200);
  } catch (error: any) {
    console.log("uploadImageController():: ", error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const getAllPostController = async (c: Context) => {
  try {
    const lat = c.req.query("lat");
    const long = c.req.query("long");

    if ((!lat || lat.trim() === "") && (!long || long.trim() === "")) {
      return c.json(
        {
          status: "error",
          message: "Missing latitude or longitude",
        },
        406,
      );
    }

    const user = c.get("user");
    const [status, response] = await postService.getPosts(lat, long, user.id);
    if (!status) {
      return c.json({ status: "error", message: response }, 406);
    }

    return c.json({ status: "ok", data: response }, 200);
  } catch (error) {
    console.log("getAllPostController():: ", error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const getMyPostsController = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const [status, response] = await postService.getMyPosts(userId);
    if (!status) {
      return c.json({ status: "error", message: response });
    }
    return c.json({ status: "ok", data: response }, 200);
  } catch (error) {
    console.log("getMyPostsController():: ", error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const savePostController = async(c:Context) =>{
  try {
    const body = await c.req.json();
    const requestSchema = Joi.object({
      postId: Joi.number().required()
    })
    const {error} = requestSchema.validate(body)
    if(error){
      return c.json({status:"error", message:error.message}, 406)
    }
    const user = c.get("user").id
    const [status, response] = await postService.savePost(body.postId, user);
    if(!status){
      return c.json({status:"error", message:response}, 406);
    }
    return c.json({status:"ok", data:response}, 200)
  } catch (error) {
    console.log("savePostController():: ", error.message)
    return c.json({status:"error", message:"Internal server error"}, 500)
  }
}

export const getSavedPostController = async(c:Context)=>{
  try {
    const user = c.get("user").id
    const [status, response] = await postService.getSavedPost(user);
    if(!status){
      return c.json({status:"error", message:response}, 406);
    }
    return c.json({status:"ok", data:response}, 200)
  } catch (error) {
    console.log("getSavedPostController():: ", error.message)
    return c.json({status:"error", message:"Internal server error"}, 500)
  }
}

export const removeSavedPostController = async(c:Context)=>{
  try {
    const id = Number(c.req.param('id'))

    const userId = c.get("user").id

    const [status, response] = await postService.removeSavedPost(id, userId)
    if(!status){
      return c.json({status:"error", message:response}, 406);
    }
    return c.json({status:"ok", data:response}, 200)
  } catch (error) {
    console.log("removeSavedPostController():: ", error.message)
    return c.json({status:"error", message:"Internal server error"}, 500)
  }
}

export const getTrendingController = async (c: Context) => {
  try {
    const district = c.req.query("district");
    if (!district || district.trim() === "") {
      return c.json({ status: "error", message: "district query param is required" }, 406);
    }
    const [status, response] = await postService.getTrending(district);
    if (!status) return c.json({ status: "error", message: response }, 503);
    return c.json({ status: "ok", data: response }, 200);
  } catch (error) {
    console.log("getTrendingController():: ", error.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};