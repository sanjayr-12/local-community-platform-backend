import { Container } from "typedi";
import { UserService } from "./UserService.ts";
import { PostService } from "./PostService.ts";

export const userService = Container.get(UserService);
export const postService = Container.get(PostService);
