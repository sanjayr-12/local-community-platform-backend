import { Service } from "typedi";
import { PostRepository } from "../repository/PostRepository.ts";
import { getReverseLocation } from "../utils/utils.ts";
import { Location } from "../types.ts";

@Service()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async addPost(data: {
    userId: number;
    content: string;
    imageUrl?: string;
    publicId?: string;
    lat: string;
    long: string;
    location: any;
  }) {
    const location: any = await getReverseLocation(data.lat, data.long);

    if (
      !location?.address?.county ||
      !location?.address?.state ||
      !location?.address?.state_district
    ) {
      throw new Error("Location data is incomplete");
    }

    const locationObj: Location = {
      county: location.address.county,
      state: location.address.state,
      state_district: location.address.state_district,
    };

    data["location"] = locationObj;

    try {
      const response = await this.postRepository.addPost(data);

      return [true, response];
    } catch (_) {
      return [false, "Error while adding post"];
    }
  }

  async getPosts(lat: string, long: string, userId: number) {
    const location: any = await getReverseLocation(lat, long);

    if (
      !location?.address?.county ||
      !location?.address?.state ||
      !location?.address?.state_district
    ) {
      throw new Error("Location data is incomplete");
    }

    const locationObj: Location = {
      county: location.address.county,
      state: location.address.state,
      state_district: location.address.state_district,
    };

    const [status, data] = await this.postRepository.getPosts(
      locationObj,
      userId,
    );
    if (status) {
      return [true, data];
    }
    return [false, "Something went wrong"];
  }

  async getMyPosts(userId: number) {
    return await this.postRepository.getMyPosts(userId);
  }
}
