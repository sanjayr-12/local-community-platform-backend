import { OAuth2Client } from "google-auth-library";
import { Config } from "./config.ts";

export const googleAuthClient = new OAuth2Client(
  Config.GOOGLE_CLIENT_ID,
  undefined,
  "http://localhost:3000",
);

export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: token,
      audience: Config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return payload;
  } catch (error) {
    console.error("Google Token Verification Failed:", error);
    return null;
  }
};
