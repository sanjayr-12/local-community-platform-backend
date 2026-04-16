import { Context } from "hono";
import Joi from "joi";
import { commentService } from "../services/index.ts";

export const addCommentController = async (c: Context) => {
  try {
    const postId = Number(c.req.param("postId"));
    const body = await c.req.json();
    const { error } = Joi.object({
      content: Joi.string().min(1).required(),
    }).validate(body);
    if (error) return c.json({ status: "error", message: error.message }, 406);

    const userId = c.get("user").id;
    const [status, response] = await commentService.addComment(
      postId,
      userId,
      body.content,
    );
    if (!status) return c.json({ status: "error", message: response }, 406);
    return c.json({ status: "ok", data: response }, 201);
  } catch (err) {
    console.log("addCommentController():: ", err.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const getCommentsController = async (c: Context) => {
  try {
    const postId = Number(c.req.param("postId"));
    const [status, response] = await commentService.getComments(postId);
    if (!status) return c.json({ status: "error", message: response }, 406);
    return c.json({ status: "ok", data: response }, 200);
  } catch (err) {
    console.log("getCommentsController():: ", err.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

export const deleteCommentController = async (c: Context) => {
  try {
    const commentId = Number(c.req.param("commentId"));
    if (!commentId || isNaN(commentId)) {
      return c.json({ status: "error", message: "Invalid comment id" }, 406);
    }
    const userId = c.get("user").id;
    const [status, response] = await commentService.deleteComment(commentId, userId);
    if (!status) return c.json({ status: "error", message: response }, 403);
    return c.json({ status: "ok", message: response }, 200);
  } catch (err) {
    console.log("deleteCommentController():: ", err.message);
    return c.json({ status: "error", message: "Internal server error" }, 500);
  }
};

