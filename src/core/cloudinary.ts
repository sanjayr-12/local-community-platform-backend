import { v2 as cloudinary } from "cloudinary";
import { Config } from "./config.ts";

cloudinary.config({
  cloud_name: Config.CLOUD_NAME,
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET,
});

export default cloudinary;
