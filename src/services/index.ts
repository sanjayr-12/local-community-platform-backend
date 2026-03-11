import { Container } from "typedi";
import { UserService } from "./UserService.ts";
import { PostService } from "./PostService.ts";
import { StorageService } from "./StorageService.ts";

export const userService = Container.get(UserService);
export const postService = Container.get(PostService);
export const storageService = Container.get(StorageService);
