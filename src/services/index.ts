import { Container } from "typedi";
import { UserService } from "./UserService.ts";

export const userService = Container.get(UserService);
