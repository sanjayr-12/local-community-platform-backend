import { Service } from "typedi";
import { PostRepository } from "../repository/PostRepository.ts";
import { getReverseLocation } from "../utils/utils.ts";
import { Location } from "../types.ts";
import { Config } from "../core/config.ts";

const ML_SERVICE_URL = Config.ML_SERVICE_URL ?? "http://localhost:8000";

async function callModerationService(text: string): Promise<boolean> {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/api/moderate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.is_toxic === true;
  } catch {
    return false;
  }
}

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

    const isToxic = await callModerationService(data.content);
    if (isToxic) {
      return [false, "Post violates community guidelines"];
    }

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
      // Record views for all returned posts asynchronously (non-blocking)
      const posts = data as any[];
      Promise.all(
        posts.map((p) => this.postRepository.addView(p.postId, userId)),
      ).catch(() => {});
      return [true, data];
    }
    return [false, "Something went wrong"];
  }

  async getMyPosts(userId: number) {
    return await this.postRepository.getMyPosts(userId);
  }

  async savePost(postId: number, userId: number) {
    return await this.postRepository.savePost(postId, userId);
  }

  async getSavedPost(userId: number) {
    return await this.postRepository.getSavedPost(userId);
  }

  async removeSavedPost(postId: number, userId: number) {
    return await this.postRepository.removeSavedPost(postId, userId);
  }

  async deletePost(postId: number, userId: number) {
    return await this.postRepository.deletePost(postId, userId);
  }

  async searchPosts(district: string, keyword: string, userId: number) {
    const [status, data] = await this.postRepository.searchPostsByKeyword(
      district,
      keyword,
      userId,
    );
    if (status) {
      const posts = data as any[];
      Promise.all(
        posts.map((p) => this.postRepository.addView(p.postId, userId)),
      ).catch(() => {});
      return [true, data];
    }
    return [false, "Something went wrong"];
  }

  async getTrending(district: string) {
    const [status, cached] = await this.postRepository.getTrendingByDistrict(district);
    if (status && cached) {
      return [true, cached];
    }
    try {
      const res = await fetch(
        `${ML_SERVICE_URL}/api/trending/${encodeURIComponent(district)}`,
        { signal: AbortSignal.timeout(10000) },
      );
      if (!res.ok) return [false, "No trending data available"];
      const data = await res.json();
      return [true, data];
    } catch {
      return [false, "Trending service unavailable"];
    }
  }
}

