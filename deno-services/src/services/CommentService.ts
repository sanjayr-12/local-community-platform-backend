import { Service } from "typedi";
import { CommentRepository } from "../repository/CommentRepository.ts";

@Service()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async addComment(postId: number, userId: number, content: string) {
    return await this.commentRepository.addComment(postId, userId, content);
  }

  async getComments(postId: number) {
    return await this.commentRepository.getComments(postId);
  }

  async deleteComment(commentId: number, userId: number) {
    return await this.commentRepository.deleteComment(commentId, userId);
  }
}

