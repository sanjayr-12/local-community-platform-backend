import { Service } from "typedi";
import cloudinary from "../core/cloudinary.ts";

@Service()
export class StorageService {
  async uploadImage(image: string) {
    try {
      const result = await cloudinary.uploader.upload(image, {
        folder: "my-app",
      });
      const urlObj = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      return [true, urlObj];
    } catch (error) {
      return [false, error.message];
    }
  }
}
