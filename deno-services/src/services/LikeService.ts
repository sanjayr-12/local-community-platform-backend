import { Service } from "typedi";
import { LikeRepository } from "../repository/LikeRepository.ts";

@Service()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async likePost(postId: number, userId: number) {
    return await this.likeRepository.addLike(postId, userId);
  }

  async unlikePost(postId: number, userId: number) {
    return await this.likeRepository.removeLike(postId, userId);
  }
}
