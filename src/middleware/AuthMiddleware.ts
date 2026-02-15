import { Context, Next } from "hono";
import { verifyJWT } from "../utils/jwt.ts";
import { Container } from "typedi";
import { UserRepository } from "../repository/UserRepository.ts";

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  const userRepository = Container.get(UserRepository);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      { status: "error", message: "Missing or invalid Authorization header" },
      401,
    );
  }
  const token = authHeader.slice(7);

  const decodedPayload = await verifyJWT(token);

  const user = await userRepository.findUserById(decodedPayload.id as number);

  if (user.length === 0) {
    return c.json({ status: "error", message: "Invalid User" }, 401);
  }

  c.set("user", user);

  await next();
};
