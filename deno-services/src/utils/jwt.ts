import { sign, verify } from "hono/jwt";
import { Config } from "../core/config.ts";

export const generateJWT = async (payload: any) => {
  try {
    if (typeof payload !== "object" || payload === null) {
      throw new Error("Invalid Payload");
    }
    const secret = Config.JWT_SECRET;
    const token = await sign(payload, secret);
    return token;
  } catch (error) {
    throw error;
  }
};

export const verifyJWT = async (token: string) => {
  try {
    const secret = Config.JWT_SECRET;
    const decodedPayload = await verify(token, secret, "HS256");
    return decodedPayload;
  } catch (error) {
    throw error;
  }
};
