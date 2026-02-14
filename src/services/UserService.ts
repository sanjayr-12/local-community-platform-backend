import { Service } from "typedi";
import { UserRepository } from "../repository/UserRepository.ts";
import { generateUsername } from "unique-username-generator";
import { verifyGoogleToken } from "../core/google.ts";

@Service()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async signInWithGoogle(token: any) {
    try {
      const data = await verifyGoogleToken(token);
      if (!data) {
        throw new Error("No User details Received");
      }
      if (!data.email_verified) {
        throw new Error("Email not verified");
      }

      // check if user email is existing
      if (data.email) {
        const users = await this.userRepository.findUserByEmail(data.email);

        if (users && users.length > 0) {
          throw new Error("Email Already exisits");
        }
      }

      const username = generateUsername("_", 2, undefined, data.name);
      const newUser = {
        name: data.name,
        email: data.email,
        username: username,
        picture: data.picture || "",
      };
      const hasNullValue = Object.values(newUser).some(
        (value) => value === null,
      );
      if (hasNullValue) {
        throw new Error("User data has missing values");
      }

      const user = await this.userRepository.signInWithGoogle(newUser);
      return [true, user];
    } catch (error: any) {
      return [false, error.message];
    }
  }
}
